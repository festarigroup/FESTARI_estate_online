export type ArtisanProfile = {
  id: number;
  name: string;
  craft: string;
  bio: string;
  cardImage: string;
  avatar: string;
};

export const ARTISAN_PROFILES: ArtisanProfile[] = [
  {
    id: 1,
    name: "Elias Thorne",
    craft: "Master Woodworker",
    bio: "Specializing in reclaimed forest timbers and 17th-century joining techniques for heirloom furniture.",
    cardImage: "/artisans/card-woodworker.jpg",
    avatar: "/artisans/avatar-elias.jpg",
  },
  {
    id: 2,
    name: "Sienna Rossi",
    craft: "Stonemason",
    bio: "Bringing the weight of Italian heritage to sculptural architectural features and hand-carved facades.",
    cardImage: "/artisans/card-stonemason.jpg",
    avatar: "/artisans/avatar-sienna.jpg",
  },
  {
    id: 3,
    name: "Julian Vance",
    craft: "Textile Artist",
    bio: "Creator of bespoke tapestries and upholstered environments for high-end residential estates.",
    cardImage: "/artisans/card-textile.jpg",
    avatar: "/artisans/avatar-julian.jpg",
  },
];

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
