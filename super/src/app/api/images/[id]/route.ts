import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { pool } from "@/config/db";
import { b2Client } from "@/config/b2";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAuth();

        const { id } = params;

        // Get image first
        const result = await pool.query(
            `SELECT * FROM product_images WHERE id = $1`,
            [id]
        );

        if (!result.rows.length) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const image = result.rows[0];

        // Extract key from URL
        const key = image.image_url.split("/file/")[1].split("/").slice(1).join("/");

        // Delete from B2
        await b2Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.B2_BUCKET_NAME!,
                Key: key,
            })
        );

        // Delete from DB
        await pool.query(`DELETE FROM product_images WHERE id = $1`, [id]);

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error(err);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}