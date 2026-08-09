import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to client/ itself — the repo root carries an
  // unrelated stub package-lock.json (predates this app) that otherwise
  // makes Turbopack guess the wrong root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
