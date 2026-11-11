
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  
  
    async function handleImageUpload(e) {
      const file = e.target.files?.[0];

      // Allow selecting the same file again
      e.target.value = "";

      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError("Please select JPG, PNG or WEBP.");
        return;
      }

      // Maximum image size: 5 MB
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image must be smaller than 5 MB.");
        return;
      }

      setUploading(true);
      setUploadError("");

      try {
        const cloudName =
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const uploadPreset =
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
          throw new Error(
            "Cloudinary configuration is missing."
          );
        }

        const uploadData = new FormData();

        uploadData.append("file", file);
        uploadData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: uploadData,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message || "Image upload failed."
          );
        }

        if (!result.secure_url) {
          throw new Error("Cloudinary did not return an image URL.");
        }

        setForm((prev) => ({
          ...prev,
          image: result.secure_url,
        }));

        alert("Product photograph uploaded successfully!");

      } catch (error) {
        console.error("Cloudinary upload error:", error);

        setUploadError(
          error.message || "Unable to upload photograph."
        );

      } finally {
        setUploading(false);
      }
    }


  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  
    if (uploading) {
    alert("Please wait for the image upload to finish.");
    return;
  }

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

  try {
    if (editingId) {
      await editProduct(editingId, product);
      alert("Product updated successfully!");
    } else {
      await addProduct(product);
      alert("Product added successfully!");
    }

    setForm(emptyForm);
    setEditingId(null);
  } catch (error) {
    console.error(error);
    alert("Unable to save product. Please try again.");
  }
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

  async function handleDelete(id) {
  if (window.confirm("Are you sure you want to delete this product?")) {
    try {
      await deleteProduct(id);
      alert("Product deleted successfully!");
    } catch (error) {
      alert("Unable to delete product.");
    }
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
          {uploading && (
              <p className="mt-3 text-sm font-semibold text-[#536b50]">
                Uploading photograph to Cloudinary... Please wait.
              </p>
            )}

            {uploadError && (
              <p className="mt-3 text-sm text-red-600">
                {uploadError}
              </p>
            )}

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
              disabled={uploading}
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
            disabled={uploading}
            className="rounded-lg bg-[#536b50] px-6 py-3 text-white hover:bg-[#3e543b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading Image..."
              : editingId
              ? "Update Product"
              : "Add Product"}
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
