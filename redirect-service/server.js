const express = require("express");
const promClient = require("prom-client");
const redis = require("redis");

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
const PORT = parseInt(process.env.PORT || "3000", 10);

const app = express();

promClient.collectDefaultMetrics({ register: promClient.register });

const redirectRequests = new promClient.Counter({
  name: "redirector_requests_total",
  help: "Total redirect requests",
  labelNames: ["result"],
});

const redirectLatency = new promClient.Histogram({
  name: "redirector_request_duration_seconds",
  help: "Redirect request duration in seconds",
  labelNames: ["result"],
});

// Create a single Redis connection for the service.
const client = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
  process.exit(1);
});

app.get("/", (_req, res) => {
  res.status(200).send("redirector up");
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.get("/health", async (_req, res) => {
  if (!client.isOpen) {
    return res.status(503).send("redis disconnected");
  }

  try {
    await client.ping();
    return res.status(200).send("ok");
  } catch (err) {
    console.error("Health check failed:", err);
    return res.status(503).send("redis unavailable");
  }
});

app.get("/:code", async (req, res) => {
  const { code } = req.params;
  const endTimer = redirectLatency.startTimer();

  try {
    const longUrl = await client.get(code);
    if (!longUrl) {
      redirectRequests.labels("miss").inc();
      endTimer({ result: "miss" });
      return res.status(404).send("not found");
    }

    redirectRequests.labels("hit").inc();
    endTimer({ result: "hit" });
    return res.redirect(302, longUrl);
  } catch (err) {
    console.error("Lookup failed:", err);
    redirectRequests.labels("error").inc();
    endTimer({ result: "error" });
    return res.status(500).send("internal error");
  }
});

app.listen(PORT, () => {
  console.log(`Redirector listening on port ${PORT}`);
});
