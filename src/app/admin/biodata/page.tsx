"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  UserCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";

interface SocialLink {
  type: string;
  url: string;
  label: string;
}

interface Profile {
  name: string;
  bio: string;
  location: string;
  avatar_url: string | null;
  social_links: SocialLink[];
}

const SOCIAL_TYPES = ["whatsapp", "instagram", "tiktok", "youtube", "email", "website", "github", "twitter"];

export default function BiodataPage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    bio: "",
    location: "",
    avatar_url: null,
    social_links: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || "",
            bio: data.bio || "",
            location: data.location || "",
            avatar_url: data.avatar_url || null,
            social_links: data.social_links || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Upload avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "avatars");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({ ...prev, avatar_url: data.url }));
        setMessage({ type: "success", text: "Avatar berhasil diupload!" });
      } else {
        setMessage({ type: "error", text: "Gagal upload avatar" });
      }
    } catch {
      setMessage({ type: "error", text: "Gagal upload avatar" });
    } finally {
      setUploading(false);
    }
  };

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Biodata berhasil disimpan!" });
      } else {
        setMessage({ type: "error", text: "Gagal menyimpan biodata" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  // Social link helpers
  const addSocialLink = () => {
    setProfile((prev) => ({
      ...prev,
      social_links: [
        ...prev.social_links,
        { type: "whatsapp", url: "", label: "" },
      ],
    }));
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      social_links: prev.social_links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const removeSocialLink = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Biodata</h1>
        <p className="text-gray-400 text-sm mt-1">
          Kelola informasi profil yang ditampilkan di website
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

      <div className="space-y-6">
        {/* Avatar */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Foto Profil
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-border flex items-center justify-center">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <UserCircle size={40} className="text-gray-500" />
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm cursor-pointer hover:bg-accent/20 transition-colors">
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploading ? "Uploading..." : "Upload Foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
              <p className="text-gray-500 text-xs mt-2">JPG, PNG. Max 2MB</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nama / Brand
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            placeholder="Moemoe Cipluk"
          />
        </div>

        {/* Bio */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors resize-none"
            rows={3}
            placeholder="Nature Photography • Keindahan Alam dalam Setiap Frame ✨"
          />
        </div>

        {/* Location */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lokasi
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            placeholder="Indonesia"
          />
        </div>

        {/* Social Links */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-300">
              Social Links
            </label>
            <button
              onClick={addSocialLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs hover:bg-accent/20 transition-colors"
            >
              <Plus size={14} />
              Tambah
            </button>
          </div>

          <div className="space-y-3">
            {profile.social_links.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-background rounded-xl p-3 border border-border"
              >
                <select
                  value={link.type}
                  onChange={(e) => updateSocialLink(index, "type", e.target.value)}
                  className="bg-card border border-border rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-accent min-w-[100px]"
                >
                  {SOCIAL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateSocialLink(index, "label", e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none min-w-0"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                  className="flex-[2] bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none min-w-0"
                  placeholder="URL"
                />
                <button
                  onClick={() => removeSocialLink(index)}
                  className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {profile.social_links.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                Belum ada social link. Klik &quot;Tambah&quot; untuk menambahkan.
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full gallery-btn py-3 rounded-xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {saving ? "Menyimpan..." : "Simpan Biodata"}
        </button>
      </div>
    </div>
  );
}
