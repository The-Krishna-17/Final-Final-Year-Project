"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminReviews, deleteAdminReview } from "@/store/features/admin/adminSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  RiStarFill,
  RiStarLine,
  RiDeleteBinLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { AdminReview } from "@/store/features/admin/adminType";

export default function AdminReviewsPage() {
  const dispatch = useAppDispatch();
  const { reviews = [], loadingReviews } = useAppSelector((s) => s.admin);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminReviews());
  }, [dispatch]);

  const handleDeleteClick = (review: AdminReview) => {
    setSelectedReview(review);
    setDeleteReason("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    if (!deleteReason.trim()) {
      toast.error("Please provide a valid reason for deletion.");
      return;
    }
    setDeleteLoading(true);
    try {
      await dispatch(deleteAdminReview({ reviewId: selectedReview._id, reason: deleteReason.trim() })).unwrap();
      toast.success("Review deleted successfully");
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(err || "Failed to delete review");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <RiStarFill className="text-yellow-500" />
          Review & Content Moderation
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Audit user feedback, 1–5 star ratings, and remove inappropriate or abusive review entries.
        </p>
      </div>

      {/* Reviews Table */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          {loadingReviews ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Fetching review records...</p>
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-sm">No reviews found</p>
              <p className="text-xs">No feedback has been submitted on the platform yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Reviewer</th>
                    <th className="px-4 py-3">Reviewee (Partner)</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Feedback Content</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviews.map((r) => {
                    const reviewerName = `${r.reviewer?.firstName} ${r.reviewer?.lastName}`.trim();
                    const revieweeName = `${r.reviewee?.firstName} ${r.reviewee?.lastName}`.trim();

                    return (
                      <tr key={r._id} className="hover:bg-muted/20 transition-colors">
                        {/* Reviewer */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarImage src={r.reviewer?.avatar} />
                              <AvatarFallback className="text-[10px] font-bold">
                                {r.reviewer?.firstName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground leading-tight">{reviewerName}</p>
                              <p className="text-[10px] text-muted-foreground">{r.reviewer?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Reviewee */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarImage src={r.reviewee?.avatar} />
                              <AvatarFallback className="text-[10px] font-bold">
                                {r.reviewee?.firstName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground leading-tight">{revieweeName}</p>
                              <p className="text-[10px] text-muted-foreground">{r.reviewee?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Rating Stars */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-0.5 text-yellow-500 text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star}>
                                {star <= r.rating ? <RiStarFill /> : <RiStarLine className="text-muted-foreground/40" />}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Feedback text */}
                        <td className="px-4 py-3 max-w-sm">
                          <p className="text-foreground leading-relaxed italic">&quot;{r.feedback}&quot;</p>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>

                        {/* Delete Action */}
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Delete Review"
                            onClick={() => handleDeleteClick(r)}
                          >
                            <RiDeleteBinLine />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RiDeleteBinLine className="w-5 h-5 text-red-500" /> Delete Review
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this review? This action is permanent and cannot be undone. Both the reviewer and reviewee will be notified.
            </DialogDescription>
          </DialogHeader>

          {/* Review preview */}
          {selectedReview && (
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {selectedReview.reviewer?.firstName} {selectedReview.reviewer?.lastName}
                </span>
                <RiStarFill className="w-3 h-3 text-yellow-500" />
                <span>{selectedReview.rating}/5</span>
                <span>&rarr;</span>
                <span className="font-semibold text-foreground">
                  {selectedReview.reviewee?.firstName} {selectedReview.reviewee?.lastName}
                </span>
              </div>
              <p className="text-xs italic text-muted-foreground">&quot;{selectedReview.feedback}&quot;</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Reason for Deletion *
            </label>
            <Textarea
              placeholder="Provide a valid reason for deleting this review..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)} className="cursor-pointer" disabled={deleteLoading}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteConfirm} className="cursor-pointer" disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
