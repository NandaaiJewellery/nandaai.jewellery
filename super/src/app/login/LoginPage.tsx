"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials");
            setLoading(false);
            return;
        }

        router.push("/admin");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-2xl shadow-xl w-96"
            >
                <h2 className="text-xl font-bold mb-4 text-center">
                    Admin Login
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 rounded-lg w-full mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />

                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="border p-3 rounded-lg w-full pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 cursor-pointer"
                        tabIndex={-1}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-black text-white px-6 py-3 rounded-xl w-full disabled:opacity-60 disabled:cursor-not-allowed ${!loading ? "cursor-pointer" : ""}`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Signing in...
                        </span>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>
        </div>
    );
}