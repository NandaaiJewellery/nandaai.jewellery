import { imageCache } from "../config/lru";
import { ImageRepository } from "../repositories/image.repository";
import { dynamicCacheKeys } from "../types/ENUMS";
import { LRUCacheable } from "../utils/cache";

export class ImageService {
    private repo: ImageRepository;

    constructor() {
        this.repo = new ImageRepository();
    }

    @LRUCacheable({
        cache: imageCache,
        key: (imgKey: string) =>
            dynamicCacheKeys.imageKeyUrl(imgKey),
        ttl: 1000 * 60 * 10,
        log: true,
        label: "imageKeys",
    })
    async getImageUrl(key: string) {
        if (!key) throw new Error("Key is required");
        return await this.repo.getSignedUrl(key);
    }

    // async getImageStream(key: string) {
    //     if (!key) {
    //         throw new Error("Key is required");
    //     }

    //     const response = await this.repo.getObject(key);

    //     if (!response.Body) {
    //         throw new Error("NOT_FOUND");
    //     }

    //     return {
    //         stream: response.Body,
    //         contentType: response.ContentType || "image/jpeg",
    //         contentLength: response.ContentLength,
    //     };
    // }

}