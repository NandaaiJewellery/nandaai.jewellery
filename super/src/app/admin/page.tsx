import UploadForm from "./upload-form";
import { requireAuth } from "@/lib/auth";
import { getCategories } from "../services/category";

export default async function AdminPage() {
    await requireAuth();

    const catalogue = await getCategories();

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl">
            <h1 className="text-2xl font-bold mb-6">
                Admin Dashboard
            </h1>

            <UploadForm categories={catalogue} />
        </div>
    );
}