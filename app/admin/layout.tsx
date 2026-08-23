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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                setLoading(true);

                const response = await api.get("/auth/me");

                const userRole: Role =
                    response.data.user?.role ||
                    response.data.role;

                setRole(userRole);

                // SUPER_ADMIN:
                // Categories ve Products erişemez
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
                console.error(
                    "Failed to load current user:",
                    error
                );

                localStorage.removeItem("token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [pathname, router]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

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
        <div className="min-h-screen bg-[#0b0d12] text-white">

            {/* ================================================= */}
            {/* DESKTOP SIDEBAR */}
            {/* ================================================= */}

            <aside className="hidden lg:flex fixed left-0 top-0 w-64 h-screen bg-[#17181c] border-r border-white/5 p-6 flex-col z-40">

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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            isActive("/admin/dashboard")
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            isActive("/admin/business")
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

                    {/* CATEGORIES */}

                    {role === "ADMIN" && (
                        <Link
                            href="/admin/categories"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                isActive("/admin/categories")
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <span>📂</span>
                            <span>Categories</span>
                        </Link>
                    )}

                    {/* PRODUCTS */}

                    {role === "ADMIN" && (
                        <Link
                            href="/admin/products"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                isActive("/admin/products")
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            isActive("/admin/settings")
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </Link>

                </nav>

                {/* ROLE */}

                <div className="mt-auto">

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

            {/* ================================================= */}
            {/* MOBILE OVERLAY */}
            {/* ================================================= */}

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* ================================================= */}
            {/* MOBILE SIDEBAR */}
            {/* ================================================= */}

            <aside
                className={`fixed left-0 top-0 h-screen w-72 bg-[#17181c] border-r border-white/5 p-6 z-50 lg:hidden transform transition-transform duration-300 ${
                    mobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >

                {/* HEADER */}

                <div className="flex items-start justify-between mb-10">

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Menu<span className="text-blue-500">M</span>
                        </h1>

                        <p className="text-xs text-gray-500 mt-1">
                            {role === "SUPER_ADMIN"
                                ? "Super Admin Panel"
                                : "Business Admin Panel"}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setMobileMenuOpen(false)
                        }
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>

                </div>

                {/* NAVIGATION */}

                <nav className="space-y-2">

                    <Link
                        href="/admin/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            isActive("/admin/dashboard")
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <span>📊</span>
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/admin/business"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            isActive("/admin/business")
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

                    {role === "ADMIN" && (
                        <Link
                            href="/admin/categories"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                isActive("/admin/categories")
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <span>📂</span>
                            <span>Categories</span>
                        </Link>
                    )}

                    {role === "ADMIN" && (
                        <Link
                            href="/admin/products"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                isActive("/admin/products")
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <span>🍔</span>
                            <span>Products</span>
                        </Link>
                    )}

                    <Link
                        href="/admin/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            isActive("/admin/settings")
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

            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}

            <main className="min-h-screen lg:ml-64">

                {/* ================================================= */}
                {/* NAVBAR */}
                {/* ================================================= */}

                <header className="sticky top-0 z-30 h-[74px] bg-[#111827] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* MOBILE MENU BUTTON */}

                    <button
                        onClick={() =>
                            setMobileMenuOpen(true)
                        }
                        className="lg:hidden mr-4 text-gray-300 hover:text-white text-2xl"
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                    {/* NAVBAR COMPONENT CONTENT */}

                    <div className="flex-1 min-w-0">

                        <h1 className="text-lg sm:text-xl font-bold text-white truncate">

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

                        <div className="flex items-center gap-2 mt-0.5">

                            <p className="text-xs sm:text-sm text-gray-400">
                                Welcome back 👋
                            </p>

                            {role && (
                                <span
                                    className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full border ${
                                        role === "SUPER_ADMIN"
                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                    }`}
                                >
                                    {role === "SUPER_ADMIN"
                                        ? "Super Admin"
                                        : "Admin"}
                                </span>
                            )}

                        </div>

                    </div>

                    {/* LOGOUT */}

                    <button
                        onClick={handleLogout}
                        className="border border-red-500/40 text-red-400 px-3 sm:px-5 py-2 rounded-lg hover:bg-red-500/10 transition text-sm sm:text-base"
                    >
                        Logout
                    </button>

                </header>

                {/* ================================================= */}
                {/* PAGE */}
                {/* ================================================= */}

                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

            </main>

        </div>
    );
}