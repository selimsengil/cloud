# shortener-service

## Purpose
Generates short codes for URLs and persists them to Redis. This service is stateless aside from Redis.

## API
Base path: `/`

### `POST /shorten`
Request body:
```json
{"url": "https://example.com"}
```
Responses:
- `201` with `{"code":"abc12","short_url":"http://host/abc12"}` when created
- `400` with `{"error":"valid http/https url is required"}` for invalid input
- `500` with `{"error":"could not allocate code"}` if code allocation fails

Input rules:
- Accepts **only** `http` or `https` URLs.
- Requires a host (`netloc`) component.
- Leading/trailing whitespace is trimmed.

### `GET /health`
Returns `200` with `{"status":"ok"}` if Redis is reachable, otherwise `503`.

### `GET /metrics`
Prometheus metrics in text format.

## How it works
- Generates 5-character codes using lowercase letters + digits.
- Tries up to 10 candidates to avoid collisions (`SETNX`).
- Stores `code -> long_url` in Redis without TTL.
- If `REDIRECT_BASE_URL` is set, `short_url` is computed as `base + "/" + code`.

## Configuration
Environment variables:
- `REDIS_HOST` (default `localhost`)
- `REDIS_PORT` (default `6379`)
- `REDIRECT_BASE_URL` (optional; used to return full short URL)

## Metrics
Counters:
- `shortener_requests_total{result="ok|bad_request|error"}`

Histograms:
- `shortener_request_duration_seconds{result="ok|bad_request|error"}`

## Runtime and container
- Exposes port `5000`.
- Container uses `python:3.12-alpine` and runs `gunicorn`.
- Stateless; safe to scale horizontally as long as Redis is shared.

## Failure modes
- Redis unavailable: `/health` returns 503; `/shorten` will fail on `setnx`.
- High collision rate: after 10 attempts, returns `500`.

## Security notes
- No authentication or authorization.
- Only http/https URLs allowed to reduce unsafe redirect schemes.

## Files
- App: `shortener-service/app.py`
- Dependencies: `shortener-service/requirements.txt`
- Container: `shortener-service/Dockerfile`
