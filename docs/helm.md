# Helm Chart (charts/url-shortener)

## Purpose
Installs the full stack (shortener, redirector, optional Redis) via Helm with configurable images, ingress, and monitoring.

## Chart layout
- `Chart.yaml` — chart metadata
- `values.yaml` — defaults
- `templates/` — Deployments, Services, ConfigMap, Ingress, monitoring, Redis

## Key values
Top-level:
- `redirectBaseUrl`: used in ConfigMap as `REDIRECT_BASE_URL`
- `nameOverride`, `fullnameOverride`: name control

Shortener:
- `shortener.image.repository`, `shortener.image.tag`, `shortener.image.pullPolicy`
- `shortener.replicaCount`, `shortener.containerPort`
- `shortener.service.type`, `shortener.service.port`
- `shortener.resources`, `shortener.nodeSelector`, `shortener.tolerations`, `shortener.affinity`

Redirector:
- `redirector.image.repository`, `redirector.image.tag`, `redirector.image.pullPolicy`
- `redirector.replicaCount`, `redirector.containerPort`
- `redirector.service.type`, `redirector.service.port`
- `redirector.resources`, `redirector.nodeSelector`, `redirector.tolerations`, `redirector.affinity`

Redis:
- `redis.enabled` to deploy internal Redis
- `redis.host`, `redis.port` when using external Redis
- `redis.image.*`, `redis.resources`, scheduling knobs

Ingress:
- `ingress.shortener.*` and `ingress.redirector.*` for hosts, paths, annotations, className

Monitoring:
- `monitoring.serviceMonitor.enabled`, `monitoring.serviceMonitor.interval`, `monitoring.serviceMonitor.releaseLabel`
- `monitoring.prometheusRule.enabled`

## Install / upgrade
```bash
helm upgrade --install url-shortener charts/url-shortener \
  -n url-shortener --create-namespace \
  --set shortener.image.repository=ghcr.io/<user>/shortener \
  --set redirector.image.repository=ghcr.io/<user>/redirector
```

## External Redis
```bash
helm upgrade --install url-shortener charts/url-shortener \
  -n url-shortener --create-namespace \
  --set redis.enabled=false \
  --set redis.host=<redis-host> \
  --set redis.port=6379
```

## Monitoring integration
```bash
helm upgrade --install url-shortener charts/url-shortener \
  -n url-shortener --create-namespace \
  --set monitoring.serviceMonitor.enabled=true \
  --set monitoring.prometheusRule.enabled=true \
  --set monitoring.serviceMonitor.releaseLabel=monitoring
```

## Notes
- The chart expects Prometheus Operator CRDs if ServiceMonitors/PrometheusRules are enabled.
- Redis in the chart uses `emptyDir` for data; replace with PVC if persistence is required.
