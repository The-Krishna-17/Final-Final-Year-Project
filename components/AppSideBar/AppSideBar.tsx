"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import { Button } from "../ui/button";
import { MdOutlineLogout } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/store/features/auth/authSlice";
import { NAV_ITEMS } from "@/constant/nav";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/utils/socketUrl";

export function AppSideBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { swaps, swapPartners } = useAppSelector((s) => s.swaps);
  const { user } = useAppSelector((s) => s.auth);
  const { meetings } = useAppSelector((s) => s.meetings);
  const { unreadCount } = useAppSelector((s) => s.notifications);
  const path = usePathname();

  const [unreadMessages, setUnreadMessages] = useState(0);

  const pendingReceived = swaps.filter(
    (s) => s.status === "pending" && (s.recipient as any)?._id === user?._id,
  ).length;

  const upcomingMeetings = meetings.filter(
    (m) => m.status === "scheduled" || m.status === "ongoing",
  ).length;

  // Fetch initial unread message count
  useEffect(() => {
    axiosInstance
      .get("/messages/unread-count")
      .then((res) => setUnreadMessages(res.data.data.unreadCount))
      .catch(() => {}); // silently fail — sidebar badge is non-critical
  }, []);

  // Clear unread messages when user visits /messages
  useEffect(() => {
    if (path === "/messages") {
      setUnreadMessages(0);
    }
  }, [path]);

  // Real-time unread count updates via socket
  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, { path: "/socket.io/", withCredentials: true },
    );

    socket.on("messages:unread-count", ({ unreadCount }: { unreadCount: number }) => {
      // Only update if user is NOT currently on the messages page
      if (path !== "/messages") {
        setUnreadMessages(unreadCount);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, path]);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="max-w-20 block">
          <Image src={lightLogo} alt="logo" className="dark:hidden" />
          <Image src={darkLogo} alt="logo" className="hidden dark:block" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 mt-4">
              {NAV_ITEMS({
                pendingReceived,
                swapPartnersCount: swapPartners.length,
                upcomingMeetings,
                unreadNotifications: unreadCount,
                unreadMessages,
              }).map(({ href, icon: Icon, label, badge, badgeColor }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={href}
                      className={`flex items-center justify-between w-full ${path === href ? "text-primary" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon />
                        <span className="text-base">{label}</span>
                      </span>
                      {badge != null && (
                        <span
                          className={`ml-auto inline-flex items-center justify-center min-w-4.5 h-4.5 text-[10px] font-bold rounded-full ${badgeColor} text-white px-1`}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          onClick={() => handleLogout()}
          variant="ghost"
          className="w-full flex items-center justify-start text-base text-red-500 mb-4 hover:text-red-600  cursor-pointer"
        >
          <MdOutlineLogout /> Logout
        </Button>{" "}
      </SidebarFooter>
    </Sidebar>
  );
}
