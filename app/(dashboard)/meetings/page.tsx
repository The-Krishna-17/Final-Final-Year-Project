"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "@/store/features/meetings/meetingSlice";
import { fetchSwapPartners } from "@/store/features/swaps/swapSlice";
import { Meeting } from "@/store/features/meetings/type";
import Link from "next/link";
import { format, isToday, isFuture, isPast } from "date-fns";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  ArrowLeftRight,
  CheckCircle2,
  X,
  Trash2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Scheduled",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function MeetingsPage() {
  const dispatch = useAppDispatch();
  const { meetings, loadingMeetings, loadingAction } = useAppSelector(
    (state) => state.meetings,
  );
  const { user } = useAppSelector((state) => state.auth);
  const { swapPartners, loadingPartners } = useAppSelector(
    (state) => state.swaps,
  );

  const [filter, setFilter] = useState<"upcoming" | "past" | "today">(
    "upcoming",
  );

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: "delete" | "cancel" | null;
    roomId: string | null;
  }>({ isOpen: false, action: null, roomId: null });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
  });
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  const activeSwapPartners = swapPartners.filter(
    (p) => p.status !== "completed",
  );

  useEffect(() => {
    dispatch(fetchMeetings());
    dispatch(fetchSwapPartners());
  }, [dispatch]);

  const upcomingCount = meetings.filter((m) => {
    const scheduled = new Date(m.scheduledAt);
    return isFuture(scheduled) && !isToday(scheduled);
  }).length;

  const todayCount = meetings.filter((m) =>
    isToday(new Date(m.scheduledAt)),
  ).length;

  const pastCount = meetings.filter((m) => {
    const scheduled = new Date(m.scheduledAt);
    return isPast(scheduled) && !isToday(scheduled);
  }).length;

  const filteredMeetings = meetings.filter((meeting) => {
    const scheduled = new Date(meeting.scheduledAt);
    if (filter === "upcoming")
      return isFuture(scheduled) && !isToday(scheduled);
    if (filter === "today") return isToday(scheduled);
    if (filter === "past") return isPast(scheduled) && !isToday(scheduled);
    return true;
  });

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

  const handleCreateSubmit = async (e: React.FormEvent) => {
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
      await dispatch(
        createMeeting({
          ...formData,
          invitedUsers: selectedPartners,
        }),
      ).unwrap();
      toast.success("Meeting scheduled successfully!");
      setIsCreateOpen(false);
      setFormData({ title: "", description: "", scheduledAt: "" });
      setSelectedPartners([]);
    } catch (err: any) {
      toast.error(err || "Failed to schedule meeting");
    }
  };

  const handleDeleteClick = (roomId: string) => {
    setConfirmDialog({ isOpen: true, action: "delete", roomId });
  };

  const handleCancelClick = (roomId: string) => {
    setConfirmDialog({ isOpen: true, action: "cancel", roomId });
  };

  const executeConfirmAction = async () => {
    if (!confirmDialog.roomId || !confirmDialog.action) return;

    const { roomId, action } = confirmDialog;
    setConfirmDialog({ isOpen: false, action: null, roomId: null });

    if (action === "delete") {
      try {
        await dispatch(deleteMeeting(roomId)).unwrap();
        toast.success("Meeting deleted");
        setSelectedMeeting(null);
      } catch (err: any) {
        toast.error(err || "Failed to delete meeting");
      }
    } else if (action === "cancel") {
      try {
        await dispatch(updateMeeting({ roomId, status: "cancelled" })).unwrap();
        toast.success("Meeting cancelled");
        setSelectedMeeting(null);
      } catch (err: any) {
        toast.error(err || "Failed to cancel meeting");
      }
    }
  };

  const isHostObject = (meeting: Meeting) =>
    typeof meeting.host === "object" && meeting.host !== null;

  const isHost = (meeting: Meeting) => {
    return isHostObject(meeting)
      ? (meeting.host as any)._id === user?._id
      : (meeting.host as any) === user?._id;
  };

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
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New meeting
        </Button>
      </div>

      <Tabs value={filter} onValueChange={(val) => setFilter(val as any)}>
        <TabsList variant="line" className="flex items-center gap-4 mb-8">
          <TabsTrigger value="today" className="cursor-pointer gap-2">
            Today
            {todayCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {todayCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="cursor-pointer gap-2">
            Upcoming
            {upcomingCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {upcomingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="cursor-pointer gap-2">
            Past
            {pastCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {pastCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-0">
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
                <Button
                  variant="outline"
                  className="mt-5 px-4"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Schedule a meeting
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMeetings.map((meeting) => {
                const scheduledDate = new Date(meeting.scheduledAt);
                const canJoin =
                  (meeting.status === "scheduled" ||
                    meeting.status === "ongoing") &&
                  scheduledDate.getTime() + 24 * 60 * 60 * 1000 > Date.now();

                return (
                  <div
                    key={meeting._id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-shadow duration-200 hover:shadow-md h-full"
                  >
                    {/* Ledger header strip */}
                    <div className="flex items-center justify-between border-b border-dashed border-border bg-muted/50 px-4 py-2">
                      <span className="text-[10px] font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                        Video Meeting
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isHost(meeting) && (
                          <button
                            onClick={() => handleDeleteClick(meeting.roomId)}
                            className="text-muted-foreground cursor-pointer hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                            title="Delete meeting"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              meeting.status === "ongoing"
                                ? "bg-green-600"
                                : meeting.status === "cancelled"
                                  ? "bg-red-600"
                                  : "bg-muted-foreground"
                            }`}
                          />
                          {STATUS_LABEL[meeting.status] ?? meeting.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 px-4 py-4">
                      <h3 className="font-semibold text-base leading-tight line-clamp-1 mb-2">
                        {meeting.title}
                      </h3>

                      {meeting.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                          {meeting.description}
                        </p>
                      )}

                      <div className="space-y-1.5 mt-auto pb-4">
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Calendar className="h-3 w-3 text-primary" />
                          </span>
                          <span className="truncate text-foreground">
                            {format(scheduledDate, "MMM d, yyyy")} at {format(scheduledDate, "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                            <Users className="h-3 w-3 text-secondary-foreground" />
                          </span>
                          <span className="truncate text-foreground">
                            {meeting.participants?.length || 0} participant{meeting.participants?.length !== 1 && "s"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-dashed border-border pt-3 mt-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs rounded-lg"
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          Details
                        </Button>
                        {canJoin && (
                          <Link
                            href={`/meetings/${meeting.roomId}/room`}
                            className="flex-1"
                          >
                            <Button size="sm" className="w-full h-8 text-xs rounded-lg gap-1.5">
                              <Play className="w-3 h-3 fill-current" />
                              Join
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Meeting Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-muted-foreground" /> Schedule
              meeting
            </DialogTitle>
            <DialogDescription>
              Invite users you&apos;ve already swapped skills with.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-6 mt-4">
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
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g. React + Python Skill Swap Session"
                required
              />
            </div>

            <div>
              <label
                htmlFor="scheduledAt"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Date &amp; time{" "}
                  <span className="text-danger">*</span>
                </span>
              </label>
              <input
                type="datetime-local"
                id="scheduledAt"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

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
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="What topics will you cover in this session?"
              />
            </div>

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
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : activeSwapPartners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 border border-dashed border-border rounded-lg bg-muted/40 text-center px-4">
                  <ArrowLeftRight className="w-6 h-6 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    No active swap partners
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can only invite users you have an active skill swap
                    with.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeSwapPartners.map((partner) => {
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
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all text-left ${
                          isSelected
                            ? "border-foreground bg-secondary"
                            : "border-border hover:border-foreground/30 hover:bg-secondary/50"
                        }`}
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarImage
                            src={partner.user.avatar}
                            alt={fullName}
                          />
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px] font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {fullName}
                          </p>
                          {(partner.offeredSkill || partner.wantedSkill) && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              {partner.offeredSkill && partner.wantedSkill
                                ? `${partner.offeredSkill} ↔ ${partner.wantedSkill}`
                                : partner.offeredSkill || partner.wantedSkill}
                            </p>
                          )}
                        </div>
                        <div
                          className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "border-foreground bg-foreground"
                              : "border-border"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-2.5 h-2.5 text-background" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedPartners.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedPartners.map((id) => {
                    const partner = activeSwapPartners.find(
                      (p) => p.user._id === id,
                    );
                    if (!partner) return null;
                    const fullName =
                      `${partner.user.firstName} ${partner.user.lastName}`.trim();
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                      >
                        {fullName}
                        <button
                          type="button"
                          onClick={() => togglePartner(id)}
                          className="text-muted-foreground hover:text-danger"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={loadingAction}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loadingAction || activeSwapPartners.length === 0}
                className="min-w-32"
              >
                {loadingAction ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Video className="w-4 h-4 mr-2" />
                )}
                Schedule
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedMeeting}
        onOpenChange={(open) => !open && setSelectedMeeting(null)}
      >
        {selectedMeeting && (
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl">
                  {selectedMeeting.title}
                </DialogTitle>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedMeeting.status === "ongoing"
                        ? "bg-success"
                        : selectedMeeting.status === "cancelled"
                          ? "bg-danger"
                          : "bg-muted-foreground"
                    }`}
                  />
                  {STATUS_LABEL[selectedMeeting.status] ??
                    selectedMeeting.status}
                </span>
              </div>
              <DialogDescription>
                Room ID: {selectedMeeting.roomId}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-foreground uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMeeting.description || "No description provided."}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-foreground uppercase tracking-wider mb-2">
                    Host
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-medium">
                      {isHostObject(selectedMeeting)
                        ? ((selectedMeeting.host as any).firstName?.[0] ?? "?")
                        : "?"}
                    </div>
                    <div>
                      {isHostObject(selectedMeeting) ? (
                        <>
                          <p className="text-sm font-medium text-foreground">
                            {(selectedMeeting.host as any).firstName}{" "}
                            {(selectedMeeting.host as any).lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedMeeting.host as any).email}
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

              <div className="bg-secondary/50 border border-border rounded-xl p-4 h-fit space-y-4">
                <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">
                  Details
                </h3>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Date</p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(selectedMeeting.scheduledAt),
                        "MMMM d, yyyy",
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Time</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(selectedMeeting.scheduledAt), "h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Participants
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedMeeting.participants?.length || 0} joined
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
              <div className="flex gap-2">
                {isHost(selectedMeeting) &&
                  selectedMeeting.status === "scheduled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelClick(selectedMeeting.roomId)}
                    >
                      Cancel
                    </Button>
                  )}
                {isHost(selectedMeeting) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(selectedMeeting.roomId)}
                    className="flex items-center gap-1.5 cursor-pointer text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedMeeting(null)}
                >
                  Close
                </Button>
                {(selectedMeeting.status === "scheduled" ||
                  selectedMeeting.status === "ongoing") &&
                  new Date(selectedMeeting.scheduledAt).getTime() +
                    24 * 60 * 60 * 1000 >
                    Date.now() && (
                    <Link href={`/meetings/${selectedMeeting.roomId}/room`}>
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" /> Join room
                      </Button>
                    </Link>
                  )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({ isOpen: false, action: null, roomId: null })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "delete"
                ? "Delete Meeting"
                : "Cancel Meeting"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "delete"
                ? "Are you sure you want to permanently delete this meeting? This action cannot be undone."
                : "Are you sure you want to cancel this meeting? Participants will see it as cancelled."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ isOpen: false, action: null, roomId: null })
              }
            >
              No, go back
            </Button>
            <Button
              variant={
                confirmDialog.action === "delete" ? "destructive" : "default"
              }
              onClick={executeConfirmAction}
            >
              Yes, {confirmDialog.action === "delete" ? "delete" : "cancel"}{" "}
              meeting
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
