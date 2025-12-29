# Scripts

## Smoke test
File: `scripts/smoke_test.sh`

Purpose:
- Waits for `/health` on both services
- Calls `POST /shorten`
- Follows with `GET /:code` and validates 302 + Location header

Environment variables:
- `SHORTENER_URL` (default `http://localhost:5001`)
- `REDIRECTOR_URL` (default `http://localhost:3000`)
- `LONG_URL` (default `https://example.com`)

Usage:
```bash
bash scripts/smoke_test.sh
```

## Load test (k6)
File: `scripts/load_test.js`

Purpose:
- Generates unique URLs
- Shortens then immediately redirects to validate flow under load

Environment variables:
- `SHORTENER_URL` (default `http://localhost:5001`)
- `REDIRECTOR_URL` (default `http://localhost:3000`)
- `LONG_URL_BASE` (default `https://example.com`)

Usage:
```bash
k6 run scripts/load_test.js
```

Thresholds:
- `http_req_failed < 5%`
- `p(95) < 1000ms`
