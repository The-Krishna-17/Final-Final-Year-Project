"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

export const COVER_GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
  "from-slate-600 to-slate-800",
];

export const BLOG_CATEGORIES = [
  "General",
  "Tutorial",
  "Career & Tips",
  "Engineering & Code",
  "UI/UX Design",
  "AI & Innovation",
  "Project Showcase",
];

export const PRESET_COVER_IMAGES = [
  {
    name: "Code & Laptop",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Modern Workspace",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Abstract Neon",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Design & UX",
    url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "AI & Future",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Team Collaboration",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
];

export const isImageUrl = (url?: string | null): boolean => {
  if (!url) return false;
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:image") ||
    url.startsWith("/")
  );
};

interface BlogCoverBannerProps {
  coverImage?: string | null;
  heightClass?: string;
  className?: string;
  children?: React.ReactNode;
  category?: string;
}

export function BlogCoverBanner({
  coverImage,
  heightClass = "h-28",
  className = "",
  children,
  category,
}: BlogCoverBannerProps) {
  const isImg = isImageUrl(coverImage);

  if (isImg) {
    return (
      <div
        className={`relative w-full ${heightClass} overflow-hidden ${className}`}
      >
        <img
          src={coverImage!}
          alt="Blog Cover"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        {category && (
          <Badge className="absolute top-3 left-3 bg-black/60 text-white backdrop-blur-xs border border-white/20 text-[10px] font-medium z-10">
            {category}
          </Badge>
        )}
        <div className="absolute inset-0 p-4 flex items-end z-10">
          {children}
        </div>
      </div>
    );
  }

  const gradientClass = coverImage || COVER_GRADIENTS[0];

  return (
    <div
      className={`w-full ${heightClass} bg-linear-to-r ${gradientClass} relative p-4 flex items-end ${className}`}
    >
      {category && (
        <Badge className="absolute top-3 left-3 bg-black/30 text-white backdrop-blur-xs border border-white/20 text-[10px] font-medium z-10">
          {category}
        </Badge>
      )}
      {children}
    </div>
  );
}

interface BlogContentRendererProps {
  content: string;
  className?: string;
}

export function BlogContentRenderer({
  content,
  className = "",
}: BlogContentRendererProps) {
  if (!content) return null;

  // Render markdown-like sections cleanly
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Code block handle
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div
            key={`code-${idx}`}
            className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-md"
          >
            {codeLang && (
              <div className="bg-slate-900 px-4 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800 flex justify-between items-center">
                <span>{codeLang.toUpperCase()}</span>
                <span className="text-[10px] text-slate-500">Snippet</span>
              </div>
            )}
            <pre className="p-4 font-mono text-xs overflow-x-auto leading-relaxed">
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          </div>,
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = "";
      } else {
        inCodeBlock = true;
        codeLang = trimmed.replace("```", "").trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Heading 1 or 2 (##)
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={idx}
          className="text-xl sm:text-2xl font-bold mt-7 mb-3 text-foreground tracking-tight border-b border-border/50 pb-2"
        >
          {trimmed.replace("## ", "")}
        </h2>,
      );
      return;
    }

    // Heading 3 (###)
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={idx}
          className="text-lg font-semibold mt-5 mb-2 text-foreground tracking-tight"
        >
          {trimmed.replace("### ", "")}
        </h3>,
      );
      return;
    }

    // Image markdown: ![alt](url) or http image line
    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      const alt = imageMatch[1];
      const url = imageMatch[2];
      elements.push(
        <figure
          key={idx}
          className="my-6 rounded-xl overflow-hidden border border-border bg-muted/20 shadow-xs"
        >
          <img
            src={url}
            alt={alt || "Blog image"}
            className="w-full max-h-120 object-cover"
          />
          {alt && (
            <figcaption className="p-2 text-center text-xs text-muted-foreground bg-muted/30 italic">
              {alt}
            </figcaption>
          )}
        </figure>,
      );
      return;
    }

    // Standalone image URL line
    if (
      isImageUrl(trimmed) &&
      (trimmed.endsWith(".jpg") ||
        trimmed.endsWith(".png") ||
        trimmed.endsWith(".jpeg") ||
        trimmed.endsWith(".webp") ||
        trimmed.includes("images.unsplash.com"))
    ) {
      elements.push(
        <figure
          key={idx}
          className="my-6 rounded-xl overflow-hidden border border-border bg-muted/20 shadow-xs"
        >
          <img
            src={trimmed}
            alt="Blog embedded image"
            className="w-full max-h-120co object-cover"
          />
        </figure>,
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={idx}
          className="border-l-4 border-primary pl-4 py-2.5 my-4 italic text-foreground/90 bg-primary/5 rounded-r-lg text-sm leading-relaxed"
        >
          {trimmed.replace("> ", "")}
        </blockquote>,
      );
      return;
    }

    // Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div
          key={idx}
          className="flex items-start gap-2.5 my-1.5 text-sm text-foreground/90 pl-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
          <span className="leading-relaxed">{trimmed.substring(2)}</span>
        </div>,
      );
      return;
    }

    // Empty space
    if (!trimmed) {
      elements.push(<div key={idx} className="h-2" />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={idx} className="text-sm leading-relaxed text-foreground/90 my-2">
        {line}
      </p>,
    );
  });

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
