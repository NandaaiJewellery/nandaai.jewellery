import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

export async function GET() {
    try {
        await requireAuth();

        const res = await pool.query('SELECT * FROM product_category_master');
        return NextResponse.json(res.rows);

    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await requireAuth();

        const body = await req.json();
        const { name } = body;

        const slug = name.toLowerCase().replace(/\s+/g, "-");

        const createRes = await pool.query(
            `
            INSERT INTO product_category_master
            (name, slug, created_at)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [name, slug, new Date()]
        );

        return NextResponse.json(
            {
                data: createRes.rows[0],
                message: "New catalogue category created successfully.",
            },
            { status: 201 }
        );

    } catch (err: any) {
        if (err.code === "23505") {
            return NextResponse.json(
                { error: "Category already exists" },
                { status: 409 }
            );
        }

        console.error(err);

        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}