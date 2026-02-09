"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PhotoCardProps {
  photo: {
    id: string;
    src: string;
    alt: string;
    category: string;
    width: number;
    height: number;
  };
  onClick: () => void;
  index: number;
  size?: "small" | "medium" | "large" | "featured";
}

export default function PhotoCard({ photo, onClick, index, size = "medium" }: PhotoCardProps) {
  // Determine card styling based on size
  const sizeClasses = {
    small: "aspect-square",
    medium: "aspect-[4/5]",
    large: "aspect-[3/4]",
    featured: "aspect-[16/10] md:col-span-2 md:row-span-2",
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-3xl bg-card cursor-pointer ${sizeClasses[size]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>
      
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <motion.span 
          className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0"
        >
          {photo.category}
        </motion.span>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <h3 className="text-white font-semibold text-lg mb-1 drop-shadow-lg">
          {photo.alt}
        </h3>
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Lihat Detail</span>
        </div>
      </div>
      
      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent/80 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>

      {/* Subtle Watermark */}
      <div className="absolute bottom-4 right-4 text-white/20 text-xs font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Moemoe
      </div>
    </motion.div>
  );
}
