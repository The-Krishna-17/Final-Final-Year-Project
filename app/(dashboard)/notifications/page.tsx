"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/store/features/notifications/notificationSlice";
import { AppNotification } from "@/store/features/notifications/type";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  ArrowLeftRight,
  Video,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { notifications, unreadCount, loading } = useAppSelector(
    (state) => state.notifications
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    dispatch(fetchNotifications({ unreadOnly: filter === "unread" }));
  }, [dispatch, filter]);

  const handleNotificationClick = (n: AppNotification) => {
    if (!n.isRead) {
      dispatch(markAsRead(n._id));
    }
    if (n.link) {
      router.push(n.link);
    }
  };

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "SWAP_REQUEST":
      case "SWAP_ACCEPTED":
      case "SWAP_REJECTED":
      case "SWAP_CANCELLED":
        return <ArrowLeftRight className="w-4 h-4 text-warning" />;
      case "MEETING_INVITATION":
      case "MEETING_STARTED":
      case "MEETING_UPDATED":
      case "MEETING_CANCELLED":
        return <Video className="w-4 h-4 text-info" />;
      case "NEW_MESSAGE":
        return <MessageSquare className="w-4 h-4 text-success" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with your skill swaps, meeting invites, messages, and platform activity.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(markAllAsRead())}
              className="gap-2 text-xs"
            >
              <CheckCheck className="w-4 h-4 text-success" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(clearAllNotifications())}
              className="gap-2 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <Tabs
          value={filter}
          onValueChange={(val) => setFilter(val as "all" | "unread")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-2 w-full sm:w-64">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-primary text-primary-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications Content */}
      {loading ? (
        <Card className="p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading notifications...</p>
        </Card>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-lg bg-muted/20 border-dashed mt-4">
          <BellOff className="text-4xl w-10 h-10 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-medium text-lg">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {filter === "unread"
              ? "You're all caught up! Check back later for new activity."
              : "When you receive swap requests, meeting invites, or messages, they will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={`transition-all duration-200 hover:border-primary/40 ${
                !n.isRead
                  ? "bg-background border-primary/20 shadow-xs"
                  : "bg-background/60 opacity-90"
              }`}
            >
              <CardContent className="p-4 flex items-start gap-4">
                {/* Sender Avatar / Icon */}
                <div className="relative shrink-0 mt-0.5">
                  {n.sender?.avatar ? (
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarImage src={n.sender.avatar} />
                      <AvatarFallback>
                        {n.sender.firstName?.[0]}
                        {n.sender.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                      {getNotificationIcon(n.type)}
                    </div>
                  )}

                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-background border border-border shadow-2xs">
                    {getNotificationIcon(n.type)}
                  </span>
                </div>

                {/* Main Content */}
                <div
                  onClick={() => handleNotificationClick(n)}
                  className="flex-1 min-w-0 cursor-pointer group"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground/70">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                    {n.link && (
                      <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View details
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Mark as read"
                      onClick={() => dispatch(markAsRead(n._id))}
                      className="h-8 w-8 text-muted-foreground hover:text-success"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete notification"
                    onClick={() => dispatch(deleteNotification(n._id))}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
