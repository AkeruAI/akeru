import Redis from "ioredis";

async function healthCheck() {
  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
  });

  try {
    // Run a simple command to check the connection
    await redis.ping();
    console.log("Redis health check passed");
  } catch (error) {
    console.error("Redis health check failed", error);
  } finally {
    await redis.quit();
  }
}

healthCheck();
