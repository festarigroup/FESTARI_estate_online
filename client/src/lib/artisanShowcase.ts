export type ArtisanProfile = {
  id: number;
  name: string;
  craft: string;
  bio: string;
  cardImage: string;
  avatar: string;
  rating: number;
  yearsExperience: number;
  location: string;
  portfolioImages: string[];
};

export const ARTISAN_PROFILES: ArtisanProfile[] = [
  {
    id: 1,
    name: "Elias Thorne",
    craft: "Master Woodworker",
    bio: "Specializing in reclaimed forest timbers and 17th-century joining techniques for heirloom furniture.",
    cardImage: "/artisans/card-woodworker.jpg",
    avatar: "/artisans/avatar-elias.jpg",
    rating: 4.9,
    yearsExperience: 18,
    location: "Kumasi, Ghana",
    portfolioImages: [
      "/artisans/card-woodworker.jpg",
      "/artisans/portfolio/elias-2.jpg",
      "/artisans/portfolio/elias-3.jpg",
    ],
  },
  {
    id: 2,
    name: "Sienna Rossi",
    craft: "Stonemason",
    bio: "Bringing the weight of Italian heritage to sculptural architectural features and hand-carved facades.",
    cardImage: "/artisans/card-stonemason.jpg",
    avatar: "/artisans/avatar-sienna.jpg",
    rating: 4.8,
    yearsExperience: 14,
    location: "Cape Coast, Ghana",
    portfolioImages: [
      "/artisans/card-stonemason.jpg",
      "/artisans/portfolio/sienna-2.jpg",
      "/artisans/portfolio/sienna-3.jpg",
    ],
  },
  {
    id: 3,
    name: "Julian Vance",
    craft: "Textile Artist",
    bio: "Creator of bespoke tapestries and upholstered environments for high-end residential estates.",
    cardImage: "/artisans/card-textile.jpg",
    avatar: "/artisans/avatar-julian.jpg",
    rating: 5.0,
    yearsExperience: 9,
    location: "Bolgatanga, Ghana",
    portfolioImages: [
      "/artisans/card-textile.jpg",
      "/artisans/portfolio/julian-2.jpg",
      "/artisans/portfolio/julian-3.jpg",
    ],
  },
  {
    id: 4,
    name: "Kwesi Adjei",
    craft: "Master Leatherworker",
    bio: "Hand-tanning and stitching full-grain hides into bespoke furniture, luggage, and estate fittings.",
    cardImage: "/artisans/card-leatherworker.jpg",
    avatar: "/artisans/avatar-kwesi.jpg",
    rating: 4.9,
    yearsExperience: 22,
    location: "Tamale, Ghana",
    portfolioImages: [
      "/artisans/card-leatherworker.jpg",
      "/artisans/portfolio/kwesi-2.jpg",
      "/artisans/portfolio/kwesi-3.jpg",
    ],
  },
  {
    id: 5,
    name: "Ama Serwaa",
    craft: "Kente Weaver",
    bio: "Weaving heirloom kente strips on a traditional loom, blending ancestral patterns with estate-scale commissions.",
    cardImage: "/artisans/card-kente.jpg",
    avatar: "/artisans/avatar-ama.jpg",
    rating: 5.0,
    yearsExperience: 16,
    location: "Bonwire, Ghana",
    portfolioImages: [
      "/artisans/card-kente.jpg",
      "/artisans/portfolio/ama-2.jpg",
      "/artisans/portfolio/ama-3.jpg",
    ],
  },
  {
    id: 6,
    name: "Kojo Antwi",
    craft: "Master Ceramicist",
    bio: "Hand-thrown stoneware and terracotta vessels fired in wood kilns for a warm, one-of-a-kind estate finish.",
    cardImage: "/artisans/card-potter.jpg",
    avatar: "/artisans/avatar-kojo.jpg",
    rating: 4.8,
    yearsExperience: 11,
    location: "Vume, Ghana",
    portfolioImages: [
      "/artisans/card-potter.jpg",
      "/artisans/portfolio/kojo-2.jpg",
      "/artisans/portfolio/kojo-3.jpg",
    ],
  },
];

export function getArtisanById(id: number): ArtisanProfile | undefined {
  return ARTISAN_PROFILES.find((artisan) => artisan.id === id);
}

export type MaterialSwatch = {
  id: number;
  name: string;
  image: string;
};

export const MATERIAL_SWATCHES: MaterialSwatch[] = [
  { id: 1, name: "Malachite Accents", image: "/artisans/material-malachite.jpg" },
  { id: 2, name: "Artisan Brass", image: "/artisans/material-brass.jpg" },
  { id: 3, name: "Tuscan Leather", image: "/artisans/material-leather.jpg" },
  { id: 4, name: "Carbonized Cedar", image: "/artisans/material-cedar.jpg" },
];
