import { LRUCache } from "lru-cache";

const imageCache = new LRUCache<string, string>({
    max: 5000,              // number of images
    ttl: 1000 * 60 * 55,    // 55 minutes
});

const wishlistCache = new LRUCache<string, any[]>({
    max: 50,                // number of wishlist items
    ttl: 1000 * 60 * 28,    // 28 minutes
});

export {
    imageCache,
    wishlistCache
}
