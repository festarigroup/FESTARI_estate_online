"use client";

import Image from "next/image";

const galleryImages = [
  { id: 1, src: "/gallery.png", alt: "Modern luxury villa exterior", cols: 2, rows: 2 },
  { id: 2, src: "/services.jpg", alt: "Contemporary living space", cols: 1, rows: 1 },
  { id: 3, src: "/contact.jpg", alt: "Elegant interior design", cols: 1, rows: 1 },
  { id: 4, src: "/journey.jpg", alt: "Property exterior view", cols: 1, rows: 1 },
  { id: 5, src: "/whoweare.png", alt: "Grand event venue", cols: 1, rows: 1 },
  { id: 6, src: "/services.jpg", alt: "Premium hotel suite", cols: 1, rows: 1 },
  { id: 7, src: "/contact.jpg", alt: "Artisan craftsmanship", cols: 1, rows: 1 },
  { id: 8, src: "/gallery.png", alt: "Luxury apartment complex", cols: 1, rows: 1 },
  { id: 9, src: "/journey.jpg", alt: "Beachfront property", cols: 1, rows: 1 },
  { id: 10, src: "/whoweare.png", alt: "Garden terrace", cols: 2, rows: 1 },
  { id: 11, src: "/services.jpg", alt: "Modern kitchen interior", cols: 1, rows: 1 },
  { id: 12, src: "/contact.jpg", alt: "Hotel lobby", cols: 1, rows: 1 },
  { id: 13, src: "/gallery.png", alt: "Hillside estate", cols: 1, rows: 1 },
  { id: 14, src: "/journey.jpg", alt: "Swimming pool area", cols: 1, rows: 1 },
  { id: 15, src: "/whoweare.png", alt: "Rooftop lounge", cols: 1, rows: 2 },
  { id: 16, src: "/services.jpg", alt: "Dining hall", cols: 1, rows: 1 },
  { id: 17, src: "/contact.jpg", alt: "Bedroom suite", cols: 1, rows: 1 },
  { id: 18, src: "/journey.jpg", alt: "Landscaped compound", cols: 2, rows: 1 },
  { id: 19, src: "/gallery.png", alt: "Office space", cols: 1, rows: 1 },
  { id: 20, src: "/services.jpg", alt: "Conference venue", cols: 1, rows: 1 },
];

export default function GalleryPage() {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: "repeat(4, 1fr)",
        gridAutoRows: "200px",
      }}
    >
      {galleryImages.map((img) => (
        <div
          key={img.id}
          className="relative overflow-hidden rounded-sm"
          style={{
            gridColumn: `span ${img.cols}`,
            gridRow: `span ${img.rows}`,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
