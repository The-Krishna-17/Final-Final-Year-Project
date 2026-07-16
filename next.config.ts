import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.127"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "development" 
          ? "http://localhost:5000/api/:path*"
          : "https://final-final-year-project-backend.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
