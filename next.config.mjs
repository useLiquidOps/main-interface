import { execSync } from "child_process";

// Get git hash at build time for footer
const gitHash = (() => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch (error) {
    console.warn("Failed to get git hash:", error.message);
    return "unknown";
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GIT_HASH: gitHash,
  },
  output: "export",
  distDir: "dist",
  assetPrefix: "/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
