# Kubernetes (anlatim)

## Nedir?
Helm kullanmadan, ham YAML dosyalariyla sistemi Kubernetes'e kurmak icin.

## Parcalar
- `k8s/configmap.yaml`: ortak env degerleri
- `k8s/redis.yaml`: Redis deployment + service
- `k8s/shortener.yaml`: shortener deployment + service
- `k8s/redirector.yaml`: redirector deployment + service

## Tipik akıs (kind)
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
```

## Erisim (port-forward)
```bash
kubectl port-forward svc/shortener 5001:80
kubectl port-forward svc/redirector 3000:80
```

## Notlar
- Manifestler lokal imaj isimlerini kullanir (`cloud-*`).
- Redis `emptyDir` kullandigi icin veri kalici degildir.
