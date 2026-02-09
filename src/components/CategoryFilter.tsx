"use client";

import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {categories.map((category, index) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === category
              ? "text-white"
              : "text-gray-400 hover:text-white bg-card/50 hover:bg-card border border-border hover:border-accent/30"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Active background */}
          {activeCategory === category && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent to-purple-600 rounded-full -z-10"
              layoutId="activeCategory"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          
          {/* Glow effect for active */}
          {activeCategory === category && (
            <div className="absolute inset-0 bg-accent/30 rounded-full blur-lg -z-20" />
          )}
          
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
}
