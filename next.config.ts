import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
