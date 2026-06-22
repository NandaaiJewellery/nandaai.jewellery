import { NextRequest } from "next/server";
import { pool } from "@/config/db";

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": process.env.MAIN_APP_ORIGIN!,
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

export function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: corsHeaders(),
    });
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);
        const category = searchParams.get("category");

        const offset = (page - 1) * limit;

        let query = `SELECT * FROM product_images`;
        let countQuery = `SELECT COUNT(*) FROM product_images`;
        const values: any[] = [];

        if (category) {
            query += ` WHERE product_category_id = $1`;
            countQuery += ` WHERE product_category_id = $1`;
            values.push(category);
        }

        query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);

        const [dataRes, countRes] = await Promise.all([
            pool.query(query, values),
            pool.query(countQuery, category ? [category] : []),
        ]);

        return new Response(
            JSON.stringify({
                data: dataRes.rows,
                meta: {
                    total: Number(countRes.rows[0].count),
                    page,
                    limit,
                },
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders(),
                },
            }
        );

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Fetch failed" }), {
            status: 500,
            headers: corsHeaders(),
        });
    }
}