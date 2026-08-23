"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/dist/client/link";

type Product = {
    id: number;
    name: string;
    description?: string | null;
    price: number | string;
    imageUrl?: string | null;
    isVisible: boolean;
};

type Category = {
    id: number;
    name: string;
    products: Product[];
};

type Menu = {
    id: number;
    name: string;
    logoUrl?: string | null;
    themeColor: string;
    categories: Category[];
};

export default function PublicMenuPage() {
    const params = useParams();

    const slug = params.slug as string;

    const [menu, setMenu] = useState<Menu | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadMenu() {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/menu/${slug}`
                );

                setMenu(response.data);
            } catch (error: any) {
                console.error("Menu error:", error);

                setError(
                    error.response?.data?.message ||
                    "Menu could not be loaded."
                );
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            loadMenu();
        }
    }, [slug]);

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-500">
                    Loading menu...
                </div>
            </main>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error || !menu) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="text-5xl mb-4">
                        🍽️
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Menu not found
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {error || "This menu does not exist."}
                    </p>
                </div>
            </main>
        );
    }

    // =========================
    // MENU
    // =========================

    return (
        <main
            className="min-h-screen bg-gray-50"
            style={{
                "--theme-color": menu.themeColor,
            } as React.CSSProperties}
        >
            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <header
                className="text-white px-6 py-10 text-center"
                style={{
                    backgroundColor: menu.themeColor,
                }}
            >
                {menu.logoUrl && (
                    <img
                        src={menu.logoUrl}
                        alt={menu.name}
                        className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-white/30"
                    />
                )}

                <h1 className="text-3xl font-bold">
                    {menu.name}
                </h1>

                <p className="text-white/80 mt-2">
                    Our Menu
                </p>
            </header>

            {/* ========================= */}
            {/* CATEGORIES */}
            {/* ========================= */}

            <div className="max-w-3xl mx-auto px-5 py-8">

                {menu.categories.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500">
                            No menu items available.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-10">

                        {menu.categories.map(
                            (category) => (
                                <section
                                    key={category.id}
                                >
                                    {/* CATEGORY TITLE */}

                                    <div className="mb-5">
                                        <h2
                                            className="text-2xl font-bold"
                                            style={{
                                                color: menu.themeColor,
                                            }}
                                        >
                                            {category.name}
                                        </h2>

                                        <div
                                            className="h-1 w-12 rounded-full mt-2"
                                            style={{
                                                backgroundColor:
                                                    menu.themeColor,
                                            }}
                                        />
                                    </div>

                                    {/* PRODUCTS */}

                                    {category.products.length === 0 ? (
                                        <p className="text-gray-400 text-sm">
                                            No products available.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">

                                            {category.products.map(
                                                (product) => (
                                                    <article
                                                        key={
                                                            product.id
                                                        }
                                                        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                                                    >
                                                        <div className="flex gap-4">

                                                            {/* IMAGE */}

                                                            {product.imageUrl && (
                                                                <img
                                                                    src={
                                                                        product.imageUrl
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                                                                />
                                                            )}

                                                            {/* INFO */}

                                                            <div className="flex-1 min-w-0">

                                                                <div className="flex items-start justify-between gap-4">

                                                                    <h3 className="font-semibold text-gray-900 text-lg">
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </h3>

                                                                    <span
                                                                        className="font-bold whitespace-nowrap"
                                                                        style={{
                                                                            color:
                                                                                menu.themeColor,
                                                                        }}
                                                                    >
                                                                        ₺
                                                                        {
                                                                            product.price
                                                                        }
                                                                    </span>

                                                                </div>

                                                                {product.description && (
                                                                    <p className="text-gray-500 text-sm mt-2">
                                                                        {
                                                                            product.description
                                                                        }
                                                                    </p>
                                                                )}

                                                            </div>

                                                        </div>
                                                    </article>
                                                )
                                            )}

                                        </div>
                                    )}

                                </section>
                            )
                        )}

                    </div>
                )}

            </div>

            {/* ========================= */}
            {/* FOOTER */}
            {/* ========================= */}

            <footer className="text-center py-8 text-sm text-gray-400">
                Powered by{" "}
                <Link
                    href="/login"
                    className="font-semibold hover:opacity-80 transition"
                    style={{
                        color: menu.themeColor,
                    }}
                >
                    MenuM
                </Link>
            </footer>
        </main>
    );
}