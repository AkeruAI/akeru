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

// this is the data format when we are not running the edge network alongside the subnet.
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

  // if we run with API only mode, we will not register bittensor specific properties in the data model
  if (apiOnly) {
    const miner = (await request.json()) as MinerServiceApiOnly;
    const pipe = redis
      .pipeline()
      .hset(`apionly:miner:${String(miner.uid)}`, miner)
      .sadd(`apionly:miners:${miner.type}`, miner.uid)
      .set(`apionly:address:${miner.uid}`, miner.address)
      .set(`apionly:miner:uid:${miner.uid}:address`, miner.address);

    miner.models.forEach((modelName) => {
      pipe.sadd(`apionly:${modelName}`, miner.uid);
    });

    await pipe.exec();

    return new Response(`ok`);
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

  const authHeader = request.headers.get("Authorization");
  const expectedAuthHeader = `Bearer ${process.env.SECRET_KEY}`;

  if (!authHeader || authHeader !== expectedAuthHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiOnly = params.has("api-only")
    ? JSON.parse(params.get("api-only")!)
    : false;

  const model = params.get("model");

  if (!model) {
    return new Response("Error: model is missing in search params", {
      status: 400,
    });
  }

  const minersUidForModel = apiOnly
    ? await redis.smembers(`apionly:${model}`)
    : await redis.smembers(model);

  // If the model set does not exist, return an error response
  if (minersUidForModel.length === 0) {
    return new Response(`Error: no miners found for model ${model}`, {
      status: 404,
    });
  }

  const pipe = redis.pipeline();

  minersUidForModel.forEach((uid) => {
    pipe.hgetall(apiOnly ? `apionly:miner:${uid}` : `miner:${uid}`);
  });

  const miners = await pipe.exec();

  return new Response(JSON.stringify(miners), {
    headers: { "Content-Type": "application/json" },
  });
}
