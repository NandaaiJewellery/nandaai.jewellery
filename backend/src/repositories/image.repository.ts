import { GetObjectCommand } from "@aws-sdk/client-s3";
import { b2Client } from "../config/b2";

export class ImageRepository {
    async getObject(key: string) {
        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME!,
            Key: key,
        });

        return b2Client.send(command);
    }
}