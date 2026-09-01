"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine,
  RiUserSettingsLine,
  RiBrainLine,
  RiArrowLeftRightLine,
  RiStarLine,
  RiVideoChatLine,
  RiShieldFlashLine,
  RiBriefcaseLine,
  RiBookOpenLine,
  RiMailLine,
} from "react-icons/ri";
import { MdOutlineLogout } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  {
    name: "Overview",
    href: "/admin",
    icon: RiDashboardLine,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: RiUserSettingsLine,
  },
  {
    name: "AI Skills Taxonomy",
    href: "/admin/skills",
    icon: RiBrainLine,
  },
  {
    name: "Skill Swaps Monitor",
    href: "/admin/swaps",
    icon: RiArrowLeftRightLine,
  },
  {
    name: "Review Moderation",
    href: "/admin/reviews",
    icon: RiStarLine,
  },
  {
    name: "Video Meetings Logs",
    href: "/admin/meetings",
    icon: RiVideoChatLine,
  },
  {
    name: "Job Listings",
    href: "/admin/jobs",
    icon: RiBriefcaseLine,
  },
  {
    name: "Blog Management",
    href: "/admin/blogs",
    icon: RiBookOpenLine,
  },
  {
    name: "Contact Messages",
    href: "/admin/contacts",
    icon: RiMailLine,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingLogout = useAppSelector((state) => state.auth.loadingLogout);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <aside className="w-[16rem] shrink-0 bg-sidebar border-r border-border min-h-screen flex flex-col justify-between p-2 shadow-sm text-sidebar-foreground">
      <div className="space-y-4">
        {/* Brand logo & Admin title */}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="h-8 w-8 rounded-lg bg-linear-to-tr from-primary to-amber-500 flex items-center justify-center text-primary-foreground shadow-sm font-bold text-lg shrink-0">
            <RiShieldFlashLine />
          </div>
          <div>
            <h2 className="font-semibold text-base leading-tight">
              Admin Console
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Command Center
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon
                  className={`text-lg ${isActive ? "text-primary" : "text-sidebar-foreground/70"}`}
                />
                <span className={isActive ? "text-primary" : ""}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <Button
        onClick={handleLogout}
        disabled={loadingLogout}
        variant="ghost"
        className="w-full flex items-center justify-start gap-2 text-base text-red-500 hover:text-red-600 hover:bg-sidebar-accent cursor-pointer"
      >
        <MdOutlineLogout />
        {loadingLogout ? "Logging out..." : "Logout"}
      </Button>
    </aside>
  );
}
