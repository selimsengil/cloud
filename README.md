# Polyglot URL Shortener (Kubernetes)

A small polyglot microservices system:
- Shortener service (Python/Flask) generates short codes.
- Redirector service (Node.js/Express) resolves codes and issues 302 redirects.
- Redis stores code -> long URL mappings.

## Architecture
- `shortener-service` exposes `POST /shorten`.
- `redirect-service` exposes `GET /:code`.
- Redis is used as a shared key/value store.
- Health checks: `GET /health`.
- Metrics: `GET /metrics` (Prometheus format).

## Local run (Docker Compose)
```bash
docker compose up --build
```

Shorten a URL (note: shortener is on port 5001 locally):
```bash
curl -s -X POST http://localhost:5001/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Redirect:
```bash
curl -I http://localhost:3000/<code>
```

Smoke test:
```bash
bash scripts/smoke_test.sh
```

## Kubernetes (kind) deployment
Prereqs:
- Docker Desktop running
- `kubectl` and `kind` installed

1) Create a local cluster:
```bash
kind create cluster --name url-shortener
```

2) Build images and load into kind:
```bash
docker build -t cloud-shortener:latest shortener-service
docker build -t cloud-redirector:latest redirect-service

kind load docker-image cloud-shortener:latest --name url-shortener
kind load docker-image cloud-redirector:latest --name url-shortener
```

3) Apply manifests:
```bash
kubectl apply -f k8s/
```

4) Port-forward services (keep these terminals open):
```bash
kubectl port-forward svc/shortener 5001:80
kubectl port-forward svc/redirector 3000:80
```

5) Test:
```bash
curl -s -X POST http://localhost:5001/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

curl -I http://localhost:3000/<code>
```

Notes:
- `k8s/shortener.yaml` and `k8s/redirector.yaml` use local images (`cloud-*`).
  Update to GHCR image names for remote clusters.
- `k8s/configmap.yaml` sets `REDIRECT_BASE_URL` for local port-forwarding.
  Update it if you use Ingress or a different host.

## OpenShift (optional)
If you prefer OpenShift, manifests are under `openshift/`:
```bash
oc apply -f openshift/
```
Update:
- `openshift/shortener.yaml` and `openshift/redirector.yaml` with your image registry.
- `openshift/configmap.yaml` to set `REDIRECT_BASE_URL` to the redirector Route host.

## CI/CD (GitHub Actions)
Workflow: `.github/workflows/ci-cd.yml`

What it does:
- Builds and runs the stack with Docker Compose
- Runs `scripts/smoke_test.sh`
- Builds and pushes images to GHCR on `main`
- Deploys to Kubernetes if secrets are set

Required GitHub secrets for Kubernetes deploy:
- `KUBECONFIG_B64` (base64-encoded kubeconfig)
- `K8S_NAMESPACE` (optional, default `default`)

To create `KUBECONFIG_B64`:
```bash
cat ~/.kube/config | base64 | tr -d '\n'
```

## Monitoring and logging
- Metrics endpoints: `GET /metrics` on both services.
- Kubernetes: install Prometheus/Grafana (example with Helm):
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack
```
- OpenShift: apply ServiceMonitors from `openshift/monitoring/` if user workload monitoring is enabled.

Logging:
- Application logs go to stdout/stderr.
- Kubernetes: `kubectl logs deployment/shortener` and `kubectl logs deployment/redirector`.
- OpenShift: `oc logs deployment/shortener` and `oc logs deployment/redirector`.

## Environment variables
- `REDIS_HOST` (default `localhost`)
- `REDIS_PORT` (default `6379`)
- `REDIRECT_BASE_URL` (optional, used by the shortener to return full short URLs)
