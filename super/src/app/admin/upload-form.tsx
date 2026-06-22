"use client";

import { useRef, useState } from "react";
import { signOut } from "next-auth/react";
import CategoryModal from "./CategoryModal";

export default function UploadForm({ categories }: any) {
    const [name, setName] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [action, setAction] = useState("");
    const [showModal, setShowModal] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (f: File) => {
        if (!f.type.startsWith("image/")) {
            setMessage("Only images allowed");
            return;
        }

        setFile(f);
        setPreview(URL.createObjectURL(f));
        setMessage("");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    const upload = async () => {
        setMessage("");
        if (!file || !categoryId || !name || !originalPrice) {
            setMessage("Fill all required fields");
            return;
        }

        if (priceError) {
            setMessage(priceError);
            return;
        }

        setLoading(true);
        setProgress(0);

        try {
            const form = new FormData();
            form.append("name", name);
            form.append("original_price", originalPrice);
            form.append("discount_price", discountPrice);
            form.append("image", file);
            form.append("product_category_id", categoryId);

            const xhr = new XMLHttpRequest();

            xhr.open("POST", `/api/images/upload`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round(
                        (event.loaded / event.total) * 100
                    );
                    setProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setMessage("✅ Upload successful");
                    setFile(null);
                    setPreview(null);
                    setCategoryId("");
                    setName("");
                    setOriginalPrice("");
                    setDiscountPrice("");
                    setProgress(0);
                } else {
                    setMessage("❌ Upload failed");
                }
                setLoading(false);
            };

            xhr.onerror = () => {
                setMessage("❌ Network error");
                setLoading(false);
            };

            xhr.send(form);
        } catch {
            setMessage("❌ Something went wrong");
            setLoading(false);
        }
    };

    const priceError =
        discountPrice &&
            originalPrice &&
            Number(discountPrice) > Number(originalPrice)
            ? "Discount price cannot be greater than original price"
            : "";

    return (
        <div className="space-y-4">
            {/* Drag & Drop */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer hover:bg-gray-50"
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="preview"
                        className="mx-auto max-h-40 rounded-lg"
                    />
                ) : (
                    <p className="text-gray-500">
                        Drag & drop image or click to upload
                    </p>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFile(e.target.files[0])
                    }
                />
            </div>

            {/* Ornament Name */}
            <input
                type="text"
                placeholder="Ornament Name"
                className="border p-3 rounded-lg w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
            />

            {/* Prices row */}
            <div className="flex gap-3">
                <input
                    type="number"
                    placeholder="Original Price"
                    className="border p-3 rounded-lg w-1/2"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    disabled={loading}
                    min="0"
                />

                {/* Discount field with error */}
                <div className="flex flex-col w-1/2">
                    <input
                        type="number"
                        placeholder="Discount Price"
                        className={`border p-3 rounded-lg w-full ${priceError ? "border-red-500" : ""
                            }`}
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        disabled={loading}
                        min="0"
                    />

                    {priceError && (
                        <p className="text-red-500 text-sm mt-1">
                            {priceError}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex gap-3">
                <select
                    className="border p-3 rounded-lg w-1/2"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Select Category</option>
                    {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-3 rounded-lg w-1/2"
                    value={action}
                    onChange={(e) => {
                        const val = e.target.value;
                        setAction(val);
                        if (val) setShowModal(true);
                    }}
                >
                    <option value="">Manage</option>
                    <option value="add">Add</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                </select>
            </div>

            {/* Progress bar */}
            {loading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Upload */}
            <button
                onClick={upload}
                disabled={loading || !!priceError}
                className="bg-green-600 text-white px-6 py-3 rounded-xl w-full disabled:opacity-60"
            >
                {loading ? `Uploading... ${progress}%` : "Upload Product"}
            </button>

            {message && (
                <p className="text-sm text-center">{message}</p>
            )}

            <button
                onClick={() => signOut()}
                className="text-sm text-red-600"
            >
                Logout
            </button>

            <CategoryModal
                open={showModal}
                setOpen={(v) => {
                    setShowModal(v);
                    if (!v) setAction("");
                }}
                action={action}
            />
        </div>
    );
}