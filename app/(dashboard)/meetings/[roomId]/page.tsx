"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMeetingById,
  deleteMeeting,
  updateMeeting,
} from "@/store/features/meetings/meetingSlice";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Users, Trash2, Play } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Scheduled",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function MeetingDetailsPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { currentMeeting, loadingCurrent, errorCurrent } = useAppSelector(
    (state) => state.meetings,
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (roomId) {
      dispatch(fetchMeetingById(roomId));
    }
  }, [dispatch, roomId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await dispatch(deleteMeeting(roomId)).unwrap();
      toast.success("Meeting deleted");
      router.push("/meetings");
    } catch (err) {
      toast.error("Failed to delete meeting");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return;
    try {
      await dispatch(updateMeeting({ roomId, status: "cancelled" })).unwrap();
      toast.success("Meeting cancelled");
    } catch (err) {
      toast.error("Failed to cancel meeting");
    }
  };

  if (loadingCurrent) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-2 border-muted border-t-foreground animate-spin" />
      </div>
    );
  }

  if (errorCurrent || !currentMeeting) {
    return (
      <div className="container mx-auto max-w-3xl px-6 pt-24 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Meeting not found
        </h2>
        <p className="text-muted-foreground mb-8">
          {errorCurrent ||
            "This meeting doesn't exist or you don't have access."}
        </p>
        <Link href="/meetings">
          <Button>Back to meetings</Button>
        </Link>
      </div>
    );
  }

  // host may be an unpopulated ID string if the action didn't populate it
  const isHostObject =
    typeof currentMeeting.host === "object" && currentMeeting.host !== null;
  const isHost = isHostObject
    ? (currentMeeting.host as any)._id === user?._id
    : (currentMeeting.host as any) === user?._id;
  const canJoin =
    currentMeeting.status === "scheduled" ||
    currentMeeting.status === "ongoing";

  return (
    <div className="container mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/meetings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to meetings
      </Link>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                {currentMeeting.title}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border rounded-full px-2.5 py-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentMeeting.status === "ongoing"
                      ? "bg-success"
                      : currentMeeting.status === "cancelled"
                        ? "bg-danger"
                        : "bg-muted-foreground"
                  }`}
                />
                {STATUS_LABEL[currentMeeting.status] ?? currentMeeting.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Room ID{" "}
              <span className="text-foreground font-medium">
                {currentMeeting.roomId}
              </span>
            </p>
          </div>

          <div className="flex gap-2.5">
            {canJoin && (
              <Link href={`/meetings/${currentMeeting.roomId}/room`}>
                <Button className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Join room
                </Button>
              </Link>
            )}

            {isHost && currentMeeting.status === "scheduled" && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}

            {isHost && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-3">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {currentMeeting.description || "No description provided."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-3">
                Host
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                  {isHostObject
                    ? ((currentMeeting.host as any).firstName?.[0] ?? "?")
                    : "?"}
                </div>
                <div>
                  {isHostObject ? (
                    <>
                      <p className="text-sm font-medium text-foreground">
                        {(currentMeeting.host as any).firstName}{" "}
                        {(currentMeeting.host as any).lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(currentMeeting.host as any).email}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Host info not available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 border border-border rounded-xl p-6 h-fit space-y-5">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
              Details
            </h3>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(currentMeeting.scheduledAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Time</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(currentMeeting.scheduledAt), "h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Participants
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentMeeting.participants?.length || 0} joined
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
