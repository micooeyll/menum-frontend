"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type DashboardData = {
    business?: {
        id: number;
        name: string;
        slug: string;
        themeColor: string;
        subscriptionStatus: "TRIAL" | "ACTIVE" | "EXPIRED";
        trialEndsAt: string;
        isActive: boolean;
    };

    stats?: {
        categories: number;
        products: number;
        visibleProducts: number;
    };
};

type Category = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    isVisible: boolean;
    imageUrl?: string;
    category?: {
        id: number;
        name: string;
    };
};

type Role = "ADMIN" | "SUPER_ADMIN";

export default function DashboardPage() {
    const [role, setRole] = useState<Role | null>(null);

    const [data, setData] =
        useState<DashboardData | null>(null);

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setLoading(true);

            /*
             * Önce kullanıcı rolünü öğreniyoruz.
             */
            const meResponse =
                await api.get("/auth/me");

            const user =
                meResponse.data.user;

            const userRole: Role =
                user?.role ??
                meResponse.data.role;

            setRole(userRole);

            /*
             * Dashboard endpointi
             */
            try {
                const dashboardResponse =
                    await api.get("/dashboard");

                setData(
                    dashboardResponse.data.dashboard ??
                    dashboardResponse.data
                );
            } catch (error) {
                console.error(
                    "Dashboard endpoint error:",
                    error
                );
            }

            /*
             * Dashboard endpointinden stats gelmese bile
             * sayfayı doldurabilmek için categories/products
             * verilerini çekiyoruz.
             */
            try {
                const categoriesResponse =
                    await api.get("/categories");

                setCategories(
                    categoriesResponse.data.categories ??
                    []
                );
            } catch (error) {
                console.error(
                    "Categories dashboard error:",
                    error
                );
            }

            try {
                const productsResponse =
                    await api.get("/products");

                setProducts(
                    productsResponse.data.products ??
                    []
                );
            } catch (error) {
                console.error(
                    "Products dashboard error:",
                    error
                );
            }

        } catch (error: any) {
            console.error(
                "Dashboard loading error:",
                error
            );

            alert(
                error.response?.data?.message ??
                "Failed to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    }

    const totalProducts =
        data?.stats?.products ??
        products.length;

    const totalCategories =
        data?.stats?.categories ??
        categories.length;

    const visibleProducts =
        data?.stats?.visibleProducts ??
        products.filter(
            (product) => product.isVisible
        ).length;

    const hiddenProducts =
        totalProducts - visibleProducts;

    const business =
        data?.business;

    function formatDate(
        date?: string | null
    ) {
        if (!date) return "-";

        return new Date(date)
            .toLocaleDateString("en-GB");
    }

    function subscriptionClass(
        status?: string
    ) {
        if (status === "ACTIVE") {
            return "bg-green-500/10 text-green-400";
        }

        if (status === "TRIAL") {
            return "bg-blue-500/10 text-blue-400";
        }

        return "bg-red-500/10 text-red-400";
    }

    /*
     * Son eklenen ürünleri göster
     */
    const recentProducts =
        [...products]
            .reverse()
            .slice(0, 5);

    if (loading) {
        return (
            <div className="min-h-full text-white">

                <div className="flex items-center justify-center min-h-[60vh]">

                    <div className="text-center">

                        <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto" />

                        <p className="text-gray-400 mt-4">
                            Loading dashboard...
                        </p>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="text-white">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                <div>

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="text-gray-400 mt-1 text-sm sm:text-base">
                        {role === "SUPER_ADMIN"
                            ? "Overview of your MenuM platform."
                            : "Overview of your business and menu."}
                    </p>

                </div>

                <button
                    onClick={loadDashboard}
                    className="self-start sm:self-auto bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium transition"
                >
                    ↻ Refresh
                </button>

            </div>

            {/* ================================================= */}
            {/* BUSINESS OVERVIEW */}
            {/* ================================================= */}

            {business && (
                <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden mb-6">

                    <div
                        className="h-2"
                        style={{
                            backgroundColor:
                                business.themeColor ||
                                "#8dbbf7",
                        }}
                    />

                    <div className="p-5 sm:p-6">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                            <div className="flex items-center gap-4 min-w-0">

                                <div
                                    className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl flex items-center justify-center text-2xl"
                                    style={{
                                        backgroundColor:
                                            `${business.themeColor || "#8dbbf7"}20`,
                                    }}
                                >
                                    🏢
                                </div>

                                <div className="min-w-0">

                                    <h2 className="text-lg sm:text-xl font-bold truncate">
                                        {business.name}
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1 truncate">
                                        @{business.slug}
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-2">

                                <span
                                    className={`text-xs px-3 py-1.5 rounded-full ${subscriptionClass(
                                        business.subscriptionStatus
                                    )}`}
                                >
                                    {business.subscriptionStatus}
                                </span>

                                <span
                                    className={`text-xs px-3 py-1.5 rounded-full ${
                                        business.isActive
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-red-500/10 text-red-400"
                                    }`}
                                >
                                    {business.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                            </div>

                        </div>

                        {business.subscriptionStatus ===
                            "TRIAL" && (
                            <div className="mt-5 pt-5 border-t border-white/5">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                    <p className="text-sm text-gray-400">
                                        Trial ends
                                    </p>

                                    <p className="text-sm font-medium text-white">
                                        {formatDate(
                                            business.trialEndsAt
                                        )}
                                    </p>

                                </div>

                            </div>
                        )}

                    </div>

                </div>
            )}

            {/* ================================================= */}
            {/* STATS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

                {/* PRODUCTS */}

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-400 text-sm">
                                Total Products
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {totalProducts}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl">
                            🍽️
                        </div>

                    </div>

                </div>

                {/* CATEGORIES */}

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-400 text-sm">
                                Categories
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {totalCategories}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl">
                            📂
                        </div>

                    </div>

                </div>

                {/* VISIBLE */}

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-400 text-sm">
                                Visible Products
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {visibleProducts}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-2xl">
                            👁️
                        </div>

                    </div>

                </div>

                {/* HIDDEN */}

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-400 text-sm">
                                Hidden Products
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {hiddenProducts}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-2xl">
                            🙈
                        </div>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* CONTENT GRID */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* ================================================= */}
                {/* RECENT PRODUCTS */}
                {/* ================================================= */}

                <div className="xl:col-span-2 bg-[#111827] border border-white/10 rounded-2xl overflow-hidden">

                    <div className="p-5 sm:p-6 border-b border-white/10">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="font-bold text-lg">
                                    Recent Products
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Latest items in your menu
                                </p>

                            </div>

                            <a
                                href="/dashboard/products"
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                                View all
                            </a>

                        </div>

                    </div>

                    {recentProducts.length === 0 ? (

                        <div className="p-10 sm:p-14 text-center">

                            <div className="text-4xl mb-3">
                                🍽️
                            </div>

                            <p className="text-gray-300 font-medium">
                                No products yet
                            </p>

                            <p className="text-gray-500 text-sm mt-1">
                                Add your first product to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-white/5">

                            {recentProducts.map(
                                (product) => (

                                    <div
                                        key={
                                            product.id
                                        }
                                        className="p-4 sm:p-5 flex items-center gap-4"
                                    >

                                        {/* IMAGE */}

                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-[#0b1120] shrink-0">

                                            {product.imageUrl ? (

                                                <img
                                                    src={
                                                        product.imageUrl
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    className="w-full h-full object-cover"
                                                />

                                            ) : (

                                                <div className="w-full h-full flex items-center justify-center text-xl">
                                                    🍽️
                                                </div>

                                            )}

                                        </div>

                                        {/* INFO */}

                                        <div className="flex-1 min-w-0">

                                            <p className="font-semibold truncate">
                                                {
                                                    product.name
                                                }
                                            </p>

                                            <p className="text-gray-500 text-sm mt-1 truncate">
                                                {
                                                    product.category
                                                        ?.name ??
                                                    "No category"
                                                }
                                            </p>

                                        </div>

                                        {/* PRICE */}

                                        <div className="text-right shrink-0">

                                            <p className="font-bold text-blue-400">
                                                ₺
                                                {Number(
                                                    product.price
                                                ).toFixed(2)}
                                            </p>

                                            <p
                                                className={`text-xs mt-1 ${
                                                    product.isVisible
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                }`}
                                            >
                                                {product.isVisible
                                                    ? "Visible"
                                                    : "Hidden"}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

                {/* ================================================= */}
                {/* QUICK OVERVIEW */}
                {/* ================================================= */}

                <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden">

                    <div className="p-5 sm:p-6 border-b border-white/10">

                        <h2 className="font-bold text-lg">
                            Menu Overview
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Quick information
                        </p>

                    </div>

                    <div className="p-5 sm:p-6 space-y-5">

                        {/* VISIBILITY */}

                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <span className="text-sm text-gray-400">
                                    Product visibility
                                </span>

                                <span className="text-sm font-medium">
                                    {totalProducts > 0
                                        ? Math.round(
                                              (visibleProducts /
                                                  totalProducts) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </span>

                            </div>

                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">

                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{
                                        width: `${
                                            totalProducts >
                                            0
                                                ? Math.min(
                                                      100,
                                                      (visibleProducts /
                                                          totalProducts) *
                                                          100
                                                  )
                                                : 0
                                        }%`,
                                    }}
                                />

                            </div>

                        </div>

                        {/* CATEGORIES */}

                        <div className="flex items-center justify-between py-3 border-b border-white/5">

                            <span className="text-gray-400 text-sm">
                                Categories
                            </span>

                            <span className="font-semibold">
                                {totalCategories}
                            </span>

                        </div>

                        {/* PRODUCTS */}

                        <div className="flex items-center justify-between py-3 border-b border-white/5">

                            <span className="text-gray-400 text-sm">
                                Products
                            </span>

                            <span className="font-semibold">
                                {totalProducts}
                            </span>

                        </div>

                        {/* VISIBLE */}

                        <div className="flex items-center justify-between py-3 border-b border-white/5">

                            <span className="text-gray-400 text-sm">
                                Visible
                            </span>

                            <span className="text-green-400 font-semibold">
                                {visibleProducts}
                            </span>

                        </div>

                        {/* HIDDEN */}

                        <div className="flex items-center justify-between py-3">

                            <span className="text-gray-400 text-sm">
                                Hidden
                            </span>

                            <span className="text-red-400 font-semibold">
                                {hiddenProducts}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* QUICK ACTIONS */}
            {/* ================================================= */}

            <div className="mt-5 bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6">

                <h2 className="font-bold text-lg">
                    Quick Actions
                </h2>

                <p className="text-gray-500 text-sm mt-1 mb-5">
                    Manage your menu quickly
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                    <a
                        href="/dashboard/products"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition"
                    >

                        <div className="text-2xl mb-3">
                            🍽️
                        </div>

                        <p className="font-semibold">
                            Products
                        </p>

                        <p className="text-gray-500 text-xs mt-1">
                            Manage menu items
                        </p>

                    </a>

                    <a
                        href="/dashboard/categories"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition"
                    >

                        <div className="text-2xl mb-3">
                            📂
                        </div>

                        <p className="font-semibold">
                            Categories
                        </p>

                        <p className="text-gray-500 text-xs mt-1">
                            Organize your menu
                        </p>

                    </a>

                    <a
                        href="/dashboard/business"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition"
                    >

                        <div className="text-2xl mb-3">
                            🏢
                        </div>

                        <p className="font-semibold">
                            Business
                        </p>

                        <p className="text-gray-500 text-xs mt-1">
                            Business information
                        </p>

                    </a>

                    <a
                        href="/dashboard/menu"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition"
                    >

                        <div className="text-2xl mb-3">
                            📱
                        </div>

                        <p className="font-semibold">
                            Menu
                        </p>

                        <p className="text-gray-500 text-xs mt-1">
                            View your digital menu
                        </p>

                    </a>

                </div>

            </div>

        </div>
    );
}