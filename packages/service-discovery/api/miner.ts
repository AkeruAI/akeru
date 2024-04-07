import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const config = {
  runtime: "edge",
};

type MinerService = {
  netuid: number;
  hotkey: string;
  type: string;
  models: string[];
  address: string;
};

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const expectedAuthHeader = `Bearer ${process.env.SECRET_KEY}`;

  if (!authHeader || authHeader !== expectedAuthHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const miner = (await request.json()) as MinerService;

  const pipe = redis
    .pipeline()
    .hset(`miner:${String(miner.netuid)}`, miner)
    .sadd(`miners:${miner.type}`, miner.netuid)
    .set(`address:${miner.netuid}`, miner.address)
    .set(`miner:nuid:${miner.netuid}:address`, miner.address);

  miner.models.forEach((modelName) => {
    pipe.sadd(modelName, miner.netuid);
  });

  await pipe.exec();

  return new Response(`ok`);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  const model = params.get("model");

  if (!model) {
    return new Response("Error: model is missing in search params", {
      status: 400,
    });
  }

  const minersUidForModel = await redis.smembers(model);

  // If the model set does not exist, return an error response
  if (minersUidForModel.length === 0) {
    return new Response(`Error: no miners found for model ${model}`, {
      status: 404,
    });
  }

  const pipe = redis.pipeline();

  minersUidForModel.forEach((uid) => {
    pipe.hgetall(`miner:${uid}`);
  });

  const miners = await pipe.exec();

  return new Response(JSON.stringify(miners), {
    headers: { "Content-Type": "application/json" },
  });
}
