import os
import random
import string
import time

from flask import Flask, jsonify, request, Response
import redis
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest

app = Flask(__name__)

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = int(os.environ.get("REDIS_PORT", "6379"))
REDIRECT_BASE_URL = os.environ.get("REDIRECT_BASE_URL")

ALPHABET = string.ascii_lowercase + string.digits
CODE_LENGTH = 5

SHORTEN_REQUESTS = Counter(
    "shortener_requests_total", "Total shorten requests", ["result"]
)
SHORTEN_LATENCY = Histogram(
    "shortener_request_duration_seconds", "Shorten request duration", ["result"]
)


# Single Redis client for the service.
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)


def generate_code(length=CODE_LENGTH):
    return "".join(random.choice(ALPHABET) for _ in range(length))


@app.route("/shorten", methods=["POST"])
def shorten_url():
    start_time = time.time()
    data = request.get_json(silent=True) or {}
    long_url = data.get("url")

    if not long_url:
        SHORTEN_REQUESTS.labels(result="bad_request").inc()
        SHORTEN_LATENCY.labels(result="bad_request").observe(time.time() - start_time)
        return jsonify({"error": "url is required"}), 400

    # Try a few times to avoid rare collisions.
    code = None
    for _ in range(10):
        candidate = generate_code()
        if redis_client.setnx(candidate, long_url):
            code = candidate
            break

    if not code:
        SHORTEN_REQUESTS.labels(result="error").inc()
        SHORTEN_LATENCY.labels(result="error").observe(time.time() - start_time)
        return jsonify({"error": "could not allocate code"}), 500

    response = {"code": code}
    if REDIRECT_BASE_URL:
        response["short_url"] = REDIRECT_BASE_URL.rstrip("/") + "/" + code

    SHORTEN_REQUESTS.labels(result="ok").inc()
    SHORTEN_LATENCY.labels(result="ok").observe(time.time() - start_time)
    return jsonify(response), 201


@app.route("/health", methods=["GET"])
def health():
    try:
        redis_client.ping()
    except redis.exceptions.RedisError:
        return jsonify({"status": "redis_unavailable"}), 503

    return jsonify({"status": "ok"}), 200


@app.route("/metrics", methods=["GET"])
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
