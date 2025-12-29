# redirect-service

## Purpose
Resolves short codes from Redis and issues HTTP 302 redirects.

## API
Base path: `/`

### `GET /:code`
Behavior:
- If `code` exists in Redis, returns `302` with `Location: <long_url>`.
- If not found, returns `404` with `not found`.
- On Redis or internal errors, returns `500` with `internal error`.

### `GET /health`
Returns `200` with `ok` if Redis is reachable, otherwise `503`.

### `GET /metrics`
Prometheus metrics in text format.

### `GET /`
Simple liveness string: `redirector up`.

## How it works
- Uses a single Redis connection for all requests.
- Reads long URL with `GET <code>`.
- Emits Prometheus metrics for hit/miss/error and request duration.

## Configuration
Environment variables:
- `REDIS_HOST` (default `localhost`)
- `REDIS_PORT` (default `6379`)
- `PORT` (default `3000`)

## Metrics
Counters:
- `redirector_requests_total{result="hit|miss|error"}`

Histograms:
- `redirector_request_duration_seconds{result="hit|miss|error"}`

## Runtime and container
- Exposes port `3000`.
- Container uses `node:20-alpine`.
- Stateless; safe to scale horizontally as long as Redis is shared.

## Failure modes
- Redis disconnected: `/health` returns 503; requests return `500`.
- Missing code: returns `404`.

## Security notes
- No authentication or authorization.
- Assumes values in Redis are safe to redirect to; relies on shortener input validation.

## Files
- App: `redirect-service/server.js`
- Dependencies: `redirect-service/package.json`
- Container: `redirect-service/Dockerfile`
