"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminReviews, deleteAdminReview } from "@/store/features/admin/adminSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  RiStarFill,
  RiStarLine,
  RiDeleteBinLine,
  RiShieldCheckLine,
} from "react-icons/ri";

export default function AdminReviewsPage() {
  const dispatch = useAppDispatch();
  const { reviews = [], loadingReviews } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminReviews());
  }, [dispatch]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await dispatch(deleteAdminReview(reviewId)).unwrap();
      toast.success("Review deleted successfully");
    } catch (err: any) {
      toast.error(err || "Failed to delete review");
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
                          <p className="text-foreground leading-relaxed italic">"{r.feedback}"</p>
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
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Delete Review"
                            onClick={() => handleDelete(r._id)}
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
    </div>
  );
}
