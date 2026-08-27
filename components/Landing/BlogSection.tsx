"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPublishedBlogs } from "@/store/features/blogs/blogSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Heart, Eye, ArrowRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { BlogCoverBanner } from "@/components/Blog/BlogRenderer";

export default function BlogSection() {
  const dispatch = useAppDispatch();
  const { blogs, loadingBlogs } = useAppSelector((s) => s.blogs);

  useEffect(() => {
    dispatch(fetchPublishedBlogs());
  }, [dispatch]);

  const featuredBlogs = blogs.slice(0, 3);

  return (
    <section className="py-16 border-t border-border/50 bg-background/50 relative overflow-hidden" id="blogs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Latest <span className="text-primary">Blogs & Stories</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Learn from fellow skill swappers. Real experiences, tutorials, and career tips shared by our active community.
            </p>
          </div>
          <Link href="/public-blogs">
            <Button variant="outline" className="gap-2 rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all">
              View All Blogs <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Content Grid */}
        {loadingBlogs ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl border border-border bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : featuredBlogs.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-card">
            <p className="text-muted-foreground text-sm">No blog posts published yet.</p>
            <Link href="/public-blogs" className="mt-3 inline-block">
              <Button size="sm" className="mt-2 cursor-pointer">Be the first to write a blog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => {
              const initials = `${blog.author?.firstName?.[0] || ""}${blog.author?.lastName?.[0] || ""}`.toUpperCase() || "U";

              return (
                <div
                  key={blog._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  <BlogCoverBanner
                    coverImage={blog.coverImage}
                    category={blog.category || "General"}
                    heightClass="h-36"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 border-2 border-white/40">
                        <AvatarImage src={blog.author?.avatar || ""} alt={blog.author?.fullName} />
                        <AvatarFallback className="text-[10px] bg-white/20 text-white font-bold">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold text-white drop-shadow-sm">{blog.author?.fullName}</span>
                    </div>
                  </BlogCoverBanner>

                  <div className="p-5 flex flex-col flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.slice(0, 2).map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] font-medium">
                            #{t}
                          </Badge>
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    <div>
                      <Link href={`/public-blogs/${blog._id}`}>
                        <h3 className="font-bold text-base leading-snug line-clamp-2 hover:text-primary transition-colors mb-1">
                          {blog.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {blog.subtitle || blog.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-dashed border-border pt-3 text-xs text-muted-foreground mt-auto">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          {blog.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.views || 0}
                        </span>
                      </div>
                      <Link href={`/public-blogs/${blog._id}`}>
                        <span className="text-primary font-semibold hover:underline flex items-center gap-1">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
