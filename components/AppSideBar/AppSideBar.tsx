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
import {
  LayoutDashboard,
  Brain,
  Users,
  Calendar,
  MessageSquare,
  User,
  Wallet,
  Video,
  ArrowLeftRight,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import { Button } from "../ui/button";
import { MdOutlineLogout } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/store/features/auth/authSlice";

export function AppSideBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { swaps, swapPartners } = useAppSelector((s) => s.swaps);
  const { user } = useAppSelector((s) => s.auth);
  const { meetings } = useAppSelector((s) => s.meetings);

  const pendingReceived = swaps.filter(
    (s) => s.status === "pending" && (s.recipient as any)?._id === user?._id
  ).length;

  const upcomingMeetings = meetings.filter(
    (m) => m.status === "scheduled" || m.status === "ongoing"
  ).length;

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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span className="text-base">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/my-skills">
                    <Brain />
                    <span className="text-base">My Skills</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/matches">
                    <Users />
                    <span className="text-base">Matches</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/requests" className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <ArrowLeftRight />
                      <span className="text-base">Requests</span>
                    </span>
                    {pendingReceived > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-amber-500 text-white px-1">
                        {pendingReceived}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/connections" className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <UserCheck />
                      <span className="text-base">Connections</span>
                    </span>
                    {swapPartners.length > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-emerald-500 text-white px-1">
                        {swapPartners.length}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/sessions">
                    <Calendar />
                    <span className="text-base">Sessions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/meetings" className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <Video />
                      <span className="text-base">Meetings</span>
                    </span>
                    {upcomingMeetings > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-blue-500 text-white px-1">
                        {upcomingMeetings}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/messages">
                    <MessageSquare />
                    <span className="text-base">Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">
                    <User />
                    <span className="text-base">Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/wallet">
                    <Wallet />
                    <span className="text-base">Wallet</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          onClick={() => handleLogout()}
          variant="ghost"
          className="w-full flex items-center justify-start text-base text-danger mb-4 hover:text-danger/80  cursor-pointer"
        >
          <MdOutlineLogout /> Logout
        </Button>{" "}
      </SidebarFooter>
    </Sidebar>
  );
}
