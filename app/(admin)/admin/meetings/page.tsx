"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminMeetings } from "@/store/features/admin/adminSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import {
  RiVideoChatLine,
  RiCalendarEventLine,
  RiGroupLine,
} from "react-icons/ri";

export default function AdminMeetingsPage() {
  const dispatch = useAppDispatch();
  const { meetings = [], loadingMeetings } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminMeetings());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <RiVideoChatLine className="text-purple-500" />
          Video Meetings & Call Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Audit Jitsi video conferencing rooms, meeting schedules, active sessions, and attendance metrics.
        </p>
      </div>

      {/* Meetings Table */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          {loadingMeetings ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Fetching video meeting logs...</p>
            </div>
          ) : !meetings || meetings.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-sm">No meeting logs found</p>
              <p className="text-xs">No video sessions have been scheduled yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Meeting Title</th>
                    <th className="px-4 py-3">Host</th>
                    <th className="px-4 py-3">Room ID</th>
                    <th className="px-4 py-3">Participants</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Scheduled Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {meetings.map((m) => {
                    const hostName = `${m.host?.firstName} ${m.host?.lastName}`.trim();

                    return (
                      <tr key={m._id} className="hover:bg-muted/20 transition-colors">
                        {/* Title */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground leading-tight">{m.title}</p>
                          {m.description && (
                            <p className="text-[10px] text-muted-foreground truncate max-w-xs">{m.description}</p>
                          )}
                        </td>

                        {/* Host */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 border border-border">
                              <AvatarImage src={m.host?.avatar} />
                              <AvatarFallback className="text-[10px] font-bold">
                                {m.host?.firstName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground leading-tight">{hostName}</p>
                              <p className="text-[10px] text-muted-foreground">{m.host?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Room ID */}
                        <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                          {m.roomId}
                        </td>

                        {/* Participants Count */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <RiGroupLine className="text-sm" />
                            <span>{(m.participants || []).length} participants</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-bold ${
                              m.status === "ongoing"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : m.status === "completed"
                                ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                                : m.status === "scheduled"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }`}
                          >
                            {m.status}
                          </Badge>
                        </td>

                        {/* Scheduled Time */}
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(m.scheduledAt).toLocaleString()}
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
