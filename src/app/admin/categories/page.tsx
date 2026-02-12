"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async () => {
    if (!newName.trim()) return;

    setAdding(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (res.ok) {
        setNewName("");
        setMessage({ type: "success", text: "Kategori berhasil ditambahkan!" });
        fetchCategories();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Gagal menambahkan kategori" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus kategori "${name}"?`)) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setMessage({ type: "success", text: `Kategori "${name}" berhasil dihapus!` });
      } else {
        setMessage({ type: "error", text: "Gagal menghapus kategori" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Kelola Kategori</h1>
        <p className="text-gray-400 text-sm mt-1">
          Tambah atau hapus kategori foto
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          className={`mb-6 px-4 py-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message.text}
        </motion.div>
      )}

      {/* Add Category */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Tambah Kategori Baru
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            placeholder='Contoh: "Makro", "Street", "Portrait"'
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim() || adding}
            className="gallery-btn px-4 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {adding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Tambah
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-gray-300">
            Daftar Kategori ({categories.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="text-accent animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <Tag size={32} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">Belum ada kategori</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Tag size={14} className="text-accent" />
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium">
                      {cat.name}
                    </span>
                    <span className="text-gray-500 text-xs ml-2">
                      /{cat.slug}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={deleting === cat.id}
                  className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                >
                  {deleting === cat.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
