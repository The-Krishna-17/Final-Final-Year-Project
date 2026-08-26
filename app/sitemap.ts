import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://skillsxchange.vercel.app";

  // Only user-facing platform pages, no API routes or admin routes
  const publicPages = [
    "",
    "/blogs",
    "/jobs",
    "/login",
    "/signup",
    "/my-skills",
    "/matches",
    "/connections",
    "/meetings",
    "/forgot-password",
    "/verify-email",
  ];

  return publicPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" || route === "/blogs" || route === "/jobs" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/blogs" || route === "/jobs" ? 0.9 : 0.8,
  }));
}
