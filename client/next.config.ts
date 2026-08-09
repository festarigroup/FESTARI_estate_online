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
    // Supabase Storage serves every uploaded avatar/property/post/story
    // image from a project-specific *.supabase.co host — wildcarded since
    // the exact project subdomain differs per environment.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
