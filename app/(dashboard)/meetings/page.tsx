"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMeetings } from "@/store/features/meetings/meetingSlice";
import { Meeting } from "@/store/features/meetings/type";
import Link from "next/link";
import { format, isToday, isFuture, isPast } from "date-fns";
import { Video, Plus, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeetingsPage() {
  const dispatch = useAppDispatch();
  const { meetings, loadingMeetings } = useAppSelector((state) => state.meetings);
  const [filter, setFilter] = useState<"upcoming" | "past" | "today">("upcoming");

  useEffect(() => {
    dispatch(fetchMeetings());
  }, [dispatch]);

  const filteredMeetings = meetings.filter((meeting) => {
    const scheduled = new Date(meeting.scheduledAt);
    if (filter === "upcoming") return isFuture(scheduled) && !isToday(scheduled);
    if (filter === "today") return isToday(scheduled);
    if (filter === "past") return isPast(scheduled) && !isToday(scheduled);
    return true;
  });

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meetings</h1>
          <p className="text-gray-500 mt-2">Manage your video conferences</p>
        </div>
        <Link href="/meetings/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Meeting
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-2">
        {(["today", "upcoming", "past"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 px-1 capitalize font-medium text-sm transition-colors relative ${
              filter === f
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f} Meetings
          </button>
        ))}
      </div>

      {loadingMeetings ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed">
          <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No {filter} meetings</h3>
          <p className="text-gray-500 mt-1">You don't have any {filter} meetings right now.</p>
          {filter !== "past" && (
            <Link href="/meetings/create">
              <Button variant="outline" className="mt-4">
                Schedule a Meeting
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting._id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const scheduledDate = new Date(meeting.scheduledAt);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg line-clamp-1">{meeting.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            meeting.status === "scheduled"
              ? "bg-blue-100 text-blue-700"
              : meeting.status === "ongoing"
              ? "bg-green-100 text-green-700"
              : meeting.status === "completed"
              ? "bg-gray-100 text-gray-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {meeting.status}
        </span>
      </div>

      {meeting.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
          {meeting.description}
        </p>
      )}

      <div className="space-y-2 mt-auto">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 mr-2 opacity-70" />
          {format(scheduledDate, "MMM d, yyyy")}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 mr-2 opacity-70" />
          {format(scheduledDate, "h:mm a")}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Users className="w-4 h-4 mr-2 opacity-70" />
          {meeting.participants?.length || 0} Participants
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
        <Link href={`/meetings/${meeting.roomId}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Details
          </Button>
        </Link>
        {(meeting.status === "scheduled" || meeting.status === "ongoing") && (
          <Link href={`/meetings/${meeting.roomId}/room`} className="flex-1">
            <Button className="w-full">Join</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
