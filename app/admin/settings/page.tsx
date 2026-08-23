"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Role = "ADMIN" | "SUPER_ADMIN";

type User = {
    id: number;
    username: string;
    role: Role;
    businessId: number | null;
};

type Business = {
    id: number;
    name: string;
    slug: string;
    phone: string | null;
    themeColor: string;
    subscriptionStatus: "TRIAL" | "ACTIVE" | "EXPIRED";
    trialEndsAt: string;
    isActive: boolean;
};

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);

    const [username, setUsername] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [businessName, setBusinessName] = useState("");
    const [phone, setPhone] = useState("");
    const [themeColor, setThemeColor] = useState("#8dbbf7");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);

            const response = await api.get("/auth/me");

            const currentUser = response.data.user;

            setUser(currentUser);
            setUsername(currentUser.username);

            if (currentUser.business) {
                setBusiness(currentUser.business);

                setBusinessName(currentUser.business.name);
                setPhone(currentUser.business.phone || "");
                setThemeColor(
                    currentUser.business.themeColor || "#8dbbf7"
                );
            }
        } catch (error: any) {
            console.error("Settings loading error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to load settings."
            );
        } finally {
            setLoading(false);
        }
    }

    async function saveAccount() {
        if (!username.trim()) {
            alert("Username is required.");
            return;
        }

        try {
            setSaving(true);

            await api.put("/auth/me", {
                username: username.trim(),
            });

            alert("Account updated successfully.");

            await loadSettings();
        } catch (error: any) {
            console.error("Account update error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to update account."
            );
        } finally {
            setSaving(false);
        }
    }

    async function changePassword() {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all password fields.");
            return;
        }

        if (newPassword.length < 6) {
            alert(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        try {
            setSaving(true);

            await api.put("/auth/change-password", {
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            alert("Password changed successfully.");
        } catch (error: any) {
            console.error("Password change error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to change password."
            );
        } finally {
            setSaving(false);
        }
    }

    async function saveBusiness() {
        if (!business) return;

        if (!businessName.trim()) {
            alert("Business name is required.");
            return;
        }

        try {
            setSaving(true);

            await api.put("/businesses/me", {
                name: businessName.trim(),
                phone: phone.trim(),
                themeColor,
            });

            alert("Business settings updated.");

            await loadSettings();
        } catch (error: any) {
            console.error("Business update error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to update business."
            );
        } finally {
            setSaving(false);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-4">
                <div className="text-gray-400 text-sm sm:text-base">
                    Loading settings...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl text-white">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Settings
                </h1>

                <p className="text-gray-400 text-sm sm:text-base mt-1">
                    Manage your account and preferences.
                </p>
            </div>

            {/* ================================================= */}
            {/* ACCOUNT */}
            {/* ================================================= */}

            <section className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6">

                <div className="mb-5 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold">
                        Account
                    </h2>

                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Manage your MenuM account.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                    {/* USERNAME */}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Username
                        </label>

                        <input
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            className="w-full min-w-0 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {/* ROLE */}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Role
                        </label>

                        <div className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-300">
                            {user?.role === "SUPER_ADMIN"
                                ? "Super Admin"
                                : "Business Admin"}
                        </div>
                    </div>

                </div>

                <button
                    onClick={saveAccount}
                    disabled={saving}
                    className="w-full sm:w-auto mt-5 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Account"}
                </button>

            </section>

            {/* ================================================= */}
            {/* BUSINESS */}
            {/* ================================================= */}

            {user?.role === "ADMIN" && business && (
                <section className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6">

                    <div className="mb-5 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold">
                            Business
                        </h2>

                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                            Manage your business information.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                        {/* BUSINESS NAME */}

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Business Name
                            </label>

                            <input
                                value={businessName}
                                onChange={(e) =>
                                    setBusinessName(
                                        e.target.value
                                    )
                                }
                                className="w-full min-w-0 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {/* SLUG */}

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Slug
                            </label>

                            <div className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-500 overflow-hidden text-ellipsis">
                                @{business.slug}
                            </div>
                        </div>

                        {/* PHONE */}

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Phone
                            </label>

                            <input
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                placeholder="+90..."
                                className="w-full min-w-0 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {/* THEME COLOR */}

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Theme Color
                            </label>

                            <div className="flex gap-2 sm:gap-3">

                                <input
                                    type="color"
                                    value={themeColor}
                                    onChange={(e) =>
                                        setThemeColor(
                                            e.target.value
                                        )
                                    }
                                    className="w-12 h-12 sm:w-14 sm:h-12 shrink-0 bg-transparent cursor-pointer"
                                />

                                <input
                                    value={themeColor}
                                    onChange={(e) =>
                                        setThemeColor(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 min-w-0 bg-[#0b1120] border border-white/10 rounded-xl px-3 sm:px-4 py-3 text-sm sm:text-base text-white outline-none focus:border-blue-500"
                                />

                            </div>
                        </div>

                    </div>

                    {/* SUBSCRIPTION INFO */}

                    <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                        <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">
                            <p className="text-xs text-gray-500">
                                Subscription
                            </p>

                            <p
                                className={`mt-2 font-semibold text-sm sm:text-base ${
                                    business.subscriptionStatus ===
                                    "ACTIVE"
                                        ? "text-green-400"
                                        : business.subscriptionStatus ===
                                          "TRIAL"
                                        ? "text-blue-400"
                                        : "text-red-400"
                                }`}
                            >
                                {business.subscriptionStatus}
                            </p>
                        </div>

                        <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">
                            <p className="text-xs text-gray-500">
                                Trial Ends
                            </p>

                            <p className="mt-2 font-semibold text-sm sm:text-base">
                                {new Date(
                                    business.trialEndsAt
                                ).toLocaleDateString("en-GB")}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={saveBusiness}
                        disabled={saving}
                        className="w-full sm:w-auto mt-5 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Business"}
                    </button>

                </section>
            )}

            {/* ================================================= */}
            {/* SECURITY */}
            {/* ================================================= */}

            <section className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6">

                <div className="mb-5 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold">
                        Security
                    </h2>

                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Change your account password.
                    </p>
                </div>

                <div className="space-y-4 sm:space-y-5 w-full sm:max-w-xl">

                    {/* CURRENT PASSWORD */}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Current Password
                        </label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            className="w-full min-w-0 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {/* NEW PASSWORD */}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            className="w-full min-w-0 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            className="w-full min-w-0 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        onClick={changePassword}
                        disabled={saving}
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition disabled:opacity-50"
                    >
                        {saving
                            ? "Changing..."
                            : "Change Password"}
                    </button>

                </div>

            </section>

            {/* ================================================= */}
            {/* SESSION / DANGER ZONE */}
            {/* ================================================= */}

            <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 sm:p-6">

                <h2 className="text-lg sm:text-xl font-semibold text-red-400">
                    Session
                </h2>

                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    Sign out from this MenuM account.
                </p>

                <button
                    onClick={logout}
                    className="w-full sm:w-auto mt-5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition"
                >
                    Logout
                </button>

            </section>

        </div>
    );
}