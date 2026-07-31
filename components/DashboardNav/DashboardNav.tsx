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
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "@/store/features/notifications/notificationSlice";
import avatar from "@/public/avatar.png";
import { Skeleton } from "../ui/skeleton";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoKeyOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { toast } from "sonner";
import { SidebarTrigger } from "../ui/sidebar";
import { FaBell } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCheck, ExternalLink, BellOff } from "lucide-react";

const DashboardNav = () => {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { user, loadingMe } = useAppSelector((state) => state.auth);
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getMe());
      setAuthLoading(false);
    };

    fetchUser();
  }, []);

  const handleFetchNotifications = () => {
    dispatch(fetchNotifications({ limit: 5 }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="flex items-center justify-between w-full border-b px-4 py-1.5 sticky top-0 backdrop-blur-md z-50 bg-sidebar">
      <SidebarTrigger />
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <DropdownMenu
            onOpenChange={(open) => open && handleFetchNotifications()}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative p-2 rounded-full hover:bg-muted transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <FaBell className="text-lg text-foreground/80 hover:text-foreground cursor-pointer" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 text-[10px] font-bold text-white bg-destructive rounded-full px-1 animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-80 sm:w-96 p-0 rounded-xl shadow-xl border border-border overflow-hidden"
            >
              {/* Dropdown Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/40">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-medium transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <BellOff className="w-8 h-8 opacity-40" />
                    <p className="text-xs">No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <DropdownMenuItem
                      key={n._id}
                      asChild
                      className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-muted/60 transition-colors focus:bg-muted/60 focus:outline-none"
                    >
                      <div
                        onClick={() => {
                          if (!n.isRead) dispatch(markAsRead(n._id));
                          if (n.link) router.push(n.link);
                        }}
                        className={!n.isRead ? "bg-primary/5" : ""}
                      >
                        <div className="relative shrink-0 mt-0.5">
                          {n.sender?.avatar ? (
                            <img
                              src={n.sender.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {n.sender?.firstName?.[0] || n.title[0]}
                            </div>
                          )}
                          {!n.isRead && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-muted-foreground opacity-70 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2 border-t border-border bg-muted/20 text-center">
                <DropdownMenuItem
                  asChild
                  className="w-full justify-center cursor-pointer focus:bg-muted/60"
                >
                  <Link
                    href="/notifications"
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center justify-center gap-1.5 py-1 w-full"
                  >
                    View all notifications
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
        <div className="h-6 w-px bg-border"></div>
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
                    <img
                      src={user.avatar}
                      alt="profile picture"
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
