# Scripts (anlatim)

## smoke_test.sh
- Servislerin `/health` endpointlerini bekler.
- `POST /shorten` ile kod uretir.
- `GET /:code` ile 302 ve Location dogrular.

Env degiskenleri:
- `SHORTENER_URL` (varsayilan `http://localhost:5001`)
- `REDIRECTOR_URL` (varsayilan `http://localhost:3000`)
- `LONG_URL` (varsayilan `https://example.com`)

Calistirma:
```bash
bash scripts/smoke_test.sh
```

## load_test.js (k6)
- Yuk testi yapar, kisa kod uretir ve yonlendirme kontrol eder.

Env degiskenleri:
- `SHORTENER_URL`
- `REDIRECTOR_URL`
- `LONG_URL_BASE`

Calistirma:
```bash
k6 run scripts/load_test.js
```
