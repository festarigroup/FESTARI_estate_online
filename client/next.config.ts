import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to client/ itself — the repo root carries an
  // unrelated stub package-lock.json (predates this app) that otherwise
  // makes Turbopack guess the wrong root.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      // Supabase Storage serves every uploaded avatar/property/post/story
      // image from a project-specific *.supabase.co host — wildcarded since
      // the exact project subdomain differs per environment.
      { protocol: "https", hostname: "*.supabase.co" },
      // db/seed.ts's own avatar()/img() helpers pull seed-only placeholder
      // photos from these two hosts (randomuser.me for user avatars,
      // picsum.photos for property/hotel/story imagery) — real uploads
      // never use them, only `npm run db:seed`'s demo data does.
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
