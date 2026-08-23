"use client";

import { useAppSelector } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiShieldCheckLine, RiNotification3Line } from "react-icons/ri";

export function AdminHeader() {
  const { user } = useAppSelector((s) => s.auth);
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "A";

  return (
    <header className="border-b border-border bg-card/60 backdrop-blur-md px-4 py-2 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold">
          <RiShieldCheckLine className="text-base" />
          <span>SUPER ADMIN</span>
        </Badge>
        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          System Time: {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User profile capsule */}
        <div className="flex items-center gap-3 border border-border bg-muted/30 px-3 py-1.5 rounded-full">
          <Avatar className="h-7 w-7 border border-border">
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left leading-tight hidden md:block">
            <p className="text-xs font-semibold text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
