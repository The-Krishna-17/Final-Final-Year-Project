"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addNotification,
  fetchUnreadCount,
} from "@/store/features/notifications/notificationSlice";
import { AppNotification } from "@/store/features/notifications/type";
import {
  Bell,
  MessageSquare,
  ArrowLeftRight,
  Video,
  CheckCircle2,
} from "lucide-react";

export function NotificationListener() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch initial unread count on mount
    dispatch(fetchUnreadCount());

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    const socket = io(socketUrl, {
      path: "/socket.io/",
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("notification:new", (notification: AppNotification) => {
      dispatch(addNotification(notification));

      // Choose icon based on notification type
      let Icon = Bell;
      if (notification.type === "NEW_MESSAGE") Icon = MessageSquare;
      if (notification.type.startsWith("SWAP")) Icon = ArrowLeftRight;
      if (notification.type.startsWith("MEETING")) Icon = Video;

      toast.custom(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t);
              if (notification.link) {
                router.push(notification.link);
              }
            }}
            className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border shadow-xl cursor-pointer hover:border-primary/50 transition-colors max-w-sm w-full"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-foreground truncate">
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>
        ),
        { duration: 5000 },
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, dispatch, router]);

  return null;
}
