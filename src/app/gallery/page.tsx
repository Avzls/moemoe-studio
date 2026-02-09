"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import Lightbox from "@/components/Lightbox";

interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
}

const CATEGORIES = ["Semua", "Gunung", "Pantai", "Hutan", "Sunset"];

// Grid pattern that repeats - matching the reference design
// Each number represents: 1=small, 2=medium, 3=large/tall, 4=wide
const GRID_PATTERN = [
  { col: "col-span-1 md:col-span-2", row: "row-span-1 md:row-span-2" },  // 0: Large left
  { col: "col-span-1", row: "row-span-1" },                              // 1: Medium
  { col: "col-span-1", row: "row-span-1 md:row-span-2" },               // 2: Tall right
  { col: "col-span-1", row: "row-span-1" },                              // 3: Medium
  { col: "col-span-1 md:col-span-2", row: "row-span-1" },               // 4: Wide
  { col: "col-span-1", row: "row-span-1 md:row-span-2" },               // 5: Tall center
  { col: "col-span-1", row: "row-span-1" },                              // 6: Medium
  { col: "col-span-1", row: "row-span-1" },                              // 7: Small
  { col: "col-span-1", row: "row-span-1" },                              // 8: Medium
];

function getGridClasses(index: number): string {
  const pattern = GRID_PATTERN[index % GRID_PATTERN.length];
  return `${pattern.col} ${pattern.row}`;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos");
        const data = await response.json();
        setPhotos(data.photos);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "Semua") return photos;
    return photos.filter((photo) => photo.category === activeCategory);
  }, [photos, activeCategory]);

  const handlePhotoClick = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleNavigate = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="py-8 md:py-12 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Koleksi Terbaru
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-accent bg-clip-text text-transparent">
              Galeri Foto Alam
            </span>
          </motion.h1>
          
          <motion.p
            className="text-gray-400 max-w-xl mx-auto mb-8 text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Jelajahi keindahan alam Indonesia dalam resolusi HD
          </motion.p>
          
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        {/* Gallery Grid - Bento Style */}
        <section className="container mx-auto px-4 pb-16">
          <AnimatePresence mode="wait">
            {loading ? (
              <div key="skeleton" className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`skeleton rounded-2xl md:rounded-3xl ${getGridClasses(i)}`}
                    style={{ minHeight: "200px" }}
                  />
                ))}
              </div>
            ) : filteredPhotos.length === 0 ? (
              <motion.div
                key="empty"
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-card flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg">
                  Tidak ada foto dalam kategori ini
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer ${getGridClasses(index)}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03, duration: 0.4 }}
                    onClick={() => handlePhotoClick(photo)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-accent text-xs font-semibold uppercase tracking-wider">
                        {photo.category}
                      </span>
                      <h3 className="text-white font-semibold text-sm md:text-base mt-1">
                        {photo.alt}
                      </h3>
                    </div>
                    
                    {/* Zoom Icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Photo Count */}
        {!loading && filteredPhotos.length > 0 && (
          <motion.div
            className="text-center pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-gray-400 text-sm">
              {filteredPhotos.length} foto
              {activeCategory !== "Semua" && ` • ${activeCategory}`}
            </span>
          </motion.div>
        )}
      </main>

      {/* Lightbox */}
      <Lightbox
        photo={selectedPhoto}
        photos={filteredPhotos}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigate}
      />

      {/* Footer CTA */}
      <footer className="relative overflow-hidden border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-10 text-center">
          <h3 className="text-xl font-bold text-white mb-3">
            Tertarik dengan foto-foto ini?
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            Hubungi kami untuk pembelian atau kerjasama
          </p>
          <a
            href="https://wa.me/6281911205501?text=Halo%20Moemoe%20Studio!%20Saya%20tertarik%20dengan%20koleksi%20foto%20alam%20Anda."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat via WhatsApp
          </a>
        </div>
      </footer>
    </>
  );
}
