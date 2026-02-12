"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Camera, User } from "lucide-react";
import BioModal from "@/components/BioModal";

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

export default function Header() {
  const [showBio, setShowBio] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Kembali</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-900 flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-white to-accent-light bg-clip-text text-transparent">
              {profile?.name || "Moemoe Cipluk"}
            </span>
          </Link>

          <button
            onClick={() => setShowBio(true)}
            className="gallery-btn px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2"
          >
            <User size={16} />
            <span className="hidden sm:inline">Biodata</span>
          </button>
        </div>
      </motion.header>

      <BioModal
        isOpen={showBio}
        onClose={() => setShowBio(false)}
        profile={profile}
      />
    </>
  );
}
