# shortener-service (anlatim)

## Nedir?
Bu servis, kullanicinin verdigi uzun URL icin kisa bir kod uretir ve bu kodu Redis'e kaydeder.

## Nasil calisir?
1) Kullanici `POST /shorten` ile bir URL gonderir.
2) Servis 5 karakterlik bir kod uretir.
3) Bu kodu Redis'e `code -> long_url` seklinde yazar.
4) Basarili olursa `201` ve kodu dondurur.

## URL kurallari
- Sadece `http` veya `https` kabul edilir.
- URL'nin host kismi olmalidir (ornegin `https://example.com`).

## API ozet
- `POST /shorten`: kod uretir
- `GET /health`: Redis erisimi kontrolu
- `GET /metrics`: Prometheus metrikleri

## Ayarlar (env)
- `REDIS_HOST` (varsayilan `localhost`)
- `REDIS_PORT` (varsayilan `6379`)
- `REDIRECT_BASE_URL` (opsiyonel, donen `short_url` icin kullanilir)

## Basarisiz durumlar
- Redis yoksa `/health` 503 doner.
- Uretilen kod Redis'e yazilamazsa 500 doner.

## Dosyalar
- Uygulama: `shortener-service/app.py`
- Bagimliliklar: `shortener-service/requirements.txt`
- Docker: `shortener-service/Dockerfile`
