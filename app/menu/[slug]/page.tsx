"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

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
currency: string;

// WIFI
wifiName?: string | null;
wifiPassword?: string | null;

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

            const response = await api.get(`/menu/${slug}`);

            console.log("🍽️ PUBLIC MENU RESPONSE:", response.data);

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

if (loading) {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />

                <p className="text-gray-500 text-sm">
                    Loading menu...
                </p>
            </div>
        </main>
    );
}

if (error || !menu) {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
                <div className="text-6xl mb-5">
                    🍽️
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                    Menu not found
                </h1>

                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    {error || "This menu does not exist."}
                </p>
            </div>
        </main>
    );
}

const hasWifi =
    Boolean(menu.wifiName?.trim()) ||
    Boolean(menu.wifiPassword?.trim());

return (
    <main
        className="
            min-h-screen
            relative
            overflow-hidden
            bg-[#f8fafc]
        "
        style={
            {
                "--theme-color": menu.themeColor,
            } as React.CSSProperties
        }
    >
        {/* BACKGROUND DECORATION */}

        <div
            className="
                pointer-events-none
                absolute
                -top-32
                -right-32
                w-72
                h-72
                rounded-full
                blur-3xl
                opacity-10
            "
            style={{
                backgroundColor: menu.themeColor,
            }}
        />

        <div
            className="
                pointer-events-none
                absolute
                top-[420px]
                -left-40
                w-80
                h-80
                rounded-full
                blur-3xl
                opacity-[0.06]
            "
            style={{
                backgroundColor: menu.themeColor,
            }}
        />

        <div
            className="
                pointer-events-none
                absolute
                bottom-0
                right-0
                w-64
                h-64
                rounded-full
                blur-3xl
                opacity-[0.05]
            "
            style={{
                backgroundColor: menu.themeColor,
            }}
        />

        <div className="relative z-10">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header
                className="
                    text-white
                    px-5
                    sm:px-6
                    py-9
                    sm:py-12
                    text-center
                "
                style={{
                    backgroundColor: menu.themeColor,
                }}
            >

                {/* ================================================= */}
                {/* LOGO */}
                {/* ================================================= */}

                {menu.logoUrl ? (
                    <div
                        className="
                            w-24
                            h-24
                            sm:w-28
                            sm:h-28
                            mx-auto
                            mb-5
                            rounded-full
                            overflow-hidden
                            bg-white
                            border-4
                            border-white/30
                            shadow-xl
                        "
                    >
                        <img
                            src={menu.logoUrl}
                            alt={`${menu.name} logo`}
                            className="
                                w-full
                                h-full
                                object-cover
                            "
                        />
                    </div>
                ) : (
                    <div
                        className="
                            w-24
                            h-24
                            sm:w-28
                            sm:h-28
                            mx-auto
                            mb-5
                            rounded-full
                            overflow-hidden
                            bg-white
                            border-4
                            border-white/30
                            shadow-xl
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <img
                            src="/favicon.ico"
                            alt="meno"
                            className="
                                w-14
                                h-14
                                sm:w-16
                                sm:h-16
                                object-contain
                            "
                        />
                    </div>
                )}

                {/* BUSINESS NAME */}

                <h1
                    className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        tracking-tight
                    "
                >
                    {menu.name}
                </h1>

                <p className="text-white/80 mt-2 text-sm sm:text-base">
                    Our Menu
                </p>

                {/* ================================================= */}
                {/* WIFI */}
                {/* ================================================= */}

                {hasWifi && (
                    <div className="mt-6 max-w-sm mx-auto">
                        <div
                            className="
                                bg-white/10
                                backdrop-blur-md
                                border
                                border-white/20
                                rounded-2xl
                                p-4
                                text-left
                                shadow-lg
                            "
                        >
                            <div className="flex items-center gap-3">

                                {/* WIFI ICON */}

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-xl
                                        bg-white
                                        flex
                                        items-center
                                        justify-center
                                        flex-shrink-0
                                        text-xl
                                    "
                                >
                                    📶
                                </div>

                                {/* WIFI NAME */}

                                <div className="min-w-0">
                                    <p className="text-xs text-white/60 uppercase tracking-wider">
                                        Free Wi-Fi
                                    </p>

                                    {menu.wifiName && (
                                        <p className="text-sm sm:text-base font-semibold mt-1 break-all">
                                            {menu.wifiName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* PASSWORD */}

                            {menu.wifiPassword && (
                                <div className="mt-4 pt-3 border-t border-white/10">

                                    <p className="text-xs text-white/60">
                                        Password
                                    </p>

                                    <p className="text-sm font-medium mt-1 break-all">
                                        {menu.wifiPassword}
                                    </p>

                                </div>
                            )}

                        </div>
                    </div>
                )}

            </header>

            {/* ================================================= */}
            {/* MENU CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    w-full
                    max-w-3xl
                    mx-auto
                    px-4
                    sm:px-5
                    py-7
                    sm:py-10
                "
            >

                {menu.categories.length === 0 ? (

                    <div className="text-center py-16">

                        <div className="text-5xl mb-4">
                            🍽️
                        </div>

                        <p className="text-gray-500">
                            No menu items available.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-9 sm:space-y-10">

                        {menu.categories.map((category) => (

                            <section
                                key={category.id}
                            >

                                {/* CATEGORY HEADER */}

                                <div className="mb-4 sm:mb-5">

                                    <h2
                                        className="
                                            text-xl
                                            sm:text-2xl
                                            font-bold
                                            tracking-tight
                                        "
                                        style={{
                                            color: menu.themeColor,
                                        }}
                                    >
                                        {category.name}
                                    </h2>

                                    <div
                                        className="
                                            h-1
                                            w-12
                                            rounded-full
                                            mt-2
                                        "
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

                                    <div className="space-y-3 sm:space-y-4">

                                        {category.products.map(
                                            (product) => (

                                                <article
                                                    key={product.id}
                                                    className="
                                                        bg-white
                                                        rounded-2xl
                                                        border
                                                        border-gray-200
                                                        p-3.5
                                                        sm:p-4
                                                        shadow-sm
                                                        hover:shadow-md
                                                        transition-shadow
                                                    "
                                                >

                                                    <div className="flex gap-3 sm:gap-4">

                                                        {/* PRODUCT IMAGE */}

                                                        {product.imageUrl ? (

                                                            <img
                                                                src={
                                                                    product.imageUrl
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="
                                                                    w-24
                                                                    h-24
                                                                    sm:w-28
                                                                    sm:h-28
                                                                    rounded-xl
                                                                    object-cover
                                                                    flex-shrink-0
                                                                "
                                                            />

                                                        ) : (

                                                            <div
                                                                className="
                                                                    w-24
                                                                    h-24
                                                                    sm:w-28
                                                                    sm:h-28
                                                                    rounded-xl
                                                                    flex-shrink-0
                                                                    bg-gray-100
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-3xl
                                                                    sm:text-4xl
                                                                "
                                                            >
                                                                🍽️
                                                            </div>

                                                        )}

                                                        {/* PRODUCT INFO */}

                                                        <div
                                                            className="
                                                                flex-1
                                                                min-w-0
                                                                flex
                                                                flex-col
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-start
                                                                    justify-between
                                                                    gap-3
                                                                "
                                                            >

                                                                <h3
                                                                    className="
                                                                        font-semibold
                                                                        text-gray-900
                                                                        text-base
                                                                        sm:text-lg
                                                                        leading-snug
                                                                    "
                                                                >
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h3>

                                                                <span
                                                                    className="
                                                                        font-bold
                                                                        text-sm
                                                                        sm:text-base
                                                                        whitespace-nowrap
                                                                    "
                                                                    style={{
                                                                        color:
                                                                            menu.themeColor,
                                                                    }}
                                                                >
                                                                    {new Intl.NumberFormat(
                                                                        "en-US",
                                                                        {
                                                                            style:
                                                                                "currency",
                                                                            currency:
                                                                                menu.currency,
                                                                        }
                                                                    ).format(
                                                                        Number(
                                                                            product.price
                                                                        )
                                                                    )}
                                                                </span>

                                                            </div>

                                                            {product.description && (

                                                                <p
                                                                    className="
                                                                        text-gray-500
                                                                        text-xs
                                                                        sm:text-sm
                                                                        mt-2
                                                                        leading-relaxed
                                                                    "
                                                                >
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

                        ))}

                    </div>

                )}

            </div>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <footer
                className="
                    text-center
                    px-5
                    py-8
                    sm:py-10
                    text-xs
                    sm:text-sm
                    text-gray-400
                "
            >

                Powered by{" "}

                <Link
                    href="/login"
                    className="
                        font-semibold
                        hover:opacity-80
                        transition
                    "
                    style={{
                        color: menu.themeColor,
                    }}
                >
                    meno
                </Link>

            </footer>

        </div>
    </main>
);

}
