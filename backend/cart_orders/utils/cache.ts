import { redis } from "../config/redis";
import { LRUCache } from "lru-cache";
import dev from ".";

export function serialize(data: any): string {
    return JSON.stringify(data);
}

export function deserialize<T>(data: string | null): T | null {
    if (!data) return null;
    return JSON.parse(data) as T;
}

type RedCacheOptions<T extends {}> = {
    prefix: string;
    key?: (...args: any[]) => string;
    ttl?: number; // seconds
    log?: boolean;
    label?: string;
};

export function RedCacheable<T extends {} = any>(
    options: RedCacheOptions<T>
) {
    return function (
        _target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const {
                prefix,
                key = (...args: any[]) =>
                    `${propertyKey}:${JSON.stringify(args)}`,
                ttl = 300,
                log = dev,
                label = propertyKey,
            } = options;

            const cacheKey = `${prefix}:${key(...args)}`;

            // 1. Try cache
            const cached = await redis.get(cacheKey);
            if (cached) {
                if (log)
                    console.log(
                        `🟢 REDCACHE HIT : ${label.toUpperCase()} :`,
                        cacheKey
                    );
                return deserialize<T>(cached);
            }

            if (log)
                console.log(
                    `🔴 REDCACHE MISS : ${label.toUpperCase()} :`,
                    cacheKey
                );

            // 2. Execute original
            const result = await original.apply(this, args);

            // 3. Store in Redis
            await redis.set(cacheKey, serialize(result), "EX", ttl);

            return result;
        };

        return descriptor;
    };
}

type InvalidateRedOptions = {
    prefix?: string | ((...args: any[]) => string);
    keys?: string[] | ((...args: any[]) => string[]);
    log?: boolean;
    label?: string;
};

export function InvalidateRedCache(options: InvalidateRedOptions) {
    return function (
        _target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const {
                prefix,
                keys,
                log = dev,
                label = propertyKey,
            } = options;

            const result = await original.apply(this, args);

            let keysToDelete: string[] = [];

            if (typeof keys === "function") {
                keysToDelete.push(...keys(...args));
            } else if (Array.isArray(keys)) {
                keysToDelete.push(...keys);
            }

            if (prefix) {
                const resolvedPrefix =
                    typeof prefix === "function"
                        ? prefix(...args)
                        : prefix;

                const stream = redis.scanStream({
                    match: `${resolvedPrefix}:*`,
                    count: 100,
                });

                for await (const keys of stream) {
                    if (keys.length) {
                        keysToDelete.push(...keys);
                    }
                }
            }

            // Deduplicate
            const uniqueKeys = [...new Set(keysToDelete)];

            if (uniqueKeys.length) {
                await redis.del(...uniqueKeys);

                if (log) {
                    for (const key of uniqueKeys) {
                        console.log(
                            `🧹 REDCACHE INVALIDATED : ${label.toUpperCase()} :`,
                            key
                        );
                    }
                }
            }

            return result;
        };

        return descriptor;
    };
}

type CacheOptions<T extends {}> = {
    cache: LRUCache<string, T>;
    key?: (...args: any[]) => string;
    ttl?: number;
    log?: boolean;
    label?: string;
};

export function LRUCacheable<T extends {} = any>(options: CacheOptions<T>) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const {
                cache,
                key = (...args: any[]) =>
                    `${propertyKey}:${JSON.stringify(args)}`,
                ttl,
                log = dev,
                label = propertyKey,
            } = options;

            const cacheKey = key(...args);

            const cached = cache.get(cacheKey);
            if (cached) {
                if (log) console.log(`🟢 LRUCACHE HIT : ${label.toUpperCase()} :`, cacheKey);
                return cached;
            }

            if (log)
                console.log(`🔴 LRUCACHE MISS : ${label.toUpperCase()} :`, cacheKey);

            const result = await originalMethod.apply(this, args);

            cache.set(cacheKey, result, { ttl });

            return result;
        };

        return descriptor;
    };
}

type InvalidateOptions = {
    cache: any; // LRUCache<string, any>
    keys?: string[];
    prefix?: string;
    log?: boolean;
    label?: string;
};

export function InvalidateLRUCache(options: InvalidateOptions) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const {
                cache,
                keys,
                prefix,
                log = dev,
                label = propertyKey,
            } = options;

            const result = await originalMethod.apply(this, args);

            let keysToDelete: string[] = [];

            // Explicit keys
            if (Array.isArray(keys))
                keysToDelete.push(...keys);

            // Prefix-based invalidation
            if (prefix) {
                for (const key of Array.from(cache.keys() as Iterable<string>)) {
                    if (key.startsWith(prefix))
                        keysToDelete.push(key);
                }
            }

            // Deduplicate (important if overlap)
            const uniqueKeys = [...new Set(keysToDelete)];

            for (const key of uniqueKeys) {
                cache.delete(key);
                if (log)
                    console.log(`🧹 LRUCACHE INVALIDATED : ${label.toUpperCase()}: ${key}`);
            }

            return result;
        };

        return descriptor;
    };
}