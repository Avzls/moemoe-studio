"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Plus,
  Loader2,
  ImageIcon,
  X,
} from "lucide-react";
import Image from "next/image";

interface PhotoRecord {
  id: string;
  title: string;
  category: string;
  image_url: string;
  width: number;
  height: number;
  sort_order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [categories, setCategories] = useState<Category[]>([]);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("");

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/photos");
      if (res.ok) {
        const data = await res.json();
        setPhotos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
    // Fetch categories
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        if (data.length > 0 && !uploadCategory) setUploadCategory(data[0].name);
      })
      .catch(console.error);
  }, [fetchPhotos]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));

    // Auto-set title from filename
    if (!uploadTitle) {
      const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setUploadTitle(name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  // Upload photo
  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) return;

    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. Upload file to Supabase Storage
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("bucket", "photos");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        setMessage({ type: "error", text: "Gagal upload file" });
        return;
      }

      const uploadData = await uploadRes.json();

      // 2. Save photo metadata to DB
      const metaRes = await fetch("/api/admin/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle,
          category: uploadCategory,
          image_url: uploadData.url,
          width: 1600,
          height: 1200,
        }),
      });

      if (!metaRes.ok) {
        setMessage({ type: "error", text: "Gagal menyimpan data foto" });
        return;
      }

      setMessage({ type: "success", text: "Foto berhasil diupload!" });

      // Reset form
      setUploadFile(null);
      setUploadPreview(null);
      setUploadTitle("");
      setUploadCategory("Alam");
      setShowUpload(false);

      // Refresh photos
      fetchPhotos();
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat upload" });
    } finally {
      setUploading(false);
    }
  };

  // Delete photo
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/photos?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        setMessage({ type: "success", text: "Foto berhasil dihapus!" });
      } else {
        setMessage({ type: "error", text: "Gagal menghapus foto" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Foto</h1>
          <p className="text-gray-400 text-sm mt-1">
            Upload dan kelola foto gallery
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gallery-btn text-white text-sm font-medium"
        >
          {showUpload ? <X size={18} /> : <Plus size={18} />}
          {showUpload ? "Tutup" : "Upload Foto"}
        </button>
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

      {/* Upload Form */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            className="bg-card border border-border rounded-2xl p-6 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Upload Foto Baru
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div>
                {uploadPreview ? (
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-background">
                    <Image
                      src={uploadPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => {
                        setUploadFile(null);
                        setUploadPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-accent/40 cursor-pointer transition-colors bg-background">
                    <Upload size={32} className="text-gray-500 mb-3" />
                    <span className="text-gray-400 text-sm">
                      Klik untuk pilih foto
                    </span>
                    <span className="text-gray-500 text-xs mt-1">
                      JPG, PNG, WebP
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Judul Foto
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Pegunungan Berkabut"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kategori
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || !uploadTitle || uploading}
                  className="w-full gallery-btn py-3 rounded-xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                  {uploading ? "Uploading..." : "Upload Foto"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photos Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-accent animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">Belum ada foto yang diupload</p>
          <p className="text-gray-500 text-sm mt-1">
            Klik &quot;Upload Foto&quot; untuk menambahkan
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Image
                src={photo.image_url}
                alt={photo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center">
                <p className="text-white text-sm font-medium mb-1 px-2 text-center">
                  {photo.title}
                </p>
                <span className="text-accent text-xs">{photo.category}</span>

                <button
                  onClick={() => handleDelete(photo.id)}
                  disabled={deleting === photo.id}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/40 transition-colors flex items-center gap-1"
                >
                  {deleting === photo.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Hapus
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
