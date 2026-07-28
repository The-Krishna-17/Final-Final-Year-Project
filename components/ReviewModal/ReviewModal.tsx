import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { axiosInstance } from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SwapUser } from "@/store/features/swaps/type";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerUser: SwapUser | null;
  swapId: string | null;
}

export function ReviewModal({
  isOpen,
  onClose,
  partnerUser,
  swapId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please provide a rating");
      return;
    }
    if (!feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post("/reviews", {
        revieweeId: partnerUser?._id,
        skillSwapId: swapId,
        rating,
        feedback,
      });
      toast.success("Review submitted successfully");
      onClose();
      // Reset state
      setRating(0);
      setHoverRating(0);
      setFeedback("");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!partnerUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review {partnerUser.firstName}</DialogTitle>
          <DialogDescription>
            Share your experience to help others build trust in the community.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-3xl text-yellow-400 transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                {star <= (hoverRating || rating) ? (
                  <RiStarFill />
                ) : (
                  <RiStarLine className="text-gray-300" />
                )}
              </button>
            ))}
          </div>

          <Textarea
            placeholder="What was it like swapping skills with them?"
            className="min-h-30 resize-none"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
