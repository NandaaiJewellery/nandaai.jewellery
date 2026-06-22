"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import  API from "@/app/api";

export async function getCategories() {
    const resolvedCookies = await cookies();

    const res = await fetch(API.catalogue(), {
        cache: "no-store",
        headers: {
            cookie: resolvedCookies.toString(),
        },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to fetch categories");

    return data;
}

export async function addCategory(name: string) {
    const resolvedCookies = await cookies();

    try {
        const res = await fetch(API.catalogue(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: resolvedCookies.toString(),
            },
            body: JSON.stringify({
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to create category");
        }

        revalidatePath("/admin");

        return data;

    } catch (err: any) {
        console.error(err);
        throw new Error(err.message || "Failed to create category");
    }
}

// UPDATE
export async function updateCategory(id: string, name: string) {
    const resolvedCookies = await cookies();

    try {
        const res = await fetch(API.catalogue(id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                cookie: resolvedCookies.toString(),
            },
            body: JSON.stringify({ name }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to update category");
        }

        revalidatePath("/admin");

        return data;

    } catch (err: any) {
        console.error(err);
        throw new Error(err.message || "Failed to update category");
    }
}

// DELETE
export async function deleteCategory(id: string) {
    const resolvedCookies = await cookies();

    try {
        const res = await fetch(API.catalogue(id), {
            method: "DELETE",
            headers: {
                cookie: resolvedCookies.toString(),
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to delete category");
        }

        revalidatePath("/admin");

        return data;

    } catch (err: any) {
        console.error(err);
        throw new Error(err.message || "Failed to delete category");
    }
}