"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
} from "@/app/services/category";

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    action: string;
};

export default function CategoryModal({ open, setOpen, action }: Props) {
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState("");
    const [selected, setSelected] = useState<any>(null);

    // fetch categories when modal opens
    useEffect(() => {
        if (open && action !== "add") {
            console.log("not add");
            fetchCatalogue();
        }
    }, [open, action]);

    const fetchCatalogue =
        async () => await getCategories()
            .then(setCategories);

    // ADD
    const handleAdd = async () => {
        if (!categoryName.trim()) return;

        const tempId = Date.now();

        const tempCategory = { id: tempId, name: categoryName };
        setCategories((prev) => [...prev, tempCategory]);

        try {
            const data = await addCategory(categoryName);

            // replace temp item with actual DB item
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === tempId ? data.data : cat
                )
            );

            toast.success(data.message || "Category created");

            setCategoryName("");

        } catch (err: any) {
            console.error(err);

            // rollback
            setCategories((prev) =>
                prev.filter((cat) => cat.id !== tempId)
            );

            toast.error(err.message || "Failed to create category");
        }
    };

    const handleUpdate = async () => {
        if (!selected) return;

        const prev = [...categories];

        // optimistic update
        setCategories((list) =>
            list.map((c) =>
                c.id === selected.id ? { ...c, name: categoryName } : c
            )
        );

        const toastId = toast.loading("Updating...");

        try {
            const data = await updateCategory(selected.id, categoryName);

            // sync with DB response
            setCategories((list) =>
                list.map((c) =>
                    c.id === selected.id ? data : c
                )
            );

            toast.success("Updated", { id: toastId });
            setSelected(null);

        } catch (err: any) {
            console.error(err);

            // rollback
            setCategories(prev);

            toast.error(err.message || "Failed to update", { id: toastId });
        }
    };

    // DELETE
    const handleDelete = async (id: string) => {
        const prev = [...categories];

        // optimistic update
        setCategories((list) => list.filter((c) => c.id !== id));

        const toastId = toast.loading("Deleting...");

        try {
            const data = await deleteCategory(id);

            toast.success(data.message || "Deleted", { id: toastId });

        } catch (err: any) {
            console.error(err);

            // rollback
            setCategories(prev);

            toast.error(err.message || "Failed to delete", { id: toastId });
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40" />

                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-100 space-y-4 shadow-xl">

                    <Dialog.Title className="font-semibold capitalize">
                        {action} Category
                    </Dialog.Title>

                    {/* ADD */}
                    {action === "add" && (
                        <>
                            <input
                                className="border p-2 w-full rounded"
                                placeholder="Category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />

                            <button
                                onClick={handleAdd}
                                className="bg-green-600 text-white w-full py-2 rounded"
                            >
                                Add
                            </button>
                        </>
                    )}

                    {/* LIST */}
                    {(action === "update" || action === "delete") && (
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex justify-between border p-2 rounded"
                                >
                                    <span>{cat.name}</span>

                                    {action === "update" ? (
                                        <button
                                            onClick={() => {
                                                setSelected(cat);
                                                setCategoryName(cat.name);
                                            }}
                                        >
                                            ✏️
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* UPDATE FORM */}
                    {selected && action === "update" && (
                        <>
                            <input
                                className="border p-2 w-full rounded"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />

                            <button
                                onClick={handleUpdate}
                                className="bg-blue-600 text-white w-full py-2 rounded"
                            >
                                Update
                            </button>
                        </>
                    )}

                    <Dialog.Close className="text-sm text-gray-500">
                        Close
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}