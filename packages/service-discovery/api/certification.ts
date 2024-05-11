import { redis } from "../utils/redis";

export const config = {
  runtime: "edge",
};

interface RequestBody {
  hash: string;
  imageSignature: string;
}

function generateUUID(): string {
  let uuid = '';
  const randomValues = new Uint8Array(16);

  // Generate random values
  crypto.getRandomValues(randomValues);

  // Set version and variant bits
  randomValues[6] = (randomValues[6] & 0x0f) | 0x40;
  randomValues[8] = (randomValues[8] & 0x3f) | 0x80;

  // Convert to hexadecimal string
  for (let i = 0; i < 16; i++) {
    const value = randomValues[i];
    uuid += value.toString(16).padStart(2, '0');
  }

  // Format the UUID string
  uuid = uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20);

  return uuid;
}

export const GET = async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    const hash = searchParams.get('hash');
    const imageSignature = searchParams.get('imageSignature');

    if (!hash || !imageSignature || typeof hash !== 'string' || typeof imageSignature !== 'string') {
      return new Response("missing hash or image signature", { status: 400 });
    }

    const certificate = await redis.get<string>(`${imageSignature}:${hash}`);
    if (certificate) {
      return new Response(certificate, { status: 200 });
    }

    // a random UUID will be sent to cheating miners
    return new Response(generateUUID());
  } catch {
    return new Response("Failure", { status: 400 });
  }
};

export const PUT = async (request: Request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const expectedAuthHeader = `Bearer ${process.env.SECRET_KEY}`;

    if (!authHeader || authHeader !== expectedAuthHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { hash, imageSignature } = body as RequestBody;

    if (!hash || !imageSignature || typeof hash !== 'string' || typeof imageSignature !== 'string') {
      return new Response("missing hash or image signature", { status: 400 });
    }

    const uuid = generateUUID();
    const res = await redis.set(`${imageSignature}:${hash}`, uuid);

    if (res === 'OK') {
      return new Response('ok', { status: 200 });
    }
  } catch {
    return new Response("Failure", { status: 400 });
  } 
  
};