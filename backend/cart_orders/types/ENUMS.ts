export enum staticCacheKeys {
    userOrdersCacheKey = "orders",
    userCartItemsCacheKey = "cart",
}

export const dynamicCacheKeys = {
    userIdOrders: (userId: string | number) => `user:${userId}`,
    userIdCartItems: (userId: string | number) => `user:${userId}`,
}