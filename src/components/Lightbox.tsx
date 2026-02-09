"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from "lucide-react";

interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
}

interface LightboxProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

export default function Lightbox({ photo, photos, onClose, onNavigate }: LightboxProps) {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      onNavigate(photos[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, photos, onNavigate]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      onNavigate(photos[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, photos, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    if (photo) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [photo, goToPrev, goToNext, onClose]);

  const handleDownload = async () => {
    if (!photo) return;
    
    try {
      const response = await fetch(photo.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `moemoe-studio-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Photo counter */}
          <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
            {currentIndex + 1} / {photos.length}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            <button
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 px-4"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              aria-label="Download"
            >
              <Download size={18} className="text-white" />
              <span className="text-white text-sm hidden sm:inline">Download</span>
            </button>
          </div>

          {/* Navigation - Previous */}
          {hasPrev && (
            <button
              className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
          )}

          {/* Navigation - Next */}
          {hasNext && (
            <button
              className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={32} className="text-white" />
            </button>
          )}

          {/* Image container */}
          <motion.div
            key={photo.id}
            className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              priority
            />
          </motion.div>

          {/* Photo info */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-white font-medium mb-1">{photo.alt}</p>
            <span className="text-accent text-sm uppercase tracking-wider">
              {photo.category}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
