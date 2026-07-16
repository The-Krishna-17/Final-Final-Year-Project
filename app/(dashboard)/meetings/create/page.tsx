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
  const { loadingAction, errorAction } = useAppSelector((state) => state.meetings);
  const { swapPartners, loadingPartners } = useAppSelector((state) => state.swaps);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePartner = (userId: string) => {
    setSelectedPartners((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
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
        })
      ).unwrap();
      toast.success("Meeting scheduled successfully!");
      router.push(`/meetings/${result.data.meeting.roomId}`);
    } catch {
      toast.error(errorAction || "Failed to schedule meeting");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/meetings"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Meetings
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Schedule Meeting
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Meeting Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="e.g. React + Python Skill Swap Session"
              required
            />
          </div>

          {/* Date & Time */}
          <div>
            <label
              htmlFor="scheduledAt"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Date &amp; Time <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="datetime-local"
              id="scheduledAt"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
              placeholder="What topics will you cover in this session?"
            />
          </div>

          {/* Invite Swap Partners */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Invite Swap Partner{" "}
                <span className="text-red-500">*</span>
              </label>
              {selectedPartners.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {selectedPartners.length} selected
                </Badge>
              )}
            </div>

            {loadingPartners ? (
              <div className="flex items-center justify-center py-10 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="text-sm">Loading your swap partners...</p>
                </div>
              </div>
            ) : swapPartners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 text-center px-4">
                <ArrowLeftRight className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No swap partners yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                  You can only invite users you&apos;ve completed a skill swap with. Go to{" "}
                  <Link
                    href="/matches"
                    className="text-primary underline underline-offset-2"
                  >
                    Matches
                  </Link>{" "}
                  to send swap requests.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {swapPartners.map((partner) => {
                  const isSelected = selectedPartners.includes(partner.user._id);
                  const fullName = `${partner.user.firstName} ${partner.user.lastName}`.trim();
                  const initials = `${partner.user.firstName?.[0] ?? ""}${partner.user.lastName?.[0] ?? ""}`.toUpperCase();

                  return (
                    <button
                      key={partner.swapId}
                      type="button"
                      onClick={() => togglePartner(partner.user._id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150 text-left ${
                        isSelected
                          ? "border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      }`}
                    >
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={partner.user.avatar} alt={fullName} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {fullName}
                        </p>
                        {(partner.offeredSkill || partner.wantedSkill) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
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
                            ? "border-primary bg-primary"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
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
                  const fullName = `${partner.user.firstName} ${partner.user.lastName}`.trim();
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                    >
                      {fullName}
                      <button
                        type="button"
                        onClick={() => togglePartner(id)}
                        className="hover:text-red-500 transition-colors"
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
              className="min-w-[140px]"
            >
              {loadingAction ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
