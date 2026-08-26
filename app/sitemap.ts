import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://skillsxchange.vercel.app";

  // Only user-facing platform pages, no API routes or admin routes
  const publicPages = [
    "",
    "/public-blogs",
    "/public-jobs",
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
    changeFrequency: route === "" || route.includes("blogs") || route.includes("jobs") ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.includes("blogs") || route.includes("jobs") ? 0.9 : 0.8,
  }));
}
