import { ImageRepository } from "../repositories/image.repository";

export class ImageService {
    private repo: ImageRepository;

    constructor() {
        this.repo = new ImageRepository();
    }

    async getImageStream(key: string) {
        if (!key) {
            throw new Error("Key is required");
        }

        const response = await this.repo.getObject(key);

        if (!response.Body) {
            throw new Error("NOT_FOUND");
        }

        return {
            stream: response.Body,
            contentType: response.ContentType || "image/jpeg",
            contentLength: response.ContentLength,
        };
    }
}