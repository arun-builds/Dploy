import { createClient } from "redis";

export const redis = createClient({ url: "redis://localhost:6379" });

export const initRedis = async () => {
    if (!redis.isOpen) await redis.connect();
}

