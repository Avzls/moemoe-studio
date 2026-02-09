"use client";

export default function LoadingSkeleton() {
  // Generate random heights for skeleton items to mimic masonry layout
  const heights = [200, 280, 240, 320, 180, 260, 300, 220, 280, 200, 240, 300];
  
  return (
    <div className="masonry-grid">
      {heights.map((height, index) => (
        <div
          key={index}
          className="masonry-item skeleton rounded-xl"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}
