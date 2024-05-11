import { redis } from "@/infrastructure/adapters/redisAdapter";

const script = async () => {
  try {
    await redis.flushdb();
    console.log("cleaned redis db");
    console.log("done");
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

script();
