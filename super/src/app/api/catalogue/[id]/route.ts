import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

type Params = Promise<{ id: string }>;

export async function PUT(
    req: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    try {
        await requireAuth();

        const body = await req.json();
        const { name } = body;
        const { id } = await params;

        verifyIntegerId(id);

        const existingRes = await pool.query(
            "SELECT * FROM product_category_master WHERE id = $1",
            [id]
        );

        if (existingRes.rowCount === 0) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        const existing = existingRes.rows[0];

        const updatedName = name ?? existing.name;
        const updatedSlug = updatedName
            .toLowerCase()
            .replace(/\s+/g, "-");

        const updateRes = await pool.query(
            `
            UPDATE product_category_master
            SET name = $1, slug = $2
            WHERE id = $3
            RETURNING *
            `,
            [updatedName, updatedSlug, id]
        );

        return NextResponse.json(updateRes.rows[0]);

    } catch (err: any) {
        if (err.code === "23505") {
            return NextResponse.json(
                { error: "Category already exists" },
                { status: 409 }
            );
        }

        console.error(err);

        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    try {
        await requireAuth();
        const { id } = await params;

        verifyIntegerId(id);

        const deleteRes = await pool.query(
            `
            DELETE FROM product_category_master
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (deleteRes.rowCount === 0) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Category deleted successfully",
            data: deleteRes.rows[0],
        });

    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}

const verifyIntegerId = (id: string) => {
    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
        return NextResponse.json(
            { error: "Invalid ID" },
            { status: 400 }
        );
    }
}