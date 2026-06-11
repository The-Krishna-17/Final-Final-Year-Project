import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.127"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://final-final-year-project-backend.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
