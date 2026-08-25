"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Role = "ADMIN" | "SUPER_ADMIN";

type WifiSecurity = "WPA" | "WPA2";

type Business = {
    id: number;
    name: string;
    slug: string;
    phone?: string | null;
    themeColor: string;
    currency: string;

    wifiName?: string | null;
    wifiPassword?: string | null;
    wifiSecurity?: WifiSecurity | null;

    subscriptionStatus: "TRIAL" | "ACTIVE" | "EXPIRED";
    trialEndsAt: string;
    isActive: boolean;
};

export default function BusinessPage() {
    const [role, setRole] = useState<Role | null>(null);
    const [businesses, setBusinesses] = useState<Business[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =====================================================
    // EDIT
    // =====================================================

    const [editingBusiness, setEditingBusiness] =
        useState<Business | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [themeColor, setThemeColor] = useState("#8dbbf7");
    const [currency, setCurrency] = useState("TRY");
    const [isActive, setIsActive] = useState(true);

    const [wifiName, setWifiName] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [wifiSecurity, setWifiSecurity] =
        useState<WifiSecurity>("WPA2");

    // =====================================================
    // CREATE
    // =====================================================

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [createName, setCreateName] = useState("");
    const [createSlug, setCreateSlug] = useState("");
    const [createPhone, setCreatePhone] = useState("");
    const [createThemeColor, setCreateThemeColor] =
        useState("#8dbbf7");
    const [createCurrency, setCreateCurrency] =
        useState("TRY");

    const [createWifiName, setCreateWifiName] = useState("");
    const [createWifiPassword, setCreateWifiPassword] =
        useState("");
    const [createWifiSecurity, setCreateWifiSecurity] =
        useState<WifiSecurity>("WPA2");

    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    // =====================================================
    // QR
    // =====================================================

    const [qrBusiness, setQrBusiness] =
        useState<Business | null>(null);

    const [qrCode, setQrCode] = useState("");
    const [qrMenuUrl, setQrMenuUrl] = useState("");
    const [qrLoading, setQrLoading] = useState(false);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadBusinesses();
    }, []);

    async function loadBusinesses() {
        try {
            setLoading(true);

            const meResponse = await api.get("/auth/me");

            const user = meResponse.data.user;

            const userRole: Role =
                user?.role ?? meResponse.data.role;

            setRole(userRole);

            if (userRole === "SUPER_ADMIN") {
                const response =
                    await api.get("/businesses");

                setBusinesses(
                    response.data.businesses ?? []
                );

                return;
            }

            if (userRole === "ADMIN") {
                const response =
                    await api.get("/businesses/me");

                const business =
                    response.data.business;

                setBusinesses(
                    business ? [business] : []
                );

                return;
            }

            throw new Error("Invalid user role.");
        } catch (error: any) {
            console.error(
                "Business loading error:",
                error
            );

            alert(
                error.response?.data?.message ??
                "Failed to load business."
            );
        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // CREATE
    // =====================================================

    function resetCreateForm() {
        setCreateName("");
        setCreateSlug("");
        setCreatePhone("");
        setCreateThemeColor("#8dbbf7");
        setCreateCurrency("TRY");

        setCreateWifiName("");
        setCreateWifiPassword("");
        setCreateWifiSecurity("WPA2");

        setAdminUsername("");
        setAdminPassword("");
    }

    function openCreateModal() {
        resetCreateForm();
        setShowCreateModal(true);
    }

    function closeCreateModal() {
        if (saving) return;

        resetCreateForm();
        setShowCreateModal(false);
    }

    async function handleCreateBusiness() {
        if (
            !createName.trim() ||
            !createSlug.trim() ||
            !adminUsername.trim() ||
            !adminPassword
        ) {
            alert(
                "Business name, slug, admin username and admin password are required."
            );
            return;
        }

        if (adminPassword.length < 6) {
            alert(
                "Admin password must be at least 6 characters."
            );
            return;
        }

        if (
            createWifiName.trim() &&
            !createWifiPassword.trim()
        ) {
            alert(
                "Please enter a Wi-Fi password or leave the Wi-Fi name empty."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await api.post(
                "/businesses",
                {
                    name: createName.trim(),

                    slug: createSlug
                        .trim()
                        .toLowerCase(),

                    phone:
                        createPhone.trim() ||
                        undefined,

                    themeColor: createThemeColor,
                    currency: createCurrency,

                    wifiName:
                        createWifiName.trim() ||
                        undefined,

                    wifiPassword:
                        createWifiPassword.trim() ||
                        undefined,

                    wifiSecurity:
                        createWifiName.trim()
                            ? createWifiSecurity
                            : undefined,

                    adminUsername:
                        adminUsername.trim(),

                    adminPassword,
                }
            );

            const createdBusiness =
                response.data.data?.business;

            const createdAdmin =
                response.data.data?.admin;

            closeCreateModal();

            await loadBusinesses();

            alert(
                `Business "${createdBusiness?.name ?? createName}" created successfully.\n\n` +
                `Admin username: ${createdAdmin?.username ?? adminUsername}\n` +
                `Password: ${adminPassword}`
            );
        } catch (error: any) {
            console.error(
                "Create business error:",
                error
            );

            alert(
                error.response?.data?.message ??
                "Failed to create business."
            );
        } finally {
            setSaving(false);
        }
    }

    // =====================================================
    // EDIT
    // =====================================================

    function openEdit(business: Business) {
        setEditingBusiness(business);

        setName(business.name);
        setPhone(business.phone ?? "");

        setThemeColor(
            business.themeColor || "#8dbbf7"
        );

        setCurrency(
            business.currency || "TRY"
        );

        setIsActive(business.isActive);

        setWifiName(
            business.wifiName ?? ""
        );

        // Passwords should normally not be returned
        // from the backend. Admin can enter a new one.
        setWifiPassword("");

        setWifiSecurity(
            business.wifiSecurity || "WPA2"
        );
    }

    function closeEdit() {
        if (saving) return;

        setEditingBusiness(null);

        setName("");
        setPhone("");
        setThemeColor("#8dbbf7");
        setCurrency("TRY");
        setIsActive(true);

        setWifiName("");
        setWifiPassword("");
        setWifiSecurity("WPA2");
    }

    async function handleUpdate() {
        if (!editingBusiness) return;

        if (!name.trim()) {
            alert("Business name is required.");
            return;
        }

        if (
            wifiName.trim() &&
            !wifiPassword.trim() &&
            !editingBusiness.wifiPassword
        ) {
            alert(
                "Please enter a Wi-Fi password."
            );
            return;
        }

        try {
            setSaving(true);

            const payload: Record<string, any> = {
                name: name.trim(),

                phone:
                    phone.trim() ||
                    undefined,

                themeColor,
                currency,
                isActive,

                wifiName:
                    wifiName.trim() ||
                    undefined,

                wifiSecurity:
                    wifiName.trim()
                        ? wifiSecurity
                        : undefined,
            };

            // Only send a new Wi-Fi password when
            // the admin actually entered one.
            if (wifiPassword.trim()) {
                payload.wifiPassword =
                    wifiPassword.trim();
            }

            if (role === "ADMIN") {
                await api.put(
                    "/businesses/me",
                    payload
                );
            } else {
                await api.put(
                    `/businesses/${editingBusiness.id}`,
                    payload
                );
            }

            closeEdit();

            await loadBusinesses();
        } catch (error: any) {
            console.error(
                "Update business error:",
                error
            );

            alert(
                error.response?.data?.message ??
                "Failed to update business."
            );
        } finally {
            setSaving(false);
        }
    }

    // =====================================================
    // END TRIAL
    // =====================================================

    async function handleEndTrial(
        business: Business
    ) {
        if (role !== "SUPER_ADMIN") return;

        if (
            business.subscriptionStatus !== "TRIAL"
        ) {
            return;
        }

        const confirmed = confirm(
            `End trial for "${business.name}"?\n\n` +
            `The subscription will become EXPIRED.`
        );

        if (!confirmed) return;

        try {
            setSaving(true);

            await api.put(
                `/businesses/${business.id}`,
                {
                    subscriptionStatus: "EXPIRED",
                    trialEndsAt:
                        new Date().toISOString(),
                }
            );

            await loadBusinesses();
        } catch (error: any) {
            console.error(
                "End trial error:",
                error
            );

            alert(
                error.response?.data?.message ??
                "Failed to end trial."
            );
        } finally {
            setSaving(false);
        }
    }

    // =====================================================
    // DELETE
    // =====================================================

    async function handleDeleteBusiness(
        business: Business
    ) {
        if (role !== "SUPER_ADMIN") return;

        const confirmed = confirm(
            `Delete "${business.name}" permanently?\n\n` +
            `This will also delete its users, categories and products.\n\n` +
            `This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setSaving(true);

            await api.delete(
                `/businesses/${business.id}`
            );

            await loadBusinesses();
        } catch (error: any) {
            console.error(
                "Delete business error:",
                error
            );

            alert(
                error.response?.data?.message ??
                "Failed to delete business."
            );
        } finally {
            setSaving(false);
        }
    }

    // =====================================================
    // QR
    // =====================================================

    async function handleOpenQr(
        business: Business
    ) {
        try {
            setQrLoading(true);

            setQrBusiness(business);
            setQrCode("");
            setQrMenuUrl("");

            const endpoint =
                role === "ADMIN"
                    ? "/businesses/me/qr"
                    : `/businesses/${business.id}/qr`;

            const response =
                await api.get(endpoint);

            setQrCode(
                response.data.qrCode ?? ""
            );

            setQrMenuUrl(
                response.data.menuUrl ?? ""
            );
        } catch (error: any) {
            console.error(
                "QR error:",
                error
            );

            setQrBusiness(null);

            alert(
                error.response?.data?.message ??
                "Failed to generate QR code."
            );
        } finally {
            setQrLoading(false);
        }
    }

    function closeQr() {
        if (qrLoading) return;

        setQrBusiness(null);
        setQrCode("");
        setQrMenuUrl("");
    }

    function downloadQr() {
        if (!qrCode || !qrBusiness) return;

        const link =
            document.createElement("a");

        link.href = qrCode;

        link.download =
            `${qrBusiness.slug}-qr.png`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    // =====================================================
    // HELPERS
    // =====================================================

    function formatDate(
        date?: string | null
    ) {
        if (!date) return "-";

        return new Date(date)
            .toLocaleDateString("en-GB");
    }

    function subscriptionClass(
        status: Business["subscriptionStatus"]
    ) {
        if (status === "ACTIVE") {
            return "text-green-400";
        }

        if (status === "TRIAL") {
            return "text-blue-400";
        }

        return "text-red-400";
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="text-gray-400">
                Loading business...
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="text-white">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {role === "SUPER_ADMIN"
                            ? "Businesses"
                            : "My Business"}
                    </h1>

                    <p className="text-gray-400 mt-1 text-sm sm:text-base">
                        {role === "SUPER_ADMIN"
                            ? "Manage all businesses on meno."
                            : "Manage your business information and menu QR code."}
                    </p>
                </div>

                {role === "SUPER_ADMIN" && (
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold transition"
                    >
                        + Add Business
                    </button>
                )}

            </div>

            {/* ================================================= */}
            {/* NO BUSINESS */}
            {/* ================================================= */}

            {businesses.length === 0 && (
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 sm:p-16 text-center">

                    <div className="text-4xl sm:text-5xl mb-4">
                        🏢
                    </div>

                    <h2 className="text-lg sm:text-xl font-semibold">
                        {role === "ADMIN"
                            ? "No business assigned"
                            : "No businesses yet"}
                    </h2>

                    <p className="text-gray-400 mt-2 text-sm sm:text-base">
                        {role === "ADMIN"
                            ? "Your account is not assigned to a business."
                            : "Create your first business to get started."}
                    </p>

                    {role === "SUPER_ADMIN" && (
                        <button
                            onClick={openCreateModal}
                            className="w-full sm:w-auto mt-6 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold"
                        >
                            + Create Business
                        </button>
                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* BUSINESS CARDS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">

                {businesses.map(
                    (business) => (
                        <div
                            key={business.id}
                            className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden"
                        >

                            {/* COLOR BAR */}

                            <div
                                className="h-1.5 sm:h-2"
                                style={{
                                    backgroundColor:
                                        business.themeColor,
                                }}
                            />

                            <div className="p-4 sm:p-6">

                                {/* TITLE */}

                                <div className="flex items-start justify-between gap-3">

                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                                        <div
                                            className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl"
                                            style={{
                                                backgroundColor:
                                                    `${business.themeColor}20`,
                                            }}
                                        >
                                            🏢
                                        </div>

                                        <div className="min-w-0">

                                            <h2 className="text-lg sm:text-xl font-bold truncate">
                                                {business.name}
                                            </h2>

                                            <p className="text-gray-500 text-xs sm:text-sm mt-1 truncate">
                                                @{business.slug}
                                            </p>

                                        </div>

                                    </div>

                                    <span
                                        className={`flex-shrink-0 text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 rounded-full ${
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

                                {/* INFO */}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 sm:mt-6">

                                    <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">

                                        <p className="text-xs text-gray-500">
                                            Phone
                                        </p>

                                        <p className="text-sm mt-2 break-words">
                                            {business.phone ||
                                                "Not provided"}
                                        </p>

                                    </div>

                                    <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">

                                        <p className="text-xs text-gray-500">
                                            Currency
                                        </p>

                                        <p className="text-sm mt-2">
                                            {business.currency === "TRY" &&
                                                "Turkish Lira (₺)"}

                                            {business.currency === "USD" &&
                                                "US Dollar ($)"}

                                            {business.currency === "EUR" &&
                                                "Euro (€)"}

                                            {business.currency === "GBP" &&
                                                "British Pound (£)"}
                                        </p>

                                    </div>

                                    <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">

                                        <p className="text-xs text-gray-500">
                                            Subscription
                                        </p>

                                        <p
                                            className={`text-sm mt-2 font-medium ${subscriptionClass(
                                                business.subscriptionStatus
                                            )}`}
                                        >
                                            {business.subscriptionStatus}
                                        </p>

                                    </div>

                                    <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">

                                        <p className="text-xs text-gray-500">
                                            Trial Ends
                                        </p>

                                        <p className="text-sm mt-2">
                                            {formatDate(
                                                business.trialEndsAt
                                            )}
                                        </p>

                                    </div>

                                    <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">

                                        <p className="text-xs text-gray-500">
                                            Theme
                                        </p>

                                        <div className="flex items-center gap-2 mt-2">

                                            <span
                                                className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        business.themeColor,
                                                }}
                                            />

                                            <span className="text-sm truncate">
                                                {business.themeColor}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="bg-[#0b1120] border border-white/5 rounded-xl p-4">

                                        <p className="text-xs text-gray-500">
                                            Wi-Fi
                                        </p>

                                        {business.wifiName ? (
                                            <>
                                                <p className="text-sm mt-2 font-medium">
                                                    📶 {business.wifiName}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    {business.wifiSecurity ||
                                                        "WPA2"}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm mt-2 text-gray-500">
                                                Not configured
                                            </p>
                                        )}

                                    </div>

                                </div>

                                {/* ACTIONS */}

                                <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">

                                    {/* EDIT */}

                                    <button
                                        onClick={() =>
                                            openEdit(business)
                                        }
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-lg text-sm font-medium transition"
                                    >
                                        Edit Business
                                    </button>

                                    {/* QR */}

                                    <button
                                        onClick={() =>
                                            handleOpenQr(business)
                                        }
                                        disabled={qrLoading}
                                        className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                    >
                                        QR Code
                                    </button>

                                    {/* END TRIAL */}

                                    {role === "SUPER_ADMIN" &&
                                        business.subscriptionStatus ===
                                            "TRIAL" && (
                                            <button
                                                onClick={() =>
                                                    handleEndTrial(
                                                        business
                                                    )
                                                }
                                                disabled={saving}
                                                className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                            >
                                                End Trial
                                            </button>
                                        )}

                                    {/* DELETE */}

                                    {role === "SUPER_ADMIN" && (
                                        <button
                                            onClick={() =>
                                                handleDeleteBusiness(
                                                    business
                                                )
                                            }
                                            disabled={saving}
                                            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>
                    )
                )}

            </div>

            {/* ================================================= */}
            {/* CREATE MODAL */}
            {/* ================================================= */}

            {showCreateModal &&
                role === "SUPER_ADMIN" && (
                    <div
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                    event.currentTarget &&
                                !saving
                            ) {
                                closeCreateModal();
                            }
                        }}
                    >

                        <div className="w-full sm:max-w-2xl bg-[#111827] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">

                            {/* HEADER */}

                            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">

                                <div className="min-w-0">

                                    <h2 className="text-lg sm:text-xl font-bold">
                                        Add Business
                                    </h2>

                                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                        Create a business and its admin account.
                                    </p>

                                </div>

                                <button
                                    onClick={closeCreateModal}
                                    disabled={saving}
                                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-white text-xl disabled:opacity-50"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* BODY */}

                            <div className="p-5 sm:p-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* BUSINESS */}

                                    <div className="space-y-4">

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">
                                                Business Name
                                            </label>

                                            <input
                                                value={createName}
                                                onChange={(e) =>
                                                    setCreateName(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Demo Restaurant"
                                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">
                                                Slug
                                            </label>

                                            <input
                                                value={createSlug}
                                                onChange={(e) =>
                                                    setCreateSlug(
                                                        e.target.value.toLowerCase()
                                                    )
                                                }
                                                placeholder="demo-restaurant"
                                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">
                                                Phone
                                            </label>

                                            <input
                                                value={createPhone}
                                                onChange={(e) =>
                                                    setCreatePhone(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="+90..."
                                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">
                                                Theme Color
                                            </label>

                                            <div className="flex gap-3">

                                                <input
                                                    type="color"
                                                    value={createThemeColor}
                                                    onChange={(e) =>
                                                        setCreateThemeColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-12 sm:w-14 h-12 bg-transparent cursor-pointer flex-shrink-0"
                                                />

                                                <input
                                                    value={createThemeColor}
                                                    onChange={(e) =>
                                                        setCreateThemeColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="min-w-0 flex-1 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                                />

                                            </div>

                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">
                                                Currency
                                            </label>

                                            <select
                                                value={createCurrency}
                                                onChange={(e) =>
                                                    setCreateCurrency(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                                            >
                                                <option value="TRY">
                                                    Turkish Lira (₺)
                                                </option>

                                                <option value="USD">
                                                    US Dollar ($)
                                                </option>

                                                <option value="EUR">
                                                    Euro (€)
                                                </option>

                                                <option value="GBP">
                                                    British Pound (£)
                                                </option>
                                            </select>
                                        </div>

                                        {/* WIFI */}

                                        <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-4">

                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-lg">
                                                    📶
                                                </span>

                                                <div>
                                                    <h3 className="font-semibold">
                                                        Wi-Fi
                                                    </h3>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Optional. Customers can connect from the menu.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">

                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">
                                                        Wi-Fi Name (SSID)
                                                    </label>

                                                    <input
                                                        value={createWifiName}
                                                        onChange={(e) =>
                                                            setCreateWifiName(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Cafe_WiFi"
                                                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">
                                                        Wi-Fi Password
                                                    </label>

                                                    <input
                                                        type="password"
                                                        value={createWifiPassword}
                                                        onChange={(e) =>
                                                            setCreateWifiPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Wi-Fi password"
                                                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">
                                                        Security
                                                    </label>

                                                    <select
                                                        value={createWifiSecurity}
                                                        onChange={(e) =>
                                                            setCreateWifiSecurity(
                                                                e.target.value as WifiSecurity
                                                            )
                                                        }
                                                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                                                    >
                                                        <option value="WPA">
                                                            WPA
                                                        </option>

                                                        <option value="WPA2">
                                                            WPA2
                                                        </option>
                                                    </select>
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ADMIN */}

                                    <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-4 sm:p-5 h-fit">

                                        <h3 className="font-semibold">
                                            Admin Account
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-1 mb-5">
                                            This account will receive the ADMIN role.
                                        </p>

                                        <div className="space-y-4">

                                            <input
                                                value={adminUsername}
                                                onChange={(e) =>
                                                    setAdminUsername(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Admin username"
                                                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                            />

                                            <input
                                                type="password"
                                                value={adminPassword}
                                                onChange={(e) =>
                                                    setAdminPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Minimum 6 characters"
                                                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* FOOTER */}

                            <div className="flex flex-col-reverse sm:flex-row gap-3 p-5 sm:p-6 border-t border-white/10">

                                <button
                                    onClick={closeCreateModal}
                                    disabled={saving}
                                    className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleCreateBusiness}
                                    disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold disabled:opacity-50"
                                >
                                    {saving
                                        ? "Creating..."
                                        : "Create Business"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            {/* ================================================= */}
            {/* EDIT MODAL */}
            {/* ================================================= */}

            {editingBusiness && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                                event.currentTarget &&
                            !saving
                        ) {
                            closeEdit();
                        }
                    }}
                >

                    <div className="w-full sm:max-w-lg bg-[#111827] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">

                        {/* HEADER */}

                        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">

                            <div className="min-w-0">

                                <h2 className="text-lg sm:text-xl font-bold">
                                    Edit Business
                                </h2>

                                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                    Update business information.
                                </p>

                            </div>

                            <button
                                onClick={closeEdit}
                                disabled={saving}
                                className="flex-shrink-0 ml-4 text-gray-400 hover:text-white text-xl disabled:opacity-50"
                            >
                                ✕
                            </button>

                        </div>

                        {/* BODY */}

                        <div className="p-5 sm:p-6 space-y-5">

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Business Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Phone
                                </label>

                                <input
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                        )
                                    }
                                    placeholder="+90..."
                                    className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
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
                                        className="w-12 sm:w-14 h-12 bg-transparent cursor-pointer flex-shrink-0"
                                    />

                                    <input
                                        value={themeColor}
                                        onChange={(e) =>
                                            setThemeColor(
                                                e.target.value
                                            )
                                        }
                                        className="min-w-0 flex-1 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                    />

                                </div>

                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Currency
                                </label>

                                <select
                                    value={currency}
                                    onChange={(e) =>
                                        setCurrency(
                                            e.target.value
                                        )
                                    }
                                    className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                                >
                                    <option value="TRY">
                                        Turkish Lira (₺)
                                    </option>

                                    <option value="USD">
                                        US Dollar ($)
                                    </option>

                                    <option value="EUR">
                                        Euro (€)
                                    </option>

                                    <option value="GBP">
                                        British Pound (£)
                                    </option>
                                </select>
                            </div>

                            {/* WIFI */}

                            <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-4">

                                <div className="flex items-center gap-2 mb-4">

                                    <span className="text-lg">
                                        📶
                                    </span>

                                    <div>
                                        <h3 className="font-semibold">
                                            Wi-Fi Settings
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Leave Wi-Fi name empty to disable Wi-Fi on the menu.
                                        </p>
                                    </div>

                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">
                                            Wi-Fi Name (SSID)
                                        </label>

                                        <input
                                            value={wifiName}
                                            onChange={(e) =>
                                                setWifiName(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Cafe_WiFi"
                                            className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">
                                            Wi-Fi Password
                                        </label>

                                        <input
                                            type="password"
                                            value={wifiPassword}
                                            onChange={(e) =>
                                                setWifiPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter new password"
                                            className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                        />

                                        <p className="text-xs text-gray-500 mt-2">
                                            Leave empty to keep the current password.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">
                                            Security
                                        </label>

                                        <select
                                            value={wifiSecurity}
                                            onChange={(e) =>
                                                setWifiSecurity(
                                                    e.target.value as WifiSecurity
                                                )
                                            }
                                            className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                                        >
                                            <option value="WPA">
                                                WPA
                                            </option>

                                            <option value="WPA2">
                                                WPA2
                                            </option>
                                        </select>
                                    </div>

                                </div>

                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) =>
                                        setIsActive(
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 accent-blue-600"
                                />

                                <span className="text-sm text-gray-300">
                                    Business is active
                                </span>

                            </label>

                        </div>

                        {/* FOOTER */}

                        <div className="flex flex-col-reverse sm:flex-row gap-3 p-5 sm:p-6 border-t border-white/10">

                            <button
                                onClick={closeEdit}
                                disabled={saving}
                                className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* ================================================= */}
            {/* QR MODAL */}
            {/* ================================================= */}

            {qrBusiness && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                                event.currentTarget &&
                            !qrLoading
                        ) {
                            closeQr();
                        }
                    }}
                >

                    <div className="w-full sm:max-w-md bg-[#111827] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">

                        {/* HEADER */}

                        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">

                            <div className="min-w-0">

                                <h2 className="text-lg sm:text-xl font-bold">
                                    QR Code
                                </h2>

                                <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">
                                    {qrBusiness.name}
                                </p>

                            </div>

                            <button
                                onClick={closeQr}
                                disabled={qrLoading}
                                className="flex-shrink-0 ml-4 text-gray-400 hover:text-white text-xl disabled:opacity-50"
                            >
                                ✕
                            </button>

                        </div>

                        {/* BODY */}

                        <div className="p-5 sm:p-6">

                            {qrLoading ? (

                                <div className="py-16 text-center text-gray-400">
                                    Generating QR code...
                                </div>

                            ) : qrCode ? (

                                <>

                                    <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-center">

                                        <img
                                            src={qrCode}
                                            alt="Business QR Code"
                                            className="w-full max-w-[280px] aspect-square"
                                        />

                                    </div>

                                    <div className="mt-5 bg-[#0b1120] border border-white/5 rounded-xl p-4">

                                        <p className="text-xs text-gray-500 mb-2">
                                            Menu URL
                                        </p>

                                        <p className="text-xs sm:text-sm text-gray-300 break-all leading-relaxed">
                                            {qrMenuUrl}
                                        </p>

                                    </div>

                                    <button
                                        onClick={downloadQr}
                                        className="w-full mt-5 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold"
                                    >
                                        Download QR
                                    </button>

                                </>

                            ) : (

                                <div className="py-16 text-center text-gray-400">
                                    QR code could not be generated.
                                </div>

                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}
