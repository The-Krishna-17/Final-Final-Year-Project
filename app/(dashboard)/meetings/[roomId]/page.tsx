"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMeetingById, deleteMeeting, updateMeeting } from "@/store/features/meetings/meetingSlice";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Users, Video, Trash2, Edit, Play } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MeetingDetailsPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { currentMeeting, loadingCurrent, errorCurrent } = useAppSelector(
    (state) => state.meetings
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorCurrent || !currentMeeting) {
    return (
      <div className="container mx-auto p-6 max-w-3xl text-center pt-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Meeting not found</h2>
        <p className="text-gray-500 mb-6">{errorCurrent || "This meeting doesn't exist or you don't have access."}</p>
        <Link href="/meetings">
          <Button>Back to Meetings</Button>
        </Link>
      </div>
    );
  }

  // host may be an unpopulated ID string if the action didn't populate it
  const isHostObject = typeof currentMeeting.host === "object" && currentMeeting.host !== null;
  const isHost = isHostObject
    ? (currentMeeting.host as any)._id === user?._id
    : (currentMeeting.host as any) === user?._id;
  const canJoin = currentMeeting.status === "scheduled" || currentMeeting.status === "ongoing";

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/meetings" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Meetings
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentMeeting.title}</h1>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  currentMeeting.status === "scheduled"
                    ? "bg-blue-100 text-blue-700"
                    : currentMeeting.status === "ongoing"
                    ? "bg-green-100 text-green-700"
                    : currentMeeting.status === "completed"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {currentMeeting.status}
              </span>
            </div>
            <p className="text-gray-500 flex items-center gap-2">
              <span className="font-medium">Room ID:</span> {currentMeeting.roomId}
            </p>
          </div>
          
          <div className="flex gap-3">
            {canJoin && (
              <Link href={`/meetings/${currentMeeting.roomId}/room`}>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <Play className="w-4 h-4" />
                  Join Room
                </Button>
              </Link>
            )}
            
            {isHost && currentMeeting.status === "scheduled" && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            
            {isHost && (
              <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {currentMeeting.description || "No description provided."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Host</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {typeof currentMeeting.host === "object" && currentMeeting.host !== null
                    ? (currentMeeting.host as any).firstName?.[0] ?? "?"
                    : "?"}
                </div>
                <div>
                  {typeof currentMeeting.host === "object" && currentMeeting.host !== null ? (
                    <>
                      <p className="font-medium">
                        {(currentMeeting.host as any).firstName} {(currentMeeting.host as any).lastName}
                      </p>
                      <p className="text-sm text-gray-500">{(currentMeeting.host as any).email}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Host info not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700 h-fit">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-200">Date</p>
                    <p className="text-gray-500">{format(new Date(currentMeeting.scheduledAt), "MMMM d, yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-200">Time</p>
                    <p className="text-gray-500">{format(new Date(currentMeeting.scheduledAt), "h:mm a")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-200">Participants</p>
                    <p className="text-gray-500">{currentMeeting.participants?.length || 0} joined</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
