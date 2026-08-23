"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Role = "ADMIN" | "SUPER_ADMIN";

type SuperAdminStats = {
    businesses: number;
    activeBusinesses: number;
    trialBusinesses: number;
    expiredBusinesses: number;
};

type AdminStats = {
    categories: number;
    products: number;
    productsPerCategory: number;
    totalMenuItems: number;
};

type DashboardResponse = {
    success: boolean;
    role: Role;
    stats: SuperAdminStats | AdminStats;
};

export default function DashboardPage() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                setLoading(true);
                setError(false);

                const response =
                    await api.get<DashboardResponse>(
                        "/dashboard/stats"
                    );

                setData(response.data);
            } catch (error) {
                console.error("Dashboard error:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen text-white">
                <div className="animate-pulse">

                    <div className="h-8 w-64 bg-white/10 rounded-lg mb-3" />

                    <div className="h-4 w-80 bg-white/5 rounded-lg mb-8" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-36 bg-[#111827] border border-white/10 rounded-2xl"
                            />
                        ))}
                    </div>

                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error || !data) {
        return (
            <div className="min-h-screen text-white">
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-10 text-center">

                    <div className="text-4xl mb-4">
                        ⚠️
                    </div>

                    <h2 className="text-xl font-semibold">
                        Failed to load dashboard
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Please refresh the page and try again.
                    </p>

                </div>
            </div>
        );
    }

    // =====================================================
    // SUPER ADMIN DASHBOARD
    // =====================================================

    if (data.role === "SUPER_ADMIN") {
        const stats = data.stats as SuperAdminStats;

        return (
            <div className="min-h-screen text-white">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back 👋
                    </h1>

                    <p className="text-gray-400 mt-1">
                        Here's what's happening with your businesses today.
                    </p>
                </div>

                {/* BUSINESS STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* BUSINESSES */}
                    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-400 text-sm">
                                    Businesses
                                </p>

                                <p className="text-4xl font-bold mt-3">
                                    {stats.businesses}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl">
                                🏢
                            </div>

                        </div>

                        <p className="text-gray-500 text-sm mt-5">
                            Total businesses
                        </p>
                    </div>

                    {/* ACTIVE */}
                    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-400 text-sm">
                                    Active Businesses
                                </p>

                                <p className="text-4xl font-bold mt-3">
                                    {stats.activeBusinesses}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-2xl">
                                ✓
                            </div>

                        </div>

                        <p className="text-gray-500 text-sm mt-5">
                            Currently active
                        </p>
                    </div>

                    {/* TRIAL */}
                    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-400 text-sm">
                                    Trial Businesses
                                </p>

                                <p className="text-4xl font-bold mt-3">
                                    {stats.trialBusinesses}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-2xl">
                                ⏳
                            </div>

                        </div>

                        <p className="text-gray-500 text-sm mt-5">
                            Currently on trial
                        </p>
                    </div>

                </div>

                {/* BUSINESS OVERVIEW */}
                <div className="mt-8 bg-[#111827] border border-white/10 rounded-2xl p-6">

                    <div className="mb-6">
                        <h2 className="text-lg font-bold">
                            Business Overview
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                            Current subscription status
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* ACTIVE */}
                        <div className="bg-[#0b1120] rounded-xl p-5 border border-white/5">

                            <div className="flex items-center justify-between">
                                <p className="text-gray-400 text-sm">
                                    Active
                                </p>

                                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>

                            <p className="text-2xl font-bold mt-3">
                                {stats.activeBusinesses}
                            </p>

                            <p className="text-gray-500 text-xs mt-2">
                                Active subscriptions
                            </p>

                        </div>

                        {/* TRIAL */}
                        <div className="bg-[#0b1120] rounded-xl p-5 border border-white/5">

                            <div className="flex items-center justify-between">
                                <p className="text-gray-400 text-sm">
                                    Trial
                                </p>

                                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                            </div>

                            <p className="text-2xl font-bold mt-3">
                                {stats.trialBusinesses}
                            </p>

                            <p className="text-gray-500 text-xs mt-2">
                                Businesses on trial
                            </p>

                        </div>

                        {/* EXPIRED */}
                        <div className="bg-[#0b1120] rounded-xl p-5 border border-white/5">

                            <div className="flex items-center justify-between">
                                <p className="text-gray-400 text-sm">
                                    Expired
                                </p>

                                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            </div>

                            <p className="text-2xl font-bold mt-3">
                                {stats.expiredBusinesses}
                            </p>

                            <p className="text-gray-500 text-xs mt-2">
                                Expired subscriptions
                            </p>

                        </div>

                    </div>
                </div>

            </div>
        );
    }

    // =====================================================
    // BUSINESS ADMIN DASHBOARD
    // =====================================================

    const stats = data.stats as AdminStats;

    return (
        <div className="min-h-screen text-white">

            {/* HEADER */}
            <div className="mb-8">

                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back 👋
                </h1>

                <p className="text-gray-400 mt-1">
                    Here's what's happening with your menu today.
                </p>

            </div>

            {/* MENU STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* CATEGORIES */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-gray-400 text-sm">
                                Categories
                            </p>

                            <p className="text-4xl font-bold mt-3">
                                {stats.categories}
                            </p>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl">
                            📂
                        </div>

                    </div>

                    <p className="text-gray-500 text-sm mt-5">
                        Categories in your menu
                    </p>

                </div>

                {/* PRODUCTS */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-gray-400 text-sm">
                                Products
                            </p>

                            <p className="text-4xl font-bold mt-3">
                                {stats.products}
                            </p>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-2xl">
                            🍽️
                        </div>

                    </div>

                    <p className="text-gray-500 text-sm mt-5">
                        Items in your menu
                    </p>

                </div>

            </div>

        </div>
    );
}