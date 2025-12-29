# Helm (anlatim)

## Nedir?
Helm chart ile shortener + redirector + opsiyonel Redis kurulur. Degerleri `values.yaml` ile yonetilir.

## Kurulum
```bash
helm upgrade --install url-shortener charts/url-shortener \
  -n url-shortener --create-namespace \
  --set shortener.image.repository=ghcr.io/<user>/shortener \
  --set redirector.image.repository=ghcr.io/<user>/redirector
```

## Redis harici ise
```bash
helm upgrade --install url-shortener charts/url-shortener \
  -n url-shortener --create-namespace \
  --set redis.enabled=false \
  --set redis.host=<redis-host> \
  --set redis.port=6379
```

## Ingress
`values.yaml` altindan shortener ve redirector icin host/path tanimlanabilir.

## Monitoring
ServiceMonitor ve PrometheusRule acmak icin:
```bash
helm upgrade --install url-shortener charts/url-shortener \
  -n url-shortener --create-namespace \
  --set monitoring.serviceMonitor.enabled=true \
  --set monitoring.prometheusRule.enabled=true \
  --set monitoring.serviceMonitor.releaseLabel=monitoring
```

## Notlar
- Prometheus Operator CRD'leri olmadan ServiceMonitor/PrometheusRule calismaz.
- Redis icin PVC yok; `emptyDir` kullanilir.
