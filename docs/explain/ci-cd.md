# CI/CD (anlatim)

## Nerede?
Workflow dosyasi: `.github/workflows/ci-cd.yml`

## Ne yapar?
1) Docker Compose ile test eder.
2) kind cluster kurup `k8s/` manifestlerini dener.
3) GHCR'a image build + push yapar (main icin).
4) (Opsiyonel) Harici cluster'a deploy eder.

## Gerekli secret'lar
- `KUBECONFIG_B64`: base64 kubeconfig
- `K8S_NAMESPACE`: opsiyonel namespace

## Not
Deploy adimi secret yoksa otomatik olarak atlanir.
