"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { api } from "@/lib/api";

type Category = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isVisible: boolean;
    category?: Category;
};

type FormMode = "create" | "edit" | null;

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [modal, setModal] = useState<FormMode>(null);
    const [editingProduct, setEditingProduct] =
        useState<Product | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setPageLoading(true);

            await Promise.all([
                loadProducts(),
                loadCategories(),
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setPageLoading(false);
        }
    }

    async function loadProducts() {
        try {
            const response = await api.get("/products");

            setProducts(response.data.products);
        } catch (error) {
            console.error("Failed to load products:", error);
        }
    }

    async function loadCategories() {
        try {
            const response = await api.get("/categories");

            setCategories(response.data.categories);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    }

    function resetForm() {
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setImage(null);
    }

    function openCreateModal() {
        resetForm();
        setEditingProduct(null);
        setModal("create");
    }

    function openEditModal(product: Product) {
        setEditingProduct(product);

        setName(product.name);
        setDescription(product.description || "");
        setPrice(String(product.price));

        setCategoryId(
            product.category?.id
                ? String(product.category.id)
                : ""
        );

        setImage(null);
        setModal("edit");
    }

    function closeModal() {
        setModal(null);
        setEditingProduct(null);
        resetForm();
    }

    function handleImageChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            setImage(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5MB.");
            return;
        }

        setImage(file);
    }

    async function uploadImage(productId: number) {
        if (!image) return;

        const formData = new FormData();

        formData.append("image", image);

        await api.post(
            `/products/${productId}/image`,
            formData
        );
    }

    async function handleCreate() {
        if (!name.trim() || !price || !categoryId) {
            alert(
                "Product name, price and category are required."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                `/products/${categoryId}`,
                {
                    name: name.trim(),
                    description: description.trim(),
                    price: Number(price),
                }
            );

            const createdProduct = response.data.product;

            if (image) {
                await uploadImage(createdProduct.id);
            }

            closeModal();
            await loadProducts();
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to create product."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate() {
        if (!editingProduct) return;

        if (!name.trim() || !price) {
            alert("Product name and price are required.");
            return;
        }

        try {
            setLoading(true);

            await api.put(
                `/products/${editingProduct.id}`,
                {
                    name: name.trim(),
                    description: description.trim(),
                    price: Number(price),
                }
            );

            if (image) {
                await uploadImage(editingProduct.id);
            }

            closeModal();
            await loadProducts();
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to update product."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);

            await api.delete(`/products/${id}`);

            await loadProducts();
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to delete product."
            );
        } finally {
            setLoading(false);
        }
    }

    async function toggleVisibility(product: Product) {
        try {
            await api.put(
                `/products/${product.id}`,
                {
                    isVisible: !product.isVisible,
                }
            );

            await loadProducts();
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to update visibility."
            );
        }
    }

    const visibleProducts = products.filter(
        (product) => product.isVisible
    ).length;

    return (
        <div className="text-white">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Products
                    </h1>

                    <p className="text-gray-400 mt-1">
                        Manage your menu products
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-600/20"
                >
                    + Add Product
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm">
                        Total Products
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {products.length}
                    </p>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm">
                        Categories
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {categories.length}
                    </p>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
                    <p className="text-gray-400 text-sm">
                        Visible Products
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {visibleProducts}
                    </p>
                </div>

            </div>

            {/* LOADING */}
            {pageLoading ? (

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-16 text-center">
                    <p className="text-gray-400">
                        Loading products...
                    </p>
                </div>

            ) : products.length === 0 ? (

                /* EMPTY STATE */
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-16 text-center">

                    <div className="text-5xl mb-4">
                        🍽️
                    </div>

                    <h2 className="text-xl font-semibold">
                        No products yet
                    </h2>

                    <p className="text-gray-400 mt-2 mb-6">
                        Start building your menu by adding your
                        first product.
                    </p>

                    <button
                        onClick={openCreateModal}
                        className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-semibold transition"
                    >
                        + Add Your First Product
                    </button>

                </div>

            ) : (

                /* PRODUCTS */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {products.map((product) => (

                        <div
                            key={product.id}
                            className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition"
                        >

                            {/* IMAGE */}
                            <div className="h-48 bg-[#0b1120] relative">

                                {product.imageUrl ? (

                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />

                                ) : (

                                    <div className="w-full h-full flex items-center justify-center text-5xl">
                                        🍽️
                                    </div>

                                )}

                                {/* CATEGORY */}
                                {product.category && (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-black/70 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
                                            {product.category.name}
                                        </span>
                                    </div>
                                )}

                                {/* VISIBILITY */}
                                <button
                                    onClick={() =>
                                        toggleVisibility(product)
                                    }
                                    className={`absolute top-3 right-3 text-xs px-3 py-1.5 rounded-full backdrop-blur transition ${
                                        product.isVisible
                                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                    }`}
                                >
                                    {product.isVisible
                                        ? "● Visible"
                                        : "● Hidden"}
                                </button>

                            </div>

                            {/* CONTENT */}
                            <div className="p-5">

                                <div className="flex justify-between gap-4">

                                    <div className="min-w-0">

                                        <h2 className="font-bold text-lg truncate">
                                            {product.name}
                                        </h2>

                                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                            {product.description ||
                                                "No description"}
                                        </p>

                                    </div>

                                    <span className="text-blue-400 font-bold whitespace-nowrap">
                                        ₺
                                        {Number(
                                            product.price
                                        ).toFixed(2)}
                                    </span>

                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-2 mt-5">

                                    <button
                                        onClick={() =>
                                            openEditModal(product)
                                        }
                                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-lg text-sm font-medium transition"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                product.id
                                            )
                                        }
                                        disabled={loading}
                                        className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* MODAL */}
            {modal && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !loading
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl shadow-2xl">

                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">

                            <div>
                                <h2 className="text-xl font-bold">
                                    {modal === "create"
                                        ? "Add Product"
                                        : "Edit Product"}
                                </h2>

                                <p className="text-gray-400 text-sm mt-1">
                                    {modal === "create"
                                        ? "Add a new item to your menu"
                                        : "Update product information"}
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                disabled={loading}
                                className="text-gray-400 hover:text-white text-xl disabled:opacity-50"
                            >
                                ✕
                            </button>

                        </div>

                        {/* FORM */}
                        <div className="p-6 space-y-4">

                            {/* NAME */}
                            <div>
                                <label className="text-sm text-gray-400">
                                    Product Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="e.g. Classic Burger"
                                    className="w-full mt-1 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* PRICE */}
                            <div>
                                <label className="text-sm text-gray-400">
                                    Price
                                </label>

                                <input
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full mt-1 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* CATEGORY */}
                            {modal === "create" && (
                                <div>
                                    <label className="text-sm text-gray-400">
                                        Category
                                    </label>

                                    <select
                                        value={categoryId}
                                        onChange={(e) =>
                                            setCategoryId(
                                                e.target.value
                                            )
                                        }
                                        className="w-full mt-1 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    >
                                        <option value="">
                                            Select category
                                        </option>

                                        {categories.map(
                                            (category) => (
                                                <option
                                                    key={
                                                        category.id
                                                    }
                                                    value={
                                                        category.id
                                                    }
                                                >
                                                    {category.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            )}

                            {/* DESCRIPTION */}
                            <div>
                                <label className="text-sm text-gray-400">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe your product..."
                                    rows={3}
                                    className="w-full mt-1 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* IMAGE */}
                            <div>
                                <label className="text-sm text-gray-400">
                                    Product Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full mt-1 text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-500"
                                />

                                <p className="text-xs text-gray-500 mt-2">
                                    Maximum size: 5MB
                                </p>

                                {image && (
                                    <p className="text-xs text-blue-400 mt-1">
                                        Selected: {image.name}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* FOOTER */}
                        <div className="flex gap-3 p-6 border-t border-white/10">

                            <button
                                onClick={closeModal}
                                disabled={loading}
                                className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl transition disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    modal === "create"
                                        ? handleCreate
                                        : handleUpdate
                                }
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                            >
                                {loading
                                    ? modal === "create"
                                        ? "Creating..."
                                        : "Saving..."
                                    : modal === "create"
                                    ? "Create Product"
                                    : "Save Changes"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}