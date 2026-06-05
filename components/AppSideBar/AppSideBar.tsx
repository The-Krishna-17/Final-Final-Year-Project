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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import { Button } from "../ui/button";
import { MdOutlineLogout } from "react-icons/md";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/store/features/auth/authSlice";

export function AppSideBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
                  <Link href="/sessions">
                    <Calendar />
                    <span className="text-base">Sessions</span>
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
