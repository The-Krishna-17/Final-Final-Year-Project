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
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { notifications, unreadCount, loading } = useAppSelector(
    (state) => state.notifications,
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
      case "ADMIN_USER_DELETED":
      case "ADMIN_REVIEW_DELETED":
      case "ADMIN_JOB_DELETED":
      case "ADMIN_BLOG_DELETED":
        return <ShieldAlert className="w-4 h-4 text-destructive" />;
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
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-[11px] font-bold rounded-full bg-primary text-primary-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Stay updated with your skill swaps, meetings, and messages.
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
              <CheckCheck className="w-4 h-4" />
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
      <Tabs
        value={filter}
        onValueChange={(val) => setFilter(val as "all" | "unread")}
      >
        <TabsList variant="line" className="flex items-center gap-4 mb-8">
          <TabsTrigger value="all" className="cursor-pointer">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="cursor-pointer gap-2">
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Notifications Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-muted border-t-foreground animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-secondary/40 rounded-2xl border border-dashed border-border">
            <BellOff className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base font-medium text-foreground">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === "unread"
                ? "You're all caught up! Check back later for new activity."
                : "When you receive swap requests, meeting invites, or messages, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-all duration-200 hover:border-primary/40 bg-card ${
                  !n.isRead ? "border-primary/20" : "border-border opacity-90"
                }`}
              >
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
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-background border border-border">
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
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
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
              </div>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
}
