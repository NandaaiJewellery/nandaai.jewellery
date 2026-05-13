import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { b2Client } from "../config/b2";

export class ImageRepository {
    // async getObject(key: string) {
    //     const command = new GetObjectCommand({
    //         Bucket: process.env.B2_BUCKET_NAME!,
    //         Key: key,
    //     });

    //     return b2Client.send(command);
    // }

    async getSignedUrl(key: string, expiresIn = 3600) {
        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME!,
            Key: key,
        });

        const url = await getSignedUrl(b2Client, command, {
            expiresIn, // seconds
        })
            .catch((e) => console.log("signed err", e));

        return url;
    }
}