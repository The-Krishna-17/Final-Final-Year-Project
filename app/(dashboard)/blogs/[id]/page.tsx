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

export default function BlogDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((s) => s.auth);
  const { currentBlog, loadingCurrent, errorCurrent } = useAppSelector(
    (s) => s.blogs,
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
    if (!id || !user) {
      toast.error("Please login to like this blog.");
      return;
    }
    try {
      await dispatch(toggleLikeBlogAction(id)).unwrap();
    } catch (err: any) {
      toast.error(err || "Failed to like blog");
    }
  };

  if (loadingCurrent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-muted-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Fetching blog details...</p>
      </div>
    );
  }

  if (errorCurrent || !currentBlog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center max-w-md mx-auto space-y-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-2xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold">Blog not found</h2>
        <p className="text-sm text-muted-foreground">
          {errorCurrent ||
            "The blog post you're looking for doesn't exist, is a draft, or was removed."}
        </p>
        <Button
          onClick={() => router.push("/blogs")}
          variant="outline"
          className="gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Button>
      </div>
    );
  }

  const initials =
    `${currentBlog.author?.firstName?.[0] || ""}${currentBlog.author?.lastName?.[0] || ""}`.toUpperCase() ||
    "U";
  const isLiked = user && currentBlog.likes?.includes(user._id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => router.push("/blogs")}
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Button>

        {currentBlog.status === "draft" && (
          <Badge className="bg-amber-500 text-white hover:bg-amber-500">
            Draft
          </Badge>
        )}
      </div>

      {/* Cover + Title */}
      <div
        className={`w-full rounded-xl bg-linear-to-r ${
          currentBlog.coverImage || "from-slate-600 to-slate-800"
        } p-8 md:p-10 text-white space-y-5 relative overflow-hidden`}
      >
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {currentBlog.tags?.map((tag) => (
              <Badge
                key={tag}
                className="bg-white/15 text-white border border-white/10 hover:bg-white/25 text-[10px] font-medium px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            {currentBlog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/10 text-white/90 text-sm">
            <div className="flex items-center gap-2.5">
              <Avatar className="w-9 h-9 border-2 border-white/20">
                <AvatarImage
                  src={currentBlog.author?.avatar || ""}
                  alt={currentBlog.author?.fullName}
                />
                <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {currentBlog.author?.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-white/60" />
              <span className="text-xs">
                {formatDistanceToNow(new Date(currentBlog.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/60" />
              <span className="text-xs">
                {Math.max(
                  1,
                  Math.ceil(currentBlog.content.split(" ").length / 200),
                )}{" "}
                min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Article body */}
        <div className="lg:col-span-3">
          <div className="border-0 shadow-sm bg-card rounded-xl p-6 md:p-8">
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {currentBlog.content}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Reactions */}
          <div className="border-0 shadow-sm bg-card rounded-xl p-4 text-center space-y-3">
            <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
              Feedback
            </h3>

            <div className="flex items-center justify-center gap-3 py-1">
              <button
                onClick={handleLike}
                disabled={currentBlog.status === "draft"}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border border-border w-18 transition-all cursor-pointer ${
                  isLiked
                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-500"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <Heart
                  className={`w-5 h-5 mb-1 transition-transform active:scale-75 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-[11px] font-semibold">
                  {currentBlog.likes?.length || 0}
                </span>
              </button>

              <div className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-border w-18 text-muted-foreground">
                <Eye className="w-5 h-5 mb-1 text-blue-500" />
                <span className="text-[11px] font-semibold">
                  {currentBlog.views || 0}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-snug">
              {isLiked
                ? "You liked this post."
                : "Was this helpful? Leave a like!"}
            </p>
          </div>

          {/* Author */}
          <div className="border-0 shadow-sm bg-card rounded-xl p-4 space-y-3">
            <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
              Author
            </h3>
            <div className="flex items-center gap-2.5">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage
                  src={currentBlog.author?.avatar || ""}
                  alt={currentBlog.author?.fullName}
                />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-sm">
                  {currentBlog.author?.fullName}
                </h4>
                <p className="text-[11px] text-muted-foreground capitalize">
                  {currentBlog.author?.role || "Member"}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {currentBlog.author?.bio ||
                "Active member of the skill-swap community."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
