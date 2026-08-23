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
                    currentUser.business.themeColor
                );
            }
        } catch (error: any) {
            alert(
                error.response?.data?.message ||
                "Failed to load settings."
            );
        } finally {
            setLoading(false);
        }
    }

    async function saveAccount() {
        try {
            setSaving(true);

            await api.put("/auth/me", {
                username: username.trim(),
            });

            alert("Account updated successfully.");

            await loadSettings();
        } catch (error: any) {
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
            <div className="text-gray-400">
                Loading settings...
            </div>
        );
    }

    return (
        <div className="max-w-5xl">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Settings
                </h1>

                <p className="text-gray-400 mt-1">
                    Manage your account and preferences.
                </p>
            </div>

            {/* ACCOUNT */}
            <section className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">

                <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                        Account
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        Manage your MenuM account.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Username
                        </label>

                        <input
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Role
                        </label>

                        <div className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-gray-300">
                            {user?.role === "SUPER_ADMIN"
                                ? "Super Admin"
                                : "Business Admin"}
                        </div>
                    </div>

                </div>

                <button
                    onClick={saveAccount}
                    disabled={saving}
                    className="mt-5 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                    Save Account
                </button>

            </section>

            {/* BUSINESS */}
            {user?.role === "ADMIN" && business && (
                <section className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            Business
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Manage your business information.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

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
                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Slug
                            </label>

                            <div className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-gray-500">
                                @{business.slug}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Phone
                            </label>

                            <input
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Theme Color
                            </label>

                            <div className="flex gap-3">

                                <input
                                    type="color"
                                    value={themeColor}
                                    onChange={(e) =>
                                        setThemeColor(
                                            e.target.value
                                        )
                                    }
                                    className="w-14 h-12 bg-transparent cursor-pointer"
                                />

                                <input
                                    value={themeColor}
                                    onChange={(e) =>
                                        setThemeColor(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                                />

                            </div>
                        </div>

                    </div>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">

                        <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">
                            <p className="text-xs text-gray-500">
                                Subscription
                            </p>

                            <p className="mt-2 font-semibold">
                                {business.subscriptionStatus}
                            </p>
                        </div>

                        <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">
                            <p className="text-xs text-gray-500">
                                Trial Ends
                            </p>

                            <p className="mt-2 font-semibold">
                                {new Date(
                                    business.trialEndsAt
                                ).toLocaleDateString("en-GB")}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={saveBusiness}
                        disabled={saving}
                        className="mt-5 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                        Save Business
                    </button>

                </section>
            )}

            {/* PASSWORD */}
            <section className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">

                <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                        Security
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        Change your account password.
                    </p>
                </div>

                <div className="space-y-5 max-w-xl">

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
                            className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

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
                            className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

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
                            className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        onClick={changePassword}
                        disabled={saving}
                        className="bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                        Change Password
                    </button>

                </div>

            </section>

            {/* DANGER ZONE */}
            <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">

                <h2 className="text-xl font-semibold text-red-400">
                    Session
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                    Sign out from this MenuM account.
                </p>

                <button
                    onClick={logout}
                    className="mt-5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-5 py-3 rounded-xl font-semibold"
                >
                    Logout
                </button>

            </section>

        </div>
    );
}