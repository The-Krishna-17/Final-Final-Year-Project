"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchBlogById,
  toggleLikeBlogAction,
  clearCurrentBlog,
} from "@/store/features/blogs/blogSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Loader2, Heart, Eye, Clock, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  BlogCoverBanner,
  BlogContentRenderer,
} from "@/components/Blog/BlogRenderer";

export default function PublicBlogDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((s) => s.auth);
  const { currentBlog, loadingCurrent, errorCurrent } = useAppSelector(
    (s) => s.blogs
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like this blog.");
      return;
    }
    try {
      await dispatch(toggleLikeBlogAction(id)).unwrap();
    } catch (err: any) {
      toast.error(err || "Failed to like blog");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6 pb-16">
        {/* Back */}
        <Button
          onClick={() => router.push("/public-blogs")}
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Button>

        {loadingCurrent ? (
          <div className="flex flex-col items-center justify-center min-h-80 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading blog post...</p>
          </div>
        ) : errorCurrent || !currentBlog ? (
          <div className="flex flex-col items-center justify-center min-h-80 text-center max-w-md mx-auto space-y-4">
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-2xl">⚠️</div>
            <h2 className="text-xl font-bold">Blog not found</h2>
            <p className="text-sm text-muted-foreground">
              {errorCurrent || "The blog post you're looking for doesn't exist or was removed."}
            </p>
            <Button
              onClick={() => router.push("/public-blogs")}
              variant="outline"
              className="gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </Button>
          </div>
        ) : (
          <>
            {/* Hero Cover Banner */}
            <BlogCoverBanner
              coverImage={currentBlog.coverImage}
              category={currentBlog.category || "General"}
              heightClass="h-64 sm:h-80"
              className="rounded-2xl"
            >
              <div className="w-full space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {currentBlog.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-white/15 text-white border border-white/20 text-[10px] backdrop-blur-xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-sm">
                  {currentBlog.title}
                </h1>
                {currentBlog.subtitle && (
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed italic max-w-2xl">
                    {currentBlog.subtitle}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/15 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border-2 border-white/25">
                      <AvatarImage src={currentBlog.author?.avatar || ""} alt={currentBlog.author?.fullName} />
                      <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
                        {`${currentBlog.author?.firstName?.[0] || ""}${currentBlog.author?.lastName?.[0] || ""}`.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">{currentBlog.author?.fullName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-white/60" />
                    {formatDistanceToNow(new Date(currentBlog.createdAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-white/60" />
                    {Math.max(1, Math.ceil(currentBlog.content.split(" ").length / 200))} min read
                  </div>
                </div>
              </div>
            </BlogCoverBanner>

            {/* Content + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="border border-border shadow-xs bg-card rounded-2xl p-6 md:p-8 space-y-4">
                  {currentBlog.subtitle && (
                    <p className="text-base text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                      {currentBlog.subtitle}
                    </p>
                  )}
                  <BlogContentRenderer content={currentBlog.content} />
                </div>
              </div>

              <div className="space-y-4">
                {/* Reactions */}
                <div className="border border-border shadow-xs bg-card rounded-2xl p-4 text-center space-y-3">
                  <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Reactions</h3>
                  <div className="flex items-center justify-center gap-3 py-1">
                    <button
                      onClick={handleLike}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border w-18 transition-all cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 hover:text-red-500 text-muted-foreground"
                    >
                      <Heart className="w-5 h-5 mb-1" />
                      <span className="text-[11px] font-semibold">{currentBlog.likes?.length || 0}</span>
                    </button>
                    <div className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border w-18 text-muted-foreground">
                      <Eye className="w-5 h-5 mb-1 text-blue-500" />
                      <span className="text-[11px] font-semibold">{currentBlog.views || 0}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Was this helpful? Leave a like!</p>
                </div>

                {/* Category */}
                {currentBlog.category && (
                  <div className="border border-border shadow-xs bg-card rounded-2xl p-4 space-y-2">
                    <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Category</h3>
                    <Badge variant="secondary" className="font-semibold">{currentBlog.category}</Badge>
                  </div>
                )}

                {/* Tags */}
                {currentBlog.tags?.length > 0 && (
                  <div className="border border-border shadow-xs bg-card rounded-2xl p-4 space-y-2">
                    <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Tags</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {currentBlog.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[11px]">#{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author */}
                <div className="border border-border shadow-xs bg-card rounded-2xl p-4 space-y-3">
                  <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">About Author</h3>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarImage src={currentBlog.author?.avatar || ""} alt={currentBlog.author?.fullName} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                        {`${currentBlog.author?.firstName?.[0] || ""}${currentBlog.author?.lastName?.[0] || ""}`.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm">{currentBlog.author?.fullName}</h4>
                      <p className="text-[11px] text-muted-foreground capitalize">{currentBlog.author?.role || "Member"}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {currentBlog.author?.bio || "Active member of the skill-swap community."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
