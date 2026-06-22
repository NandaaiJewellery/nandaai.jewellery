import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_SECRET!,
});

redis.on('error', err => console.error('Redis Client Error', err));
