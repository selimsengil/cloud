# Docker Compose (Local Stack)

## Purpose
Runs Redis, shortener-service, and redirect-service locally with port mappings suited for manual testing.

## Services and ports
- `redis`
  - Image: `redis:7-alpine`
  - Host port: `6380` -> Container port: `6379`
- `shortener`
  - Built from `shortener-service/`
  - Host port: `5001` -> Container port: `5000`
  - Env:
    - `REDIS_HOST=redis`
    - `REDIS_PORT=6379`
    - `REDIRECT_BASE_URL=http://localhost:3000`
- `redirector`
  - Built from `redirect-service/`
  - Host port: `3000` -> Container port: `3000`
  - Env:
    - `REDIS_HOST=redis`
    - `REDIS_PORT=6379`

## Commands
Start:
```bash
docker compose up --build
```

Stop and clean:
```bash
docker compose down -v
```

## Quick test
```bash
curl -s -X POST http://localhost:5001/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

curl -I http://localhost:3000/<code>
```

## Notes
- `REDIRECT_BASE_URL` controls the `short_url` returned by the shortener.
- If port `3000` is already in use on your machine, either free the port or update the Compose mapping.

## File
- `docker-compose.yml`
