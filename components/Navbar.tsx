"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Role = "ADMIN" | "SUPER_ADMIN";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [role, setRole] = useState<Role | null>(null);

    // =====================================================
    // GET CURRENT USER ROLE
    // =====================================================

    useEffect(() => {
        async function getCurrentUser() {
            try {
                const response = await api.get("/auth/me");

                const userRole: Role =
                    response.data.user?.role ||
                    response.data.role;

                setRole(userRole);

                // ADMIN, SUPER ADMIN sayfasına girmeye çalışırsa
                if (
                    userRole === "ADMIN" &&
                    pathname.startsWith("/business")
                ) {
                    router.replace("/dashboard");
                }
            } catch (error) {
                console.error(
                    "Failed to get current user:",
                    error
                );
            }
        }

        getCurrentUser();
    }, [pathname, router]);

    // =====================================================
    // PAGE NAME
    // =====================================================

    let pageName = "MenuM";

    if (pathname.includes("/dashboard")) {
        pageName = "Dashboard";
    } else if (pathname.includes("/business")) {
        pageName = "Business";
    } else if (pathname.includes("/categories")) {
        pageName = "Categories";
    } else if (pathname.includes("/products")) {
        pageName = "Products";
    } else if (pathname.includes("/settings")) {
        pageName = "Settings";
    }

    // =====================================================
    // LOGOUT
    // =====================================================

    async function handleLogout() {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );
        } finally {
            localStorage.removeItem("token");
            router.replace("/login");
        }
    }

    return (
        <header className="h-[74px] bg-[#111827] border-b border-white/10 flex items-center justify-between px-8">

            {/* LEFT */}
            <div>

                <h1 className="text-xl font-bold text-white">
                    {pageName}
                </h1>

                <div className="flex items-center gap-2 mt-0.5">

                    <p className="text-sm text-gray-400">
                        Welcome back 👋
                    </p>

                    {role && (
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
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

            {/* RIGHT */}
            <button
                onClick={handleLogout}
                className="border border-red-500/40 text-red-400 px-5 py-2 rounded-lg hover:bg-red-500/10 transition"
            >
                Logout
            </button>

        </header>
    );
}