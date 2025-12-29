# Monitoring and Logging

## Purpose
Provide metrics, dashboards, alerts, and log aggregation for the shortener stack.

## Metrics endpoints
Both services expose Prometheus metrics:
- shortener: `GET /metrics`
- redirector: `GET /metrics`

## ServiceMonitor (Prometheus Operator)
Files:
- `k8s/servicemonitor-shortener.yaml`
- `k8s/servicemonitor-redirector.yaml`

Notes:
- Targets services labeled with `app: shortener` and `app: redirector`.
- Assumes Prometheus Operator is installed.
- `release: monitoring` label ties into `k8s/monitoring-values.yaml`.

## Alerting rules
File: `k8s/alerts-url-shortener.yaml`
Alerts:
- Shortener error rate > 5% over 5m
- Shortener p95 latency > 0.5s over 5m
- Redirector error rate > 2% over 5m
- Redirector p95 latency > 0.3s over 5m

## Grafana dashboard
File: `k8s/grafana-dashboard-url-shortener.yaml`
Dashboard: "URL Shortener Overview"
Panels include:
- Shortener requests/sec and errors
- Shortener p95 latency
- Redirector requests/sec and hit/miss
- Redirector p95 latency
- Loki log panels for both services

## Prometheus + Grafana values
File: `k8s/monitoring-values.yaml`
Highlights:
- Prometheus configured to pick ServiceMonitors with label `release: monitoring`
- Grafana enabled with default dashboards and Loki datasource

## Loki stack values
File: `k8s/loki-stack-values.yaml`
Highlights:
- Loki enabled without persistence
- Promtail enabled
- Grafana/Prometheus disabled (assumed provided by kube-prometheus-stack)

## Logging
Application logs are sent to stdout/stderr.
Kubernetes:
```bash
kubectl logs deployment/shortener
kubectl logs deployment/redirector
```
