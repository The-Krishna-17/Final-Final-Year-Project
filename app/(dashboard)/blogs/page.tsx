"use client";

import { useEffect, useRef, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BlogCoverBanner,
  BlogContentRenderer,
  COVER_GRADIENTS,
  BLOG_CATEGORIES,
  PRESET_COVER_IMAGES,
  isImageUrl,
} from "@/components/Blog/BlogRenderer";
import BlogBlockEditor from "@/components/Blog/BlogBlockEditor";
import { axiosInstance } from "@/utils/axiosInstance";
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
  Heading,
  Code,
  Quote,
  List,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const plainBlogText = (content: string) => content
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/!\[[^]]*\]\([^)]*\)/g, " ")
  .replace(/^#{1,6}\s+/gm, "")
  .replace(/^>\s?/gm, "")
  .replace(/^[-*]\s+/gm, "")
  .replace(/\s+/g, " ")
  .trim();

export default function BlogsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { blogs, myBlogs, loadingBlogs, loadingMyBlogs, loadingAction } =
    useAppSelector((s) => s.blogs);

  const [activeTab, setActiveTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Form State
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [coverMode, setCoverMode] = useState<"presets" | "custom" | "gradient">("presets");
  const [coverImage, setCoverImage] = useState(PRESET_COVER_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Form View mode (write vs live preview)
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    dispatch(fetchPublishedBlogs());
    if (user) {
      dispatch(fetchMyBlogs());
    }
  }, [dispatch, user]);

  const handleSearch = () => {
    dispatch(
      fetchPublishedBlogs({
        search: searchQuery,
        tag: selectedTag,
        category: selectedCategory,
      })
    );
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setSelectedTag("");
    setSelectedCategory("");
    dispatch(fetchPublishedBlogs());
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content.");
      return;
    }

    const finalCoverImage =
      coverMode === "custom" && customImageUrl.trim()
        ? customImageUrl.trim()
        : coverImage;

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      content,
      status,
      coverImage: finalCoverImage,
      tags: parsedTags,
    };

    try {
      if (editingBlogId) {
        await dispatch(
          updateBlogAction({ id: editingBlogId, ...payload })
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
    setSubtitle("");
    setCategory("General");
    setContent("");
    setStatus("published");
    setCoverMode("presets");
    setCoverImage(PRESET_COVER_IMAGES[0].url);
    setCustomImageUrl("");
    setTagsInput("");
    setEditorTab("write");
  };

  const handleEditClick = (blog: any) => {
    setEditingBlogId(blog._id);
    setTitle(blog.title || "");
    setSubtitle(blog.subtitle || "");
    setCategory(blog.category || "General");
    setContent(blog.content || "");
    setStatus(blog.status || "published");

    const imgUrl = blog.coverImage || COVER_GRADIENTS[0];
    if (isImageUrl(imgUrl)) {
      const isPreset = PRESET_COVER_IMAGES.some((p) => p.url === imgUrl);
      if (isPreset) {
        setCoverMode("presets");
        setCoverImage(imgUrl);
      } else {
        setCoverMode("custom");
        setCustomImageUrl(imgUrl);
        setCoverImage(imgUrl);
      }
    } else {
      setCoverMode("gradient");
      setCoverImage(imgUrl);
    }

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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file.");
    if (file.size > 8 * 1024 * 1024) return toast.error("Image must be under 8MB.");
    setUploadingCover(true);
    try {
      const reader = new FileReader();
      const url = await new Promise<string>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const res = await axiosInstance.post("/blogs/upload-image", { data: reader.result });
            resolve(res.data.data.url);
          } catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setCustomImageUrl(url);
      setCoverImage(url);
      toast.success("Cover image uploaded!");
    } catch { toast.error("Failed to upload cover image."); }
    finally { setUploadingCover(false); e.target.value = ""; }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl flex items-center gap-2 tracking-tight">
            <BookOpen className="w-6 h-6 text-primary" />
            Blogs & Learning Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Share tutorials, career guides, code breakdowns, and experiences with the community.
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
        <TabsList variant="line" className="flex items-center gap-4 border-b border-border pb-1">
          <TabsTrigger value="explore" className="cursor-pointer gap-2 font-medium">
            <BookOpen className="w-4 h-4 text-primary" />
            Explore
          </TabsTrigger>
          <TabsTrigger value="my-blogs" className="cursor-pointer gap-2 font-medium">
            <FolderHeart className="w-4 h-4 text-primary" />
            My Posts
          </TabsTrigger>
          <TabsTrigger value="create" className="cursor-pointer gap-2 font-medium">
            <Pencil className="w-4 h-4 text-primary" />
            {editingBlogId ? "Edit Post" : "Write Post"}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Explore Blogs */}
        <TabsContent value="explore" className="mt-6 space-y-6">
          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory("");
                dispatch(fetchPublishedBlogs({ search: searchQuery, tag: selectedTag, category: "" }));
              }}
              className="rounded-full text-xs cursor-pointer shrink-0"
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
                  dispatch(fetchPublishedBlogs({ search: searchQuery, tag: selectedTag, category: cat }));
                }}
                className="rounded-full text-xs cursor-pointer shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs by title, keywords, content..."
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
              {(searchQuery || selectedTag || selectedCategory) && (
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

          {/* Blogs Grid */}
          <div className="mt-6">
            {loadingBlogs ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Fetching blog posts...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-muted/10 border-border">
                <FileText className="w-12 h-12 text-muted-foreground opacity-30 mb-3" />
                <h3 className="font-semibold text-base">No blogs found</h3>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                  No matching published posts. Be the first to publish a post in this category!
                </p>
                <Button
                  onClick={() => setActiveTab("create")}
                  size="sm"
                  className="mt-4 gap-2 cursor-pointer rounded-full"
                >
                  <PlusCircle className="w-4 h-4" /> Write a Blog Post
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogs.map((blog) => {
                  const initials =
                    `${blog.author?.firstName?.[0] || ""}${blog.author?.lastName?.[0] || ""}`.toUpperCase() ||
                    "U";
                  const isLiked = user && blog.likes?.includes(user._id);

                  return (
                    <div
                      key={blog._id}
                      className="group overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-300 hover:shadow-lg flex flex-col hover:-translate-y-1"
                    >
                      {/* Cover image / Banner */}
                      <BlogCoverBanner
                        coverImage={blog.coverImage}
                        category={blog.category || "General"}
                        heightClass="h-32"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7 border-2 border-white/40">
                            <AvatarImage
                              src={blog.author?.avatar || ""}
                              alt={blog.author?.fullName}
                            />
                            <AvatarFallback className="text-[9px] bg-white/20 text-white font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold text-white drop-shadow-sm">
                            {blog.author?.fullName}
                          </span>
                        </div>
                      </BlogCoverBanner>

                      <div className="p-5 flex flex-col flex-1">
                        {/* Tags + time */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-wrap gap-1">
                            {blog.tags?.slice(0, 2).map((t) => (
                              <Badge
                                key={t}
                                variant="secondary"
                                className="text-[10px] font-medium px-2 py-0"
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

                        {/* Title */}
                        <Link href={`/blogs/${blog._id}`}>
                          <h3 className="font-bold text-base leading-snug line-clamp-2 hover:text-primary transition-colors mb-1">
                            {blog.title}
                          </h3>
                        </Link>

                        {/* Subtitle / Excerpt */}
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                          {blog.subtitle || plainBlogText(blog.content)}
                        </p>

                        {/* Footer stats */}
                        <div className="flex items-center justify-between border-t border-dashed border-border pt-3 mt-auto">
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
                              className="text-xs text-primary p-0 h-auto font-semibold hover:bg-transparent cursor-pointer"
                            >
                              Read story &rarr;
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
              <p className="text-sm font-medium">Fetching your posts...</p>
            </div>
          ) : myBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-muted/10 border-border">
              <FileText className="w-12 h-12 text-muted-foreground opacity-30 mb-3" />
              <h3 className="font-medium text-base">No posts written yet</h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                Share your tech journey, tutorials, or experiences with fellow learners.
              </p>
              <Button
                onClick={() => setActiveTab("create")}
                size="sm"
                className="mt-4 gap-2 cursor-pointer rounded-full"
              >
                <PlusCircle className="w-4 h-4" /> Create First Post
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="group overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-200 hover:shadow-md flex flex-col relative"
                >
                  {/* Status tag */}
                  <div className="absolute right-3 top-3 z-20">
                    <Badge
                      className={
                        blog.status === "published"
                          ? "bg-emerald-600 text-white hover:bg-emerald-600 font-semibold"
                          : "bg-amber-500 text-white hover:bg-amber-500 font-semibold"
                      }
                    >
                      {blog.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  {/* Cover */}
                  <BlogCoverBanner
                    coverImage={blog.coverImage}
                    category={blog.category || "General"}
                    heightClass="h-28"
                  />

                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Clock className="w-3 h-3" />
                      Updated{" "}
                      {formatDistanceToNow(new Date(blog.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>

                    <h3 className="font-bold text-base leading-snug line-clamp-2 mb-1">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
                      {blog.subtitle || plainBlogText(blog.content)}
                    </p>

                    {/* Actions */}
                    <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(blog)}
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer hover:bg-accent"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5 text-primary" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(blog._id)}
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </Button>
                      </div>

                      {blog.status === "published" ? (
                        <Link href={`/blogs/${blog._id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary h-8 p-0 font-semibold cursor-pointer"
                          >
                            View Post &rarr;
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-600">
                          Saved Draft
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
        <TabsContent value="create" className="mt-6 max-w-4xl mx-auto space-y-6">
          <Card className="border border-border/80 shadow-md bg-card">
            <CardContent className="p-6 space-y-6">
              {/* Form Title */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">
                      {editingBlogId ? "Edit Blog Post" : "Create New Post"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Compose rich articles with custom headers, images, code snippets, and categories.
                    </p>
                  </div>
                </div>

                {/* Editor vs Preview Mode Switch */}
                <div className="flex items-center bg-muted p-1 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setEditorTab("write")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      editorTab === "write"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Write Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab("preview")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      editorTab === "preview"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {editorTab === "preview" ? (
                /* Live Preview Container */
                <div className="space-y-6 bg-background p-6 rounded-xl border border-border">
                  <div className="space-y-2 border-b border-border pb-4">
                    <Badge variant="outline" className="text-xs font-semibold">
                      {category}
                    </Badge>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {title || "Untitled Post Title"}
                    </h1>
                    {subtitle && (
                      <p className="text-muted-foreground text-sm leading-relaxed italic">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  {/* Preview Banner */}
                  <BlogCoverBanner
                    coverImage={
                      coverMode === "custom" && customImageUrl
                        ? customImageUrl
                        : coverImage
                    }
                    category={category}
                    heightClass="h-48"
                    className="rounded-xl"
                  />

                  {/* Preview Content */}
                  <div className="pt-4">
                    <BlogContentRenderer content={content || "*No content written yet. Switch to Write Mode to add content.*"} />
                  </div>
                </div>
              ) : (
                /* Write Form */
                <form onSubmit={handleSubmitBlog} className="space-y-6">
                  {/* Title & Subtitle */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold flex items-center justify-between">
                        <span>Post Title *</span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          {title.length}/150
                        </span>
                      </label>
                      <Input
                        placeholder="e.g. Master React 19: Server Components & Actions Explained"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={150}
                        className="bg-background h-11 text-base font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">
                        Subtitle / Short Excerpt (Optional)
                      </label>
                      <Input
                        placeholder="A concise 1-2 sentence summary to display on post preview cards..."
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        maxLength={300}
                        className="bg-background text-xs"
                      />
                    </div>
                  </div>

                  {/* Category & Tags & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-xs font-medium focus:outline-hidden cursor-pointer"
                      >
                        {BLOG_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">
                        Tags (comma-separated)
                      </label>
                      <Input
                        placeholder="React, Nextjs, Frontend"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="bg-background text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Visibility Status</label>
                      <div className="flex gap-4 items-center h-10 border border-input rounded-md px-3 bg-background">
                        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            checked={status === "published"}
                            onChange={() => setStatus("published")}
                            className="accent-primary"
                          />
                          Publish Now
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            checked={status === "draft"}
                            onChange={() => setStatus("draft")}
                            className="accent-primary"
                          />
                          Save as Draft
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cover Image Selector */}
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" /> Cover Image / Banner
                      </label>
                      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs font-medium">
                        <button
                          type="button"
                          onClick={() => setCoverMode("presets")}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            coverMode === "presets"
                              ? "bg-background text-foreground shadow-xs font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          Stock Photos
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverMode("custom")}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            coverMode === "custom"
                              ? "bg-background text-foreground shadow-xs font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          Upload Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverMode("gradient")}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            coverMode === "gradient"
                              ? "bg-background text-foreground shadow-xs font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          Color Gradients
                        </button>
                      </div>
                    </div>

                    {coverMode === "presets" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {PRESET_COVER_IMAGES.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setCoverImage(preset.url)}
                            className={`h-16 rounded-lg overflow-hidden relative transition-all border-2 cursor-pointer group ${
                              coverImage === preset.url
                                ? "border-primary ring-2 ring-primary/30 scale-105"
                                : "border-border opacity-80 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 p-1 flex items-end">
                              <span className="text-[9px] text-white font-medium truncate">
                                {preset.name}
                              </span>
                            </div>
                            {coverImage === preset.url && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {coverMode === "custom" && (
                      <div className="space-y-2">
                        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                        <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover} className="gap-2 cursor-pointer">
                          {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                          {uploadingCover ? "Uploading..." : "Upload image"}
                        </Button>
                        {customImageUrl && <div className="h-28 rounded-lg overflow-hidden border border-border relative bg-muted"><img src={customImageUrl} alt="Cover preview" className="w-full h-full object-cover" /></div>}
                      </div>
                    )}
                    {coverMode === "gradient" && (
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
                    )}
                  </div>

                  {/* Content Writing Section with Formatting Toolbar */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <label className="text-sm font-semibold">Article Content *</label>
                    <BlogBlockEditor value={content} onChange={setContent} />
                  </div>

                  {/* Actions */}
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
                      className="cursor-pointer min-w-32"
                    >
                      {loadingAction ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : editingBlogId ? (
                        "Update Post"
                      ) : status === "published" ? (
                        "Publish Post"
                      ) : (
                        "Save Draft"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
