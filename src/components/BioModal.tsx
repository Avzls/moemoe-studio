"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";

interface SocialLink {
  type: string;
  url: string;
  label: string;
}

interface BioModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    bio: string;
    location: string;
    avatar_url: string | null;
    social_links: SocialLink[];
  } | null;
}

const socialIcons: Record<string, string> = {
  whatsapp: "💬",
  instagram: "📸",
  tiktok: "🎵",
  youtube: "🎬",
  email: "✉️",
  website: "🌐",
  github: "💻",
  twitter: "🐦",
};

export default function BioModal({ isOpen, onClose, profile }: BioModalProps) {
  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm bg-card/95 backdrop-blur-xl border border-border rounded-3xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>

            {/* Header gradient */}
            <div className="h-24 bg-gradient-to-br from-accent/30 via-purple-600/20 to-transparent" />

            {/* Profile Content */}
            <div className="px-6 pb-6 -mt-12">
              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-card bg-border mb-4">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent to-purple-900 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-white text-center">
                {profile.name}
              </h2>

              {/* Location */}
              {profile.location && (
                <div className="flex items-center justify-center gap-1 text-gray-400 text-sm mt-1">
                  <MapPin size={12} />
                  <span>{profile.location}</span>
                </div>
              )}

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-300 text-sm text-center mt-3 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Social Links */}
              {profile.social_links.length > 0 && (
                <div className="mt-5 space-y-2">
                  {profile.social_links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent/30 hover:bg-white/10 transition-all duration-200 group"
                    >
                      <span className="text-lg">
                        {socialIcons[link.type] || "🔗"}
                      </span>
                      <span className="flex-1 text-white text-sm font-medium">
                        {link.label || link.type}
                      </span>
                      <ExternalLink
                        size={14}
                        className="text-gray-500 group-hover:text-accent transition-colors"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
