# redirect-service (anlatim)

## Nedir?
Bu servis, kisa kodu Redis'ten bulur ve kullaniciyi gercek URL'ye yonlendirir (302).

## Nasil calisir?
1) Kullanici `GET /:code` ile bir kod ister.
2) Servis Redis'ten uzun URL'yi okur.
3) Bulursa `302` ve `Location` header dondurur.
4) Bulamazsa `404` doner.

## API ozet
- `GET /:code`: yonlendirme
- `GET /health`: Redis erisimi kontrolu
- `GET /metrics`: Prometheus metrikleri
- `GET /`: basit up mesaji

## Ayarlar (env)
- `REDIS_HOST` (varsayilan `localhost`)
- `REDIS_PORT` (varsayilan `6379`)
- `PORT` (varsayilan `3000`)

## Basarisiz durumlar
- Redis yoksa `/health` 503 doner, istekler 500 gorebilir.
- Kod yoksa 404 doner.

## Dosyalar
- Uygulama: `redirect-service/server.js`
- Bagimliliklar: `redirect-service/package.json`
- Docker: `redirect-service/Dockerfile`
