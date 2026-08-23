"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter your username and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post("/auth/login", {
                username,
                password,
            });

            const token = response.data.token;

            if (!token) {
                throw new Error("Login successful but no token was returned.");
            }

            localStorage.setItem("token", token);

            router.push("/admin/dashboard");
            
        } catch (err: any) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Invalid username or password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#080a0f] text-white flex items-center justify-center p-6">

            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* LOGIN CARD */}
            <div className="relative w-full max-w-5xl grid md:grid-cols-2 bg-[#11141b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                {/* LEFT SIDE */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-[#111827] to-[#0c0f15]">

                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            Menu<span className="text-blue-500">M</span>
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Admin Panel
                        </p>
                    </div>

                    <div>
                        <div className="text-5xl mb-6">
                            🍔
                        </div>

                        <h2 className="text-3xl font-bold leading-tight">
                            Manage your menu.
                            <br />
                            <span className="text-blue-500">
                                Simply.
                            </span>
                        </h2>

                        <p className="text-gray-400 mt-5 max-w-sm leading-relaxed">
                            Manage your businesses, categories and products
                            from one powerful dashboard.
                        </p>
                    </div>

                    <p className="text-xs text-gray-600">
                        MenuM Admin Panel
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="p-8 sm:p-12">

                    {/* MOBILE LOGO */}
                    <div className="md:hidden mb-10">
                        <h1 className="text-3xl font-bold">
                            Menu<span className="text-blue-500">M</span>
                        </h1>

                        <p className="text-gray-500 text-sm mt-1">
                            Admin Panel
                        </p>
                    </div>

                    <div className="max-w-md mx-auto">

                        <div className="mb-8">
                            <p className="text-blue-500 text-sm font-medium mb-2">
                                WELCOME BACK
                            </p>

                            <h2 className="text-3xl font-bold">
                                Sign in to your account
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Enter your credentials to continue.
                            </p>
                        </div>

                        <form
                            onSubmit={handleLogin}
                            className="space-y-5"
                        >

                            {/* USERNAME */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* ERROR */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20"
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign In"}
                            </button>

                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-xs text-gray-600">
                                Secure MenuM Administration
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}