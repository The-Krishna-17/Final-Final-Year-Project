"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMeetings } from "@/store/features/meetings/meetingSlice";
import { Meeting } from "@/store/features/meetings/type";
import Link from "next/link";
import { format, isToday, isFuture, isPast } from "date-fns";
import { Video, Plus, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Scheduled",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function MeetingsPage() {
  const dispatch = useAppDispatch();
  const { meetings, loadingMeetings } = useAppSelector(
    (state) => state.meetings,
  );
  const [filter, setFilter] = useState<"upcoming" | "past" | "today">(
    "upcoming",
  );

  useEffect(() => {
    dispatch(fetchMeetings());
  }, [dispatch]);

  const filteredMeetings = meetings.filter((meeting) => {
    const scheduled = new Date(meeting.scheduledAt);
    if (filter === "upcoming")
      return isFuture(scheduled) && !isToday(scheduled);
    if (filter === "today") return isToday(scheduled);
    if (filter === "past") return isPast(scheduled) && !isToday(scheduled);
    return true;
  });

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Meetings
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Manage your video conferences
          </p>
        </div>
        <Link href="/meetings/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New meeting
          </Button>
        </Link>
      </div>

      <div className="flex gap-6 mb-8 border-b border-border">
        {(["today", "upcoming", "past"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-3 px-0.5 capitalize font-medium text-sm transition-colors relative -mb-px border-b-2 ${
              filter === f
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {f} meetings
          </button>
        ))}
      </div>

      {loadingMeetings ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-muted border-t-foreground animate-spin" />
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-20 bg-secondary/40 rounded-2xl border border-dashed border-border">
          <Video className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-base font-medium text-foreground">
            No {filter} meetings
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You don&apos;t have any {filter} meetings right now.
          </p>
          {filter !== "past" && (
            <Link href="/meetings/create">
              <Button variant="outline" className="mt-5">
                Schedule a meeting
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col h-full hover:border-foreground/20 transition-colors">
      <div className="flex justify-between items-start gap-3 mb-4">
        <h3 className="font-medium text-foreground text-base line-clamp-1">
          {meeting.title}
        </h3>
        <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border rounded-full px-2.5 py-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              meeting.status === "ongoing"
                ? "bg-success"
                : meeting.status === "cancelled"
                  ? "bg-danger"
                  : "bg-muted-foreground"
            }`}
          />
          {STATUS_LABEL[meeting.status] ?? meeting.status}
        </span>
      </div>

      {meeting.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 grow">
          {meeting.description}
        </p>
      )}

      <div className="space-y-2 mt-auto text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 shrink-0" />
          {format(scheduledDate, "MMM d, yyyy")}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0" />
          {format(scheduledDate, "h:mm a")}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 shrink-0" />
          {meeting.participants?.length || 0} participants
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex gap-2.5">
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
