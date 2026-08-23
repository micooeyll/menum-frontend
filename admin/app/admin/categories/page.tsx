"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Category = {
    id: number;
    name: string;
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);

    const [name, setName] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [editingCategory, setEditingCategory] =
        useState<Category | null>(null);

    const [editingName, setEditingName] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const response = await api.get("/categories");

            setCategories(response.data.categories);
        } catch (error) {
            console.error("Categories error:", error);
        }
    }

    function openAddModal() {
        setName("");
        setShowAddModal(true);
    }

    function closeAddModal() {
        setName("");
        setShowAddModal(false);
    }

    async function handleCreate() {
        if (!name.trim()) {
            alert("Category name is required.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/categories", {
                name: name.trim(),
            });

            closeAddModal();

            await loadCategories();
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to create category."
            );
        } finally {
            setLoading(false);
        }
    }

    function openEditModal(category: Category) {
        setEditingCategory(category);
        setEditingName(category.name);
    }

    function closeEditModal() {
        setEditingCategory(null);
        setEditingName("");
    }

    async function handleUpdate() {
        if (!editingCategory) return;

        if (!editingName.trim()) {
            alert("Category name is required.");
            return;
        }

        try {
            setLoading(true);

            await api.put(
                `/categories/${editingCategory.id}`,
                {
                    name: editingName.trim(),
                }
            );

            closeEditModal();

            await loadCategories();
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to update category."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);

            await api.delete(`/categories/${id}`);

            await loadCategories();
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to delete category."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen text-white">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Categories
                    </h1>

                    <p className="text-gray-400 mt-1">
                        Organize your menu into categories
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-500 transition px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                    + Add Category
                </button>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-gray-400 text-sm">
                                Total Categories
                            </p>

                            <p className="text-4xl font-bold mt-2">
                                {categories.length}
                            </p>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl">
                            📂
                        </div>

                    </div>

                </div>

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-gray-400 text-sm">
                                Menu Structure
                            </p>

                            <p className="text-lg font-semibold mt-3">
                                {categories.length === 0
                                    ? "No categories created"
                                    : `${categories.length} ${
                                          categories.length === 1
                                              ? "category"
                                              : "categories"
                                      } ready`}
                            </p>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl">
                            🗂️
                        </div>

                    </div>

                </div>

            </div>

            {/* CATEGORY LIST */}
            {categories.length === 0 ? (

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-16 text-center">

                    <div className="text-5xl mb-4">
                        📂
                    </div>

                    <h2 className="text-xl font-semibold">
                        No categories yet
                    </h2>

                    <p className="text-gray-400 mt-2 mb-6">
                        Create your first category to organize your menu.
                    </p>

                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold"
                    >
                        + Create Category
                    </button>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {categories.map((category, index) => (

                        <div
                            key={category.id}
                            className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl font-bold">
                                        {index + 1}
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-lg">
                                            {category.name}
                                        </h2>

                                        <p className="text-gray-500 text-sm mt-1">
                                            Category #{category.id}
                                        </p>
                                    </div>

                                </div>

                                <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-400">
                                    Active
                                </span>

                            </div>

                            <div className="flex gap-2 mt-6">

                                <button
                                    onClick={() =>
                                        openEditModal(category)
                                    }
                                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-lg text-sm font-medium transition"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(category.id)
                                    }
                                    disabled={loading}
                                    className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* ADD MODAL */}
            {showAddModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

                    <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl shadow-2xl">

                        <div className="flex items-center justify-between p-6 border-b border-white/10">

                            <div>
                                <h2 className="text-xl font-bold">
                                    Add Category
                                </h2>

                                <p className="text-gray-400 text-sm mt-1">
                                    Create a new menu category
                                </p>
                            </div>

                            <button
                                onClick={closeAddModal}
                                className="text-gray-400 hover:text-white text-xl"
                            >
                                ✕
                            </button>

                        </div>

                        <div className="p-6">

                            <label className="text-sm text-gray-400">
                                Category name
                            </label>

                            <input
                                autoFocus
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreate();
                                    }
                                }}
                                placeholder="e.g. Main Courses"
                                className="w-full mt-2 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                            />

                        </div>

                        <div className="flex gap-3 p-6 border-t border-white/10">

                            <button
                                onClick={closeAddModal}
                                className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold disabled:opacity-50"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Category"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* EDIT MODAL */}
            {editingCategory && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

                    <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl shadow-2xl">

                        <div className="flex items-center justify-between p-6 border-b border-white/10">

                            <div>
                                <h2 className="text-xl font-bold">
                                    Edit Category
                                </h2>

                                <p className="text-gray-400 text-sm mt-1">
                                    Update category information
                                </p>
                            </div>

                            <button
                                onClick={closeEditModal}
                                className="text-gray-400 hover:text-white text-xl"
                            >
                                ✕
                            </button>

                        </div>

                        <div className="p-6">

                            <label className="text-sm text-gray-400">
                                Category name
                            </label>

                            <input
                                autoFocus
                                value={editingName}
                                onChange={(e) =>
                                    setEditingName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUpdate();
                                    }
                                }}
                                className="w-full mt-2 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                            />

                        </div>

                        <div className="flex gap-3 p-6 border-t border-white/10">

                            <button
                                onClick={closeEditModal}
                                className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold disabled:opacity-50"
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}