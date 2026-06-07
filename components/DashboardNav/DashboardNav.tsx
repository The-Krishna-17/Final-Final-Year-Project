"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeProvider/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FaRegUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMe, logoutUser } from "@/store/features/auth/authSlice";
import avatar from "@/public/avatar.png";
import { Skeleton } from "../ui/skeleton";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoKeyOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { toast } from "sonner";
import { SidebarTrigger } from "../ui/sidebar";
import { FaBell } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const DashboardNav = () => {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { user, loadingMe } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getMe());
      setAuthLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="flex items-center justify-between w-full border-b px-4 py-1.5 sticky top-0 bg-background backdrop-blur-md z-50">
      <SidebarTrigger />
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <FaBell className="cursor-pointer text-xl" />
          <ThemeToggle />
        </div>
        <div className="h-6 w-px bg-slate-300"></div>
        {authLoading ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : user ? (
          loadingMe ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  <span>
                    {user.firstName[0].toUpperCase() +
                      user.firstName.slice(1).toLowerCase() +
                      " " +
                      user.lastName[0].toUpperCase() +
                      user.lastName.slice(1).toLowerCase()}
                  </span>

                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="profile picture"
                      width={200}
                      height={200}
                      className="h-9 w-9 rounded-full object-cover object-center"
                    />
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.firstName[0].toUpperCase() +
                          user.lastName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-fit mr-4 space-y-1 p-2"
                align="start"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <TbLayoutDashboard />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Link href="/change-password">
                    <IoKeyOutline />
                    Change Password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Link href="/profile">
                    {" "}
                    <FaRegUser />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Button
                    onClick={() => handleLogout()}
                    variant="ghost"
                    className="w-full flex items-center justify-start"
                  >
                    <MdOutlineLogout /> Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        ) : (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push("/login")}
              className="rounded-full px-6 py-5"
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNav;
