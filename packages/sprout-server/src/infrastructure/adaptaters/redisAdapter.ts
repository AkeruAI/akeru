import Redis from "ioredis";
import { redisConfig } from "../config/redisConfig";

export const redis = new Redis(redisConfig);
