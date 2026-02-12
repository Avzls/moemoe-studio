"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, UserCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [photoCount, setPhotoCount] = useState(0);
  const [profileUpdated, setProfileUpdated] = useState("");

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const [photosRes, profileRes] = await Promise.all([
          fetch("/api/admin/photos"),
          fetch("/api/profile"),
        ]);

        if (photosRes.ok) {
          const photos = await photosRes.json();
          setPhotoCount(Array.isArray(photos) ? photos.length : 0);
        }

        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile.updated_at) {
            setProfileUpdated(
              new Date(profile.updated_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      label: "Total Foto",
      value: photoCount,
      icon: ImageIcon,
      color: "from-blue-500 to-blue-700",
      href: "/admin/photos",
    },
    {
      label: "Profil",
      value: "Aktif",
      icon: UserCircle,
      color: "from-green-500 to-green-700",
      href: "/admin/biodata",
    },
    {
      label: "Terakhir Update",
      value: profileUpdated || "-",
      icon: Clock,
      color: "from-purple-500 to-purple-700",
      href: "/admin/biodata",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Selamat datang di Admin Panel Moemoe Cipluk
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={stat.href}
                className="block bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/biodata"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors"
          >
            <UserCircle size={20} />
            <span className="text-sm font-medium">Edit Biodata</span>
          </Link>
          <Link
            href="/admin/photos"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <ImageIcon size={20} />
            <span className="text-sm font-medium">Upload Foto</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
