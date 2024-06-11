export const redisConfig = {
  host: process.env.REDIS_HOST || "localhost", // Redis host
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379, // Redis port
  ...(process.env.REDIS_PASSWORD
    ? { password: process.env.REDIS_PASSWORD }
    : {}), // Redis password
  db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0, // Redis DB
  // tls: {},
};
