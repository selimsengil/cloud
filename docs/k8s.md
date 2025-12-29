# Kubernetes Manifests (k8s/)

## Purpose
Raw Kubernetes YAML manifests for running the stack without Helm. Intended for local testing (kind) or as a reference for production manifests.

## Components
### `k8s/configmap.yaml`
ConfigMap `app-config` provides shared environment variables:
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIRECT_BASE_URL` (defaults to `http://localhost:3000` for port-forward tests)

### `k8s/redis.yaml`
Deployment + Service for Redis:
- Single replica
- TCP readiness/liveness probes
- `emptyDir` volume (ephemeral storage)
- Resource requests/limits configured

### `k8s/shortener.yaml`
Deployment + Service for shortener-service:
- Image: `cloud-shortener:latest` (local image expected)
- `envFrom` uses `app-config`
- HTTP readiness/liveness on `/health`
- Service exposes port 80 -> container 5000

### `k8s/redirector.yaml`
Deployment + Service for redirect-service:
- Image: `cloud-redirector:latest` (local image expected)
- `envFrom` uses `app-config`
- HTTP readiness/liveness on `/health`
- Service exposes port 80 -> container 3000

### Monitoring assets
See `docs/monitoring.md` for:
- `k8s/servicemonitor-*.yaml`
- `k8s/alerts-url-shortener.yaml`
- `k8s/grafana-dashboard-url-shortener.yaml`
- `k8s/monitoring-values.yaml`
- `k8s/loki-stack-values.yaml`

## Typical flow (kind)
```bash
kind create cluster --name url-shortener

docker build -t cloud-shortener:latest shortener-service
docker build -t cloud-redirector:latest redirect-service
kind load docker-image cloud-shortener:latest --name url-shortener
kind load docker-image cloud-redirector:latest --name url-shortener

kubectl apply -f k8s/configmap.yaml \
  -f k8s/redis.yaml \
  -f k8s/shortener.yaml \
  -f k8s/redirector.yaml

kubectl port-forward svc/shortener 5001:80
kubectl port-forward svc/redirector 3000:80
```

## Notes
- Manifests use local image names (`cloud-*`). Update to registry images for remote clusters.
- Redis uses `emptyDir`; data is not persisted across pod restarts.
