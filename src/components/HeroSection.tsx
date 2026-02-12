"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image, MapPin } from "lucide-react";
import NextImage from "next/image";

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

const socialIcons: Record<string, { icon: string; gradient: string }> = {
  whatsapp: { icon: "💬", gradient: "from-green-500 to-green-700" },
  instagram: { icon: "📸", gradient: "from-pink-500 to-purple-600" },
  tiktok: { icon: "🎵", gradient: "from-gray-800 to-gray-950" },
  youtube: { icon: "🎬", gradient: "from-red-500 to-red-700" },
  email: { icon: "✉️", gradient: "from-blue-500 to-blue-700" },
  website: { icon: "🌐", gradient: "from-cyan-500 to-cyan-700" },
  github: { icon: "💻", gradient: "from-gray-600 to-gray-800" },
  twitter: { icon: "🐦", gradient: "from-sky-400 to-sky-600" },
};

const links = [
  {
    id: "gallery",
    title: "Gallery Moemoe Cipluk",
    subtitle: "Koleksi foto",
    href: "/gallery",
    icon: Image,
    gradient: "from-purple-600 to-purple-800",
    external: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function HeroSection() {
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

  // Build dynamic links from social_links
  const dynamicLinks = [
    ...links,
    ...(profile?.social_links || []).map((link, i) => ({
      id: `social-${i}`,
      title: link.label || link.type,
      subtitle: link.type === "whatsapp" ? "Chat langsung" : link.url.replace(/https?:\/\//, "").split("/")[0],
      href: link.url,
      icon: null,
      emoji: socialIcons[link.type]?.icon || "🔗",
      gradient: socialIcons[link.type]?.gradient || "from-gray-600 to-gray-800",
      external: true,
    })),
  ];

  const displayName = profile?.name || "Moemoe Cipluk";
  const displayBio = profile?.bio || "Nature Photography • Keindahan Alam dalam Setiap Frame ✨";
  const displayLocation = profile?.location || "Indonesia";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 animated-bg">
      {/* Profile Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Avatar */}
        {profile?.avatar_url && (
          <motion.div
            className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-accent/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <NextImage
              src={profile.avatar_url}
              alt={displayName}
              fill
              className="object-cover"
            />
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {displayName}
        </motion.h1>

        {/* Location */}
        <motion.div
          className="flex items-center justify-center gap-1 text-gray-400 text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MapPin size={14} />
          <span>{displayLocation}</span>
        </motion.div>

        {/* Bio */}
        <motion.p
          className="text-gray-300 text-sm max-w-xs mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {displayBio}
        </motion.p>
      </motion.div>

      {/* Links Section */}
      <motion.div
        className="w-full max-w-md space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {dynamicLinks.map((link) => {
          const Icon = 'icon' in link && link.icon ? link.icon : null;
          return (
            <motion.a
              key={link.id}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="link-card group flex items-center gap-4 w-full p-4 rounded-2xl bg-card/80 border border-border hover:border-accent/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center flex-shrink-0`}
              >
                {Icon ? (
                  <Icon size={24} className="text-white" />
                ) : (
                  <span className="text-2xl">{'emoji' in link ? link.emoji : "🔗"}</span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold text-base group-hover:text-accent transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-400 text-sm">{link.subtitle}</p>
              </div>

              {/* Arrow */}
              <motion.div
                className="text-gray-500 group-hover:text-accent transition-colors"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </motion.a>
          );
        })}
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-6 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} {displayName}
        </p>
      </motion.footer>
    </div>
  );
}
