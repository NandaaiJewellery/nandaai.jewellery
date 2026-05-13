export enum staticCacheKeys {
    catalogueCacheKey = "catalogue",
    productsCacheKey = "products",
    wishlistCacheKey = "wishlist",
    userOrdersCacheKey = "orders",
    userCartItemsCacheKey = "cart",
}

export const dynamicCacheKeys = {
    userIdWishlist: (userId: string | number) => `wishlist:user:${userId}`,
    imageKeyUrl: (imageKey: string) => `imageUrl:${imageKey}`,
    productsCache: (category?: string, sort?: string) =>
        `${category || "all"}:${sort || "popularity"}`,
    userIdOrders: (userId: string | number) => `user:${userId}`,
    userIdCartItems: (userId: string | number) => `user:${userId}`,
}