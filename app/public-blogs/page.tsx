"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPublishedBlogs,
  toggleLikeBlogAction,
} from "@/store/features/blogs/blogSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  BookOpen,
  Search,
  Tag,
  Heart,
  Eye,
  Clock,
  FileText,
  User,
  Sparkles,
  ArrowRight,
  LogIn,
  Calendar,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useRouter } from "next/navigation";
import {
  BlogCoverBanner,
  BlogContentRenderer,
  BLOG_CATEGORIES,
} from "@/components/Blog/BlogRenderer";
import { BlogItem } from "@/store/features/blogs/type";

const plainBlogText = (content: string) =>
  content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^]]*\]\([^)]*\)/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

export default function PublicBlogsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const { blogs, loadingBlogs } = useAppSelector((s) => s.blogs);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPublishedBlogs());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(
      fetchPublishedBlogs({
        search: searchQuery,
        tag: selectedTag,
        category: selectedCategory,
      }),
    );
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setSelectedTag("");
    setSelectedCategory("");
    dispatch(fetchPublishedBlogs());
  };

  const openBlogDetail = (blog: BlogItem) => {
    router.push(`/public-blogs/${blog._id}`);
  };

  const handleLike = async (blogId: string) => {
    if (!user) {
      toast.error("Please log in to like blog posts.");
      return;
    }
    try {
      await dispatch(toggleLikeBlogAction(blogId)).unwrap();
    } catch (err: any) {
      toast.error(err || "Failed to toggle like.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12 space-y-10">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Explore <span className="text-primary">Blogs & Tech Stories</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Discover articles, tutorials, and career insights shared by our
            active skill-swapping community.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-center flex-wrap">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCategory("");
              dispatch(
                fetchPublishedBlogs({ search: searchQuery, tag: selectedTag }),
              );
            }}
            className="rounded-full text-xs cursor-pointer"
          >
            All Categories
          </Button>
          {BLOG_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(cat);
                dispatch(
                  fetchPublishedBlogs({
                    search: searchQuery,
                    tag: selectedTag,
                    category: cat,
                  }),
                );
              }}
              className="rounded-full text-xs cursor-pointer"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-11 bg-card border-border"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-11 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="h-11 px-6 cursor-pointer">
              Search
            </Button>
            {(searchQuery || selectedTag || selectedCategory) && (
              <Button
                variant="outline"
                onClick={handleClearFilter}
                className="h-11 cursor-pointer"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Blogs List */}
        {loadingBlogs ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading community blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl bg-muted/10 border-border">
            <FileText className="w-12 h-12 text-muted-foreground opacity-30 mb-3" />
            <h3 className="font-semibold text-lg">No blogs found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              No matching published posts available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => {
              const initials =
                `${blog.author?.firstName?.[0] || ""}${blog.author?.lastName?.[0] || ""}`.toUpperCase() ||
                "U";
              const isLiked = user && blog.likes?.includes(user._id);

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
                        <AvatarImage
                          src={blog.author?.avatar || ""}
                          alt={blog.author?.fullName}
                        />
                        <AvatarFallback className="text-[10px] bg-white/20 text-white font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold text-white drop-shadow-sm">
                        {blog.author?.fullName}
                      </span>
                    </div>
                  </BlogCoverBanner>

                  <div className="p-5 flex flex-col flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.slice(0, 2).map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-[10px] font-medium"
                          >
                            #{t}
                          </Badge>
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(blog.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div>
                      <h3
                        onClick={() => openBlogDetail(blog)}
                        className="font-bold text-base leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-1"
                      >
                        {blog.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                        {blog.subtitle || plainBlogText(blog.content)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-dashed border-border pt-3 text-xs text-muted-foreground mt-auto">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(blog._id)}
                          className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${isLiked ? "text-rose-500 fill-rose-500" : ""}`}
                          />
                          {blog.likes?.length || 0}
                        </button>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.views || 0}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          user
                            ? router.push(`/blogs/${blog._id}`)
                            : router.push("/login")
                        }
                        className="text-xs text-primary p-0 h-auto font-semibold hover:bg-transparent cursor-pointer flex items-center gap-1"
                      >
                        Read More <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">
            Want to publish your own experience?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Join thousands of active learners and professionals sharing skills
            and tutorials every day.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => router.push("/signup")}
              className="rounded-full px-6 cursor-pointer"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="rounded-full px-6 cursor-pointer gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
