"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPublishedBlogs,
  fetchMyBlogs,
  createBlogAction,
  updateBlogAction,
  deleteBlogAction,
  toggleLikeBlogAction,
} from "@/store/features/blogs/blogSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  BookOpen,
  PlusCircle,
  FolderHeart,
  Heart,
  Eye,
  Trash2,
  Edit,
  Tag,
  Search,
  CheckCircle,
  FileText,
  Clock,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const COVER_GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
  "from-slate-600 to-slate-800",
];

export default function BlogsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { blogs, myBlogs, loadingBlogs, loadingMyBlogs, loadingAction } =
    useAppSelector((s) => s.blogs);

  const [activeTab, setActiveTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [coverImage, setCoverImage] = useState(COVER_GRADIENTS[0]);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    dispatch(fetchPublishedBlogs());
    if (user) {
      dispatch(fetchMyBlogs());
    }
  }, [dispatch, user]);

  const handleSearch = () => {
    dispatch(fetchPublishedBlogs({ search: searchQuery, tag: selectedTag }));
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setSelectedTag("");
    dispatch(fetchPublishedBlogs());
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content.");
      return;
    }

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      content,
      status,
      coverImage,
      tags: parsedTags,
    };

    try {
      if (editingBlogId) {
        await dispatch(
          updateBlogAction({ id: editingBlogId, ...payload }),
        ).unwrap();
        toast.success("Blog updated successfully!");
      } else {
        await dispatch(createBlogAction(payload)).unwrap();
        toast.success("Blog created successfully!");
      }
      resetForm();
      setActiveTab(status === "published" ? "explore" : "my-blogs");
    } catch (err: any) {
      toast.error(err || "Failed to save blog");
    }
  };

  const resetForm = () => {
    setEditingBlogId(null);
    setTitle("");
    setContent("");
    setStatus("published");
    setCoverImage(COVER_GRADIENTS[0]);
    setTagsInput("");
  };

  const handleEditClick = (blog: any) => {
    setEditingBlogId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setStatus(blog.status);
    setCoverImage(blog.coverImage || COVER_GRADIENTS[0]);
    setTagsInput(blog.tags?.join(", ") || "");
    setActiveTab("create");
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await dispatch(deleteBlogAction({ id })).unwrap();
        toast.success("Blog post deleted successfully.");
      } catch (err: any) {
        toast.error(err || "Failed to delete blog post.");
      }
    }
  };

  const handleLikeClick = async (id: string) => {
    try {
      await dispatch(toggleLikeBlogAction(id)).unwrap();
    } catch (err: any) {
      toast.error(err || "Failed to toggle like.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Blogs & Experiences
          </h1>
          <p className="text-base text-muted-foreground">
            Share your learning journeys, tutorials, and tips with the
            community.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v);
          if (v !== "create") resetForm();
        }}
      >
        <TabsList variant="line" className="flex items-center gap-4">
          <TabsTrigger value="explore" className="cursor-pointer gap-2">
            <BookOpen className="text-base" />
            Explore
          </TabsTrigger>
          <TabsTrigger value="my-blogs" className="cursor-pointer gap-2">
            <FolderHeart className="text-base" />
            My Posts
          </TabsTrigger>
          <TabsTrigger value="create" className="cursor-pointer gap-2">
            <Pencil className="text-base" />
            {editingBlogId ? "Edit Post" : "Write Post"}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Explore Blogs */}
        <TabsContent value="explore" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs by title, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-background"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter by tag"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="cursor-pointer">
                Search
              </Button>
              {(searchQuery || selectedTag) && (
                <Button
                  variant="outline"
                  onClick={handleClearFilter}
                  className="cursor-pointer"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6">
            {loadingBlogs ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Fetching blog posts...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-muted/10 border-border">
                <FileText className="w-12 h-12 text-muted-foreground opacity-30 mb-3" />
                <h3 className="font-medium text-base">No blogs found</h3>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                  No published posts yet. Be the first to share your journey!
                </p>
                <Button
                  onClick={() => setActiveTab("create")}
                  size="sm"
                  className="mt-4 gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Write a Blog
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((blog) => {
                  const initials =
                    `${blog.author?.firstName?.[0] || ""}${blog.author?.lastName?.[0] || ""}`.toUpperCase() ||
                    "U";
                  const isLiked = user && blog.likes?.includes(user._id);

                  return (
                    <div
                      key={blog._id}
                      className="group overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-shadow duration-200 hover:shadow-md flex flex-col"
                    >
                      {/* Cover strip */}
                      <div
                        className={`h-24 w-full bg-linear-to-r ${
                          blog.coverImage || COVER_GRADIENTS[0]
                        } relative px-4 flex items-end pb-3`}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7 border-2 border-white/30">
                            <AvatarImage
                              src={blog.author?.avatar || ""}
                              alt={blog.author?.fullName}
                            />
                            <AvatarFallback className="text-[9px] bg-white/20 text-white font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[11px] font-semibold text-white drop-shadow-sm">
                            {blog.author?.fullName}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-3 flex flex-col flex-1">
                        {/* Tags + time */}
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-medium px-2 py-0"
                          >
                            {blog.tags?.[0] || "Community"}
                          </Badge>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(blog.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/blogs/${blog._id}`}>
                          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors mb-1.5">
                            {blog.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
                          {blog.content}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-dashed border-border pt-3">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <button
                              onClick={() => handleLikeClick(blog._id)}
                              className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isLiked ? "text-red-500 fill-red-500" : ""
                                }`}
                              />
                              {blog.likes?.length || 0}
                            </button>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {blog.views || 0}
                            </span>
                          </div>
                          <Link href={`/blogs/${blog._id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-primary p-0 h-auto hover:bg-transparent font-medium cursor-pointer"
                            >
                              Read more
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: My Blogs */}
        <TabsContent value="my-blogs" className="mt-6">
          {loadingMyBlogs ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Fetching your posts...</p>
            </div>
          ) : myBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-muted/10 border-border">
              <FileText className="w-12 h-12 text-muted-foreground opacity-30 mb-3" />
              <h3 className="font-medium text-base">No posts yet</h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                You haven&apos;t written any posts yet. Start sharing your
                experience.
              </p>
              <Button
                onClick={() => setActiveTab("create")}
                size="sm"
                className="mt-4 gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Create Post
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="group overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-shadow duration-200 hover:shadow-md flex flex-col relative"
                >
                  {/* Status tag */}
                  <div className="absolute right-3 top-3 z-10">
                    <Badge
                      className={
                        blog.status === "published"
                          ? "bg-green-600 text-white hover:bg-green-600"
                          : "bg-amber-500 text-white hover:bg-amber-500"
                      }
                    >
                      {blog.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  {/* Cover strip */}
                  <div
                    className={`h-20 w-full bg-linear-to-r ${
                      blog.coverImage || COVER_GRADIENTS[0]
                    }`}
                  />

                  <div className="px-4 pb-4 pt-3 flex flex-col flex-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Clock className="w-3 h-3" />
                      Updated{" "}
                      {formatDistanceToNow(new Date(blog.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>

                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1.5">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
                      {blog.content}
                    </p>

                    {/* Actions */}
                    <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(blog)}
                          className="h-8 w-8 p-0 cursor-pointer hover:bg-accent"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(blog._id)}
                          className="h-8 w-8 p-0 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      </div>

                      {blog.status === "published" ? (
                        <Link href={`/blogs/${blog._id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary h-8 p-0 font-medium cursor-pointer"
                          >
                            View Post
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Create / Edit */}
        <TabsContent value="create" className="mt-6 max-w-3xl">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg border-b border-border pb-3 mb-5 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-primary" />
                {editingBlogId ? "Edit Blog Post" : "Write a New Post"}
              </h2>

              <form onSubmit={handleSubmitBlog} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Give your post a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    className="bg-background"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Share your experience, code snippets, or tips..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-50 bg-background leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">
                      Tags (comma-separated)
                    </label>
                    <Input
                      placeholder="React, Frontend, Career"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex gap-4 items-center h-10 border border-input rounded-md px-3 bg-background">
                      <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "published"}
                          onChange={() => setStatus("published")}
                          className="accent-primary"
                        />
                        Publish
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "draft"}
                          onChange={() => setStatus("draft")}
                          className="accent-primary"
                        />
                        Draft
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cover selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {COVER_GRADIENTS.map((gradient) => (
                      <button
                        key={gradient}
                        type="button"
                        onClick={() => setCoverImage(gradient)}
                        className={`h-12 rounded-lg bg-linear-to-r ${gradient} relative transition-all duration-150 border-2 cursor-pointer ${
                          coverImage === gradient
                            ? "border-foreground scale-105 shadow-sm"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {coverImage === gradient && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loadingAction}
                    className="cursor-pointer min-w-27.5"
                  >
                    {loadingAction ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingBlogId ? (
                      "Update"
                    ) : status === "published" ? (
                      "Publish"
                    ) : (
                      "Save Draft"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
