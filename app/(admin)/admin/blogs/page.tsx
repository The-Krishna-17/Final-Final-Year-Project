"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminBlogs,
  updateBlogAction,
  deleteBlogAction,
} from "@/store/features/blogs/blogSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Edit,
  Trash2,
  Eye,
  Heart,
  Tag,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { BlogItem } from "@/store/features/blogs/type";
import {
  BlogCoverBanner,
  BlogContentRenderer,
} from "@/components/Blog/BlogRenderer";

const STATUS_OPTIONS = ["all", "published", "draft"];

export default function AdminBlogsPage() {
  const dispatch = useAppDispatch();
  const { adminBlogs, loadingAdminBlogs, loadingAction } = useAppSelector(
    (s) => s.blogs,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialogs
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    dispatch(fetchAdminBlogs());
  }, [dispatch]);

  const handleView = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setDeleteReason("");
    setIsDeleteOpen(true);
  };

  const handleStatusToggle = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setIsStatusOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;
    if (!deleteReason.trim()) {
      toast.error("Please provide a valid reason for deletion.");
      return;
    }
    try {
      await dispatch(
        deleteBlogAction({ id: selectedBlog._id, reason: deleteReason.trim() }),
      ).unwrap();
      toast.success("Blog deleted successfully.");
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(err || "Failed to delete blog.");
    }
  };

  const handleStatusConfirm = async () => {
    if (!selectedBlog) return;
    try {
      await dispatch(
        updateBlogAction({
          id: selectedBlog._id,
          title: selectedBlog.title,
          content: selectedBlog.content,
          status: selectedBlog.status === "published" ? "draft" : "published",
        }),
      ).unwrap();
      toast.success(
        `Blog ${
          selectedBlog.status === "published"
            ? "unpublished (set to draft)"
            : "published"
        } successfully.`,
      );
      setIsStatusOpen(false);
    } catch (err: any) {
      toast.error(err || "Failed to update status.");
    }
  };

  const filteredBlogs = adminBlogs.filter((blog) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      blog.title.toLowerCase().includes(q) ||
      blog.author?.fullName?.toLowerCase().includes(q) ||
      blog.tags?.some((t) => t.toLowerCase().includes(q));
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="text-primary" />
            Blog Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            View, moderate, and manage all blog posts submitted by workspace
            members.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base" />
          <Input
            placeholder="Search by title, author, or tag..."
            className="pl-9 h-9 text-xs bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-hidden cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all"
                ? "All Statuses"
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Blogs Table */}
      <Card className="border-border overflow-hidden bg-card">
        <CardContent className="p-0">
          {loadingAdminBlogs ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Fetching blogs...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-sm">No blogs found</p>
              <p className="text-xs">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Title & Author</th>
                    <th className="px-4 py-3">Category & Tags</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Stats</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBlogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-sm text-foreground leading-tight line-clamp-1">
                            {blog.title}
                          </p>
                          {blog.subtitle && (
                            <p className="text-muted-foreground text-[10px] italic line-clamp-1 mt-0.5">
                              {blog.subtitle}
                            </p>
                          )}
                          <p className="text-muted-foreground text-[11px] font-medium flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3" />{" "}
                            {blog.author?.fullName || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {blog.category && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-semibold block w-fit"
                            >
                              {blog.category}
                            </Badge>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {blog.tags?.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px] font-semibold"
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {(blog.tags?.length || 0) > 2 && (
                              <Badge
                                variant="secondary"
                                className="text-[9px] font-semibold"
                              >
                                +{(blog.tags?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleStatusToggle(blog)}
                          className="cursor-pointer"
                        >
                          {blog.status === "published" ? (
                            <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer">
                              Published
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground cursor-pointer hover:bg-muted/50"
                            >
                              Draft
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {blog.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />{" "}
                            {blog.likes?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => handleView(blog)}
                            title="View Blog"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                            onClick={() => handleDeleteClick(blog)}
                            title="Delete Blog"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Blog Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBlog?.title}</DialogTitle>
            <DialogDescription>
              By {selectedBlog?.author?.fullName || "Unknown"} &middot;{" "}
              {selectedBlog &&
                new Date(selectedBlog.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedBlog && (
            <div className="space-y-4 py-2">
              {/* Cover Banner */}
              <BlogCoverBanner
                coverImage={selectedBlog.coverImage}
                category={selectedBlog.category}
                heightClass="h-40"
                className="rounded-xl"
              />

              {/* Subtitle */}
              {selectedBlog.subtitle && (
                <p className="text-sm text-muted-foreground italic border-l-4 border-primary pl-3 py-1 bg-primary/5 rounded-r-lg">
                  {selectedBlog.subtitle}
                </p>
              )}

              {/* Tags */}
              {selectedBlog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedBlog.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] font-semibold"
                    >
                      <Tag className="w-2.5 h-2.5 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Formatted Content */}
              <div className="pt-2 border-t border-border">
                <BlogContentRenderer content={selectedBlog.content} />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {selectedBlog.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />{" "}
                  {selectedBlog.likes?.length || 0} likes
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Toggle Confirmation */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" /> Change Status
            </DialogTitle>
            <DialogDescription className="text-sm">
              {selectedBlog?.status === "published"
                ? `Unpublish "${selectedBlog?.title}"? It will be set back to draft and hidden from the public feed.`
                : `Publish "${selectedBlog?.title}"? It will be visible to all workspace members.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatusOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleStatusConfirm}
              disabled={loadingAction}
              className="cursor-pointer"
            >
              {loadingAction ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : selectedBlog?.status === "published" ? (
                "Unpublish"
              ) : (
                "Publish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete the blog{" "}
              <strong>&quot;{selectedBlog?.title}&quot;</strong>? This action is
              permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Reason for Deletion *
            </label>
            <Textarea
              placeholder="Provide a valid reason for deleting this blog post..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="min-h-20 text-sm"
            />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              className="cursor-pointer"
            >
              Yes, Delete Blog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
