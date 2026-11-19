import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }] },
  turbopack: {
    rules: {
      "*.css": [
        {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.module.css",
          condition: { path: /\.module\.css$/ },
        },
        {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
          condition: { not: { path: /\.module\.css$/ } },
        },
      ],
    },
  },
};

export default nextConfig;
