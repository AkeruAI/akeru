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

type MinerServiceApiOnly = {
  uid: string;
  type: string;
  models: string[];
  address: string;
};

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const expectedAuthHeader = `Bearer ${process.env.SECRET_KEY}`;

  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  if (!authHeader || authHeader !== expectedAuthHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiOnly = params.has("api-only")
    ? Boolean(params.get("api-only"))
    : false;

  if (apiOnly) {
    const miner = (await request.json()) as MinerServiceApiOnly;
    const pipe = redis.pipeline().hset(`apionly:miner:${miner.uid}`, miner);

    pipe.sadd(`apionly:miners:type:${miner.type}`, miner.uid);

    miner.models.forEach((modelName) => {
      pipe.sadd(`apionly:miners:model:${modelName}`, miner.uid);
    });

    await pipe.exec();

    return new Response(`ok`);
  }

  const miner = (await request.json()) as MinerService;

  const pipe = redis.pipeline().hset(`miner:${miner.netuid}`, miner);

  pipe.sadd(`miners:type:${miner.type}`, miner.netuid);

  miner.models.forEach((modelName) => {
    pipe.sadd(`miners:model:${modelName}`, miner.netuid);
  });

  await pipe.exec();

  return new Response(`ok`);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  const authHeader = request.headers.get("Authorization");
  const expectedAuthHeader = `Bearer ${process.env.SECRET_KEY}`;

  if (!authHeader || authHeader !== expectedAuthHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiOnly = params.has("api-only")
    ? JSON.parse(params.get("api-only")!)
    : false;

  const model = params.get("model");

  let minersUidForModel: string[] = [];

  if (model) {
    minersUidForModel = apiOnly
      ? await redis.smembers(`apionly:miners:model:${model}`)
      : await redis.smembers(`miners:model:${model}`);

    if (minersUidForModel.length === 0) {
      return new Response(`Error: no miners found for model ${model}`, {
        status: 404,
      });
    }
  } else {
    const minerKeys = apiOnly
      ? await redis.keys("apionly:miner:*")
      : await redis.keys("miner:*");

    console.log(minerKeys);

    minersUidForModel = minerKeys.map((key) => key.split(":")[apiOnly ? 2 : 1]);

    console.log(minerKeys.map((key) => key.split(":")[apiOnly ? 2 : 1]));
  }

  const pipe = redis.pipeline();

  minersUidForModel.forEach((uid) => {
    pipe.hgetall(apiOnly ? `apionly:miner:${uid}` : `miner:${uid}`);
  });

  const miners = await pipe.exec();

  return new Response(JSON.stringify(miners.filter(Boolean)), {
    headers: { "Content-Type": "application/json" },
  });
}
