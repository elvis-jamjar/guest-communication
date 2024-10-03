import { Redis } from "ioredis";
export const redis = new Redis(process.env.NEXT_REDIS_URL as string);
