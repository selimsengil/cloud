# CI/CD Pipeline

## Workflow
File: `.github/workflows/ci-cd.yml`

## Triggers
- Pushes to `main`
- All pull requests

## Jobs
### 1) test
Purpose: local stack validation with Docker Compose.
Steps:
- Checkout
- `docker compose up -d --build`
- `bash scripts/smoke_test.sh`
- Cleanup with `docker compose down -v`

### 2) k8s-smoke
Purpose: Kubernetes manifest validation using kind.
Steps:
- Checkout
- Install `kubectl`
- Create kind cluster
- Build shortener/redirector images
- Load images into kind
- Apply `k8s/` manifests
- Wait for rollouts
- Port-forward services and run smoke test

### 3) build-and-push
Purpose: Build and push container images to GHCR.
Notes:
- Runs only after k8s-smoke
- Push only on `main`
- Tags: `${{ github.sha }}` and `latest`

### 4) deploy (optional)
Purpose: Deploy to external cluster if secrets are set.
Required secrets:
- `KUBECONFIG_B64` (base64-encoded kubeconfig)
- `K8S_NAMESPACE` (optional; defaults to `default`)
Steps:
- Decode kubeconfig
- Apply manifests
- Update images to the commit SHA
- Wait for rollout

## Notes
- GHCR login uses GitHub-provided `GITHUB_TOKEN`.
- The pipeline deploys the raw `k8s/` manifests, not the Helm chart.
