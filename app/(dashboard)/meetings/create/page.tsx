"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMeeting } from "@/store/features/meetings/meetingSlice";
import { fetchSwapPartners } from "@/store/features/swaps/swapSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Video,
  Loader2,
  Users,
  X,
  CheckCircle2,
  ArrowLeftRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function CreateMeetingPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loadingAction, errorAction } = useAppSelector(
    (state) => state.meetings,
  );
  const { swapPartners, loadingPartners } = useAppSelector(
    (state) => state.swaps,
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
  });
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchSwapPartners());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePartner = (userId: string) => {
    setSelectedPartners((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.scheduledAt) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (selectedPartners.length === 0) {
      toast.error("Please select at least one swap partner to invite");
      return;
    }

    try {
      const result = await dispatch(
        createMeeting({
          ...formData,
          invitedUsers: selectedPartners,
        }),
      ).unwrap();
      toast.success("Meeting scheduled successfully!");
      router.push(`/meetings/${result.data.meeting.roomId}`);
    } catch {
      toast.error(errorAction || "Failed to schedule meeting");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/meetings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to meetings
      </Link>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-3 rounded-xl text-secondary-foreground">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                Schedule meeting
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Invite users you&apos;ve already swapped skills with
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Meeting title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              placeholder="e.g. React + Python Skill Swap Session"
              required
            />
          </div>

          {/* Date & Time */}
          <div>
            <label
              htmlFor="scheduledAt"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Date &amp; time <span className="text-danger">*</span>
              </span>
            </label>
            <input
              type="datetime-local"
              id="scheduledAt"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              placeholder="What topics will you cover in this session?"
            />
          </div>

          {/* Invite Swap Partners */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">
                Invite swap partner <span className="text-danger">*</span>
              </label>
              {selectedPartners.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {selectedPartners.length} selected
                </Badge>
              )}
            </div>

            {loadingPartners ? (
              <div className="flex items-center justify-center py-10 border border-dashed border-border rounded-lg">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="text-sm">Loading your swap partners...</p>
                </div>
              </div>
            ) : swapPartners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border rounded-lg bg-muted/40 text-center px-4">
                <ArrowLeftRight className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">
                  No swap partners yet
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  You can only invite users you&apos;ve completed a skill swap
                  with. Go to{" "}
                  <Link
                    href="/matches"
                    className="text-foreground underline underline-offset-2"
                  >
                    Matches
                  </Link>{" "}
                  to send swap requests.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {swapPartners.map((partner) => {
                  const isSelected = selectedPartners.includes(
                    partner.user._id,
                  );
                  const fullName =
                    `${partner.user.firstName} ${partner.user.lastName}`.trim();
                  const initials =
                    `${partner.user.firstName?.[0] ?? ""}${partner.user.lastName?.[0] ?? ""}`.toUpperCase();

                  return (
                    <button
                      key={partner.swapId}
                      type="button"
                      onClick={() => togglePartner(partner.user._id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150 text-left ${
                        isSelected
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-foreground/30 hover:bg-secondary/50"
                      }`}
                    >
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={partner.user.avatar} alt={fullName} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {fullName}
                        </p>
                        {(partner.offeredSkill || partner.wantedSkill) && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            <span className="inline-flex items-center gap-1">
                              <ArrowLeftRight className="w-2.5 h-2.5" />
                              {partner.offeredSkill && partner.wantedSkill
                                ? `${partner.offeredSkill} ↔ ${partner.wantedSkill}`
                                : partner.offeredSkill || partner.wantedSkill}
                            </span>
                          </p>
                        )}
                      </div>

                      <div
                        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-foreground bg-foreground"
                            : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-background" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected chip list */}
            {selectedPartners.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedPartners.map((id) => {
                  const partner = swapPartners.find((p) => p.user._id === id);
                  if (!partner) return null;
                  const fullName =
                    `${partner.user.firstName} ${partner.user.lastName}`.trim();
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                    >
                      {fullName}
                      <button
                        type="button"
                        onClick={() => togglePartner(id)}
                        className="text-muted-foreground hover:text-danger transition-colors"
                        aria-label={`Remove ${fullName}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loadingAction}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loadingAction || swapPartners.length === 0}
              className="min-w-35"
            >
              {loadingAction ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Schedule meeting
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
