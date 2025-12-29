# Docker Compose (anlatim)

## Nedir?
Lokal gelistirme icin tum servisi tek komutla ayaga kaldirir.

## Hangi servisler var?
- `redis`: veri saklama (6379)
- `shortener`: kod uretir (host 5001)
- `redirector`: yonlendirme yapar (host 3000)

## Portlar
- shortener: `http://localhost:5001`
- redirector: `http://localhost:3000`
- redis: `localhost:6380`

## Baslat / Durdur
```bash
docker compose up --build
```
```bash
docker compose down -v
```

## Hizli test
```bash
curl -s -X POST http://localhost:5001/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

curl -I http://localhost:3000/<code>
```

## Notlar
- `REDIRECT_BASE_URL` shortener'in dondugu `short_url` icin kullanilir.
- 3000 portu baska bir proses tarafindan kullaniliyorsa redirector kalkmaz.

## Dosya
- `docker-compose.yml`
