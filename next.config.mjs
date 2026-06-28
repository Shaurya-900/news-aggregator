import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this project. There's an unrelated
  // package-lock.json in the home directory, and without this Turbopack
  // mis-infers the root from it.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
  // The news feed renders remote thumbnails with a plain <img> tag so that
  // arbitrary RSS image domains "just work" without per-domain allow-listing.
  // If you later switch NewsCard to next/image, add the source hosts here:
  //
  // images: {
  //   remotePatterns: [{ protocol: "https", hostname: "**" }],
  // },
};

export default nextConfig;
