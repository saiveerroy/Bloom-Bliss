
import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";

export default function ManageProducts() {
  const {
    products,
    addProduct,
    editProduct,
    deleteProduct,
  } = useInventory();

  const emptyForm = {
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    tag: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  // Convert uploaded image to compressed JPEG
  function handleImageUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;

        let width = img.width;
        let height = img.height;

        const scale = Math.min(
          MAX_WIDTH / width,
          MAX_HEIGHT / height,
          1
        );

        width = Math.round(width * scale);
        height = Math.round(height * scale);

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        const imageData = canvas.toDataURL(
          "image/jpeg",
          0.88
        );

        setForm((prev) => ({
          ...prev,
          image: imageData,
        }));
      };

      img.onerror = () => {
        alert("Unable to read this image.");
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);

    // Allow selecting the same file again
    e.target.value = "";
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const product = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (
      !product.name.trim() ||
      !product.category.trim() ||
      !Number.isFinite(product.price) ||
      product.price <= 0 ||
      !Number.isInteger(product.stock) ||
      product.stock < 0 ||
      !product.image
    ) {
      alert("Please enter valid product details.");
      return;
    }

    if (editingId) {
      editProduct(editingId, product);
      alert("Product updated successfully!");
    } else {
      addProduct(product);
      alert("New product added successfully!");
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      tag: product.tag || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(id) {
    if (
      window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      deleteProduct(id);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] p-5 sm:p-8">

      <h1 className="mb-2 text-3xl font-bold">
        Manage Products 🌸
      </h1>

      <p className="mb-8 text-sm text-gray-500">
        Upload beautiful product photographs and manage
        your flower shop inventory.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-2xl border bg-white p-6 shadow-sm"
      >

        <h2 className="mb-6 text-xl font-bold">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="rounded-lg border p-3"
            required
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="rounded-lg border p-3"
            required
          />

          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (₹)"
            className="rounded-lg border p-3"
            required
          />

          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            placeholder="Available Stock"
            className="rounded-lg border p-3"
            required
          />

          <input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Tag (Bestseller, New, Popular)"
            className="rounded-lg border p-3 sm:col-span-2"
          />

        </div>

        {/* IMAGE UPLOAD */}

        <div className="mt-6">

          <label className="mb-3 block font-semibold">
            Upload Product Photograph 🌷
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#536b50] bg-[#f8f5ef] p-8 text-center hover:bg-[#f1eee5]">

            <span className="text-4xl">📸</span>

            <span className="mt-3 font-semibold">
              Select a photograph from your computer
            </span>

            <span className="mt-2 text-xs text-gray-500">
              JPG, PNG, WEBP supported
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />

          </label>

          {/* IMAGE PREVIEW */}

          {form.image && (
            <div className="mt-6">

              <p className="mb-3 font-semibold">
                Photograph Preview
              </p>

              <img
                src={form.image}
                alt="Product preview"
                className="h-72 w-full max-w-md rounded-xl object-cover shadow-md"
              />

              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    image: "",
                  }))
                }
                className="mt-3 text-sm text-red-600 underline"
              >
                Remove Photograph
              </button>

            </div>
          )}

        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          <button
            type="submit"
            className="rounded-lg bg-[#536b50] px-6 py-3 text-white hover:bg-[#3e543b]"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
              }}
              className="rounded-lg bg-gray-200 px-6 py-3"
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      {/* EXISTING PRODUCTS */}

      <h2 className="mb-5 text-xl font-bold">
        Existing Products ({products.length})
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          >

            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full object-cover"
            />

            <div className="p-5">

              <h3 className="text-lg font-bold">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500">
                {product.category}
              </p>

              <p className="mt-3 font-semibold">
                Price: ₹{product.price}
              </p>

              <p className="mt-1 text-sm">
                Stock: {product.stock}
              </p>

              <div className="mt-5 flex gap-2">

                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="flex-1 rounded-lg bg-[#536b50] py-2 text-white"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-white"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
