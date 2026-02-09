"use client";

import { motion } from "framer-motion";
import { Camera, Image, MessageCircle, MapPin } from "lucide-react";

const links = [
  {
    id: "gallery",
    title: "Lihat Gallery Foto HD",
    subtitle: "Koleksi foto alam berkualitas tinggi",
    href: "/gallery",
    icon: Image,
    gradient: "from-purple-600 to-purple-800",
    external: false,
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    subtitle: "Chat langsung dengan kami",
    href: "https://wa.me/6281911205501?text=Halo%20Moemoe%20Studio!%20Saya%20tertarik%20dengan%20koleksi%20foto%20alam%20Anda.",
    icon: MessageCircle,
    gradient: "from-green-500 to-green-700",
    external: true,
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
    transition: { duration: 0.4, ease: "easeOut" as const }
  },
};

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 animated-bg">
      {/* Profile Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* Name */}
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Moemoe Studio
        </motion.h1>

        {/* Location */}
        <motion.div
          className="flex items-center justify-center gap-1 text-gray-400 text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MapPin size={14} />
          <span>Indonesia</span>
        </motion.div>

        {/* Bio */}
        <motion.p
          className="text-gray-300 text-sm max-w-xs mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Nature Photography • Keindahan Alam dalam Setiap Frame ✨
        </motion.p>
      </motion.div>

      {/* Links Section */}
      <motion.div
        className="w-full max-w-md space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {links.map((link) => {
          const Icon = link.icon;
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center flex-shrink-0`}>
                <Icon size={24} className="text-white" />
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold text-base group-hover:text-accent transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {link.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <motion.div
                className="text-gray-500 group-hover:text-accent transition-colors"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
          © 2024 Moemoe Studio
        </p>
      </motion.footer>
    </div>
  );
}
