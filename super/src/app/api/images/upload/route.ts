import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { pool } from "@/config/db";
import { b2Client } from "@/config/b2";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        await requireAuth();

        const formData = await req.formData();

        const file = formData.get("image") as File | null;
        const productCategoryId = formData.get("product_category_id") as string;
        const name = formData.get("name");
        const originalPrice = formData.get("original_price");
        const discountPrice = formData.get("discount_price");

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        if (!productCategoryId) {
            return NextResponse.json(
                { error: "Category is required" },
                { status: 400 }
            );
        }

        if (!originalPrice || !discountPrice) {
            return NextResponse.json(
                { error: "Prices is required" },
                { status: 400 }
            );
        }

        // Convert File → Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = file.name.split(".").pop();
        const fileName = `products/${crypto.randomUUID()}.${fileExtension}`;

        // Upload to B2
        const command = new PutObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME!,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        });

        await b2Client.send(command);

        const imageUrl = `${process.env.B2_PUBLIC_URL}/file/${process.env.B2_BUCKET_NAME}/${fileName}`;

        // Insert into Database
        const result = await pool.query(
            `
                INSERT INTO products
                (image_url, product_category_id, name, original_price, discounted_price, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, image_url, product_category_id, created_at
            `,
            [fileName, productCategoryId, name, originalPrice, discountPrice, new Date()]
        );

        return NextResponse.json(
            {
                message: "Uploaded successfully",
                data: result.rows[0],
            },
            { status: 201 }
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}