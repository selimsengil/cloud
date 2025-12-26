#!/usr/bin/env bash
set -euo pipefail

SHORTENER_URL=${SHORTENER_URL:-http://localhost:5001}
REDIRECTOR_URL=${REDIRECTOR_URL:-http://localhost:3000}
LONG_URL=${LONG_URL:-https://example.com}

curl -fsS "$SHORTENER_URL/health" >/dev/null
curl -fsS "$REDIRECTOR_URL/health" >/dev/null

response=$(curl -fsS -X POST "$SHORTENER_URL/shorten" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"$LONG_URL\"}")

code=$(printf '%s' "$response" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("code", ""))')

if [ -z "$code" ]; then
  echo "No code returned from shortener"
  exit 1
fi

status=$(curl -s -o /dev/null -w "%{http_code}" "$REDIRECTOR_URL/$code")
if [ "$status" != "302" ]; then
  echo "Expected 302, got $status"
  exit 1
fi

location=$(curl -s -D - -o /dev/null "$REDIRECTOR_URL/$code" \
  | awk -F': ' 'tolower($1) == "location" {print $2}' \
  | tr -d '\r')

if [ "$location" != "$LONG_URL" ]; then
  echo "Expected Location $LONG_URL, got $location"
  exit 1
fi

echo "Smoke test passed."
