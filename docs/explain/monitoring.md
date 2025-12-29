# Monitoring (anlatim)

## Metrikler
Her iki servis `/metrics` uzerinden Prometheus metrikleri verir.

## ServiceMonitor
- `k8s/servicemonitor-shortener.yaml`
- `k8s/servicemonitor-redirector.yaml`
Prometheus Operator varsa bu dosyalar metrik toplamayi baslatir.

## Alert kurallari
`k8s/alerts-url-shortener.yaml` dosyasi hata orani ve p95 latency icin uyarilar tanimlar.

## Grafana dashboard
`k8s/grafana-dashboard-url-shortener.yaml` ile "URL Shortener Overview" dashboard'u gelir.

## Prometheus/Grafana ayarlari
`k8s/monitoring-values.yaml` kube-prometheus-stack icin ornek values dosyasidir.

## Loki
`k8s/loki-stack-values.yaml` ile log toplama icin Loki + Promtail ayari bulunur.

## Loglar
Uygulama loglari stdout/stderr uzerinden akar:
```bash
kubectl logs deployment/shortener
kubectl logs deployment/redirector
```
