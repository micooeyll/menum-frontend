"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Role = "ADMIN" | "SUPER_ADMIN";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await api.get("/dashboard/stats");

                const userRole = response.data.role as Role;

                setRole(userRole);

                // SUPER_ADMIN Categories ve Products'a giremez
                if (
                    userRole === "SUPER_ADMIN" &&
                    (
                        pathname.startsWith("/admin/categories") ||
                        pathname.startsWith("/admin/products")
                    )
                ) {
                    router.replace("/admin/dashboard");
                    return;
                }

            } catch (error) {
                console.error("Failed to load user role:", error);

                localStorage.removeItem("token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [pathname, router]);

    function isActive(path: string) {
        return pathname === path;
    }

    async function handleLogout() {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            router.replace("/login");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0d12] text-white flex items-center justify-center">
                <div className="text-gray-400">
                    Loading panel...
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0b0d12] text-white">

            {/* SIDEBAR */}

            <aside className="fixed left-0 top-0 w-64 h-screen bg-[#17181c] border-r border-white/5 p-6">

                {/* LOGO */}

                <div className="mb-10">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Menu<span className="text-blue-500">M</span>
                    </h1>

                    <p className="text-xs text-gray-500 mt-1">
                        {role === "SUPER_ADMIN"
                            ? "Super Admin Panel"
                            : "Business Admin Panel"}
                    </p>
                </div>

                {/* NAVIGATION */}

                <nav className="space-y-2">

                    {/* DASHBOARD */}

                    <Link
                        href="/admin/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin/dashboard")
                            ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <span>📊</span>
                        <span>Dashboard</span>
                    </Link>

                    {/* BUSINESS */}

                    <Link
                        href="/admin/business"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin/business")
                            ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <span>🏢</span>

                        <span>
                            {role === "SUPER_ADMIN"
                                ? "Businesses"
                                : "My Business"}
                        </span>
                    </Link>

                    {/* CATEGORIES
                        SADECE BUSINESS ADMIN
                    */}

                    {role === "ADMIN" && (
                        <Link
                            href="/admin/categories"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin/categories")
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span>📂</span>
                            <span>Categories</span>
                        </Link>
                    )}

                    {/* PRODUCTS
                        SADECE BUSINESS ADMIN
                    */}

                    {role === "ADMIN" && (
                        <Link
                            href="/admin/products"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin/products")
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span>🍔</span>
                            <span>Products</span>
                        </Link>
                    )}

                    {/* SETTINGS */}

                    <Link
                        href="/admin/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive("/admin/settings")
                            ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </Link>

                </nav>

                {/* ROLE */}

                <div className="absolute bottom-6 left-6 right-6">

                    <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                            Signed in as
                        </p>

                        <p className="text-sm font-semibold mt-1">
                            {role === "SUPER_ADMIN"
                                ? "Super Admin"
                                : "Business Admin"}
                        </p>

                    </div>

                </div>

            </aside>

            {/* MAIN */}

            <main className="flex-1 ml-64 min-h-screen">

                {/* NAVBAR */}

                <header className="h-[74px] bg-[#111827] border-b border-white/10 flex items-center justify-between px-8">

                    <div>

                        <h1 className="text-xl font-bold text-white">

                            {pathname.includes("/dashboard")
                                ? "Dashboard"

                                : pathname.includes("/business")
                                    ? role === "SUPER_ADMIN"
                                        ? "Businesses"
                                        : "My Business"

                                    : pathname.includes("/categories")
                                        ? "Categories"

                                        : pathname.includes("/products")
                                            ? "Products"

                                            : pathname.includes("/settings")
                                                ? "Settings"

                                                : "MenuM"}

                        </h1>

                        <p className="text-sm text-gray-400">
                            Welcome back 👋
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="border border-red-500/40 text-red-400 px-5 py-2 rounded-lg hover:bg-red-500/10 transition"
                    >
                        Logout
                    </button>

                </header>

                {/* PAGE */}

                <div className="p-8">
                    {children}
                </div>

            </main>

        </div>
    );
}