export const qK = {
    // User-scoped
    cart: (userId?: number) => ['cart', userId] as const,
    wishlist: (userId?: number) => ['wishlist', userId] as const,
    orders: (userId?: number) => ['orders', userId] as const,

    // Public
    allProducts: (params?: { category?: string; sort?: string; search?: string }) =>
        ['products', params] as const,
    product: (id: string) => ["product", id] as const,
    productCatalogue: () => ['productCatalogue'] as const,
};