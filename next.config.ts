import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: [
    "192.168.1.153",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
