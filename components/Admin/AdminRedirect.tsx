"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Loader2 } from "lucide-react";

export function AdminRedirect() {
  const router = useRouter();
  const { user, loadingMe } = useAppSelector((s) => s.auth);
  const [blocked, setBlocked] = useState(true);

  useEffect(() => {
    if (loadingMe) return;

    if (user && (user.role === "admin" || user.role === "moderator")) {
      router.replace("/admin");
    } else {
      setBlocked(false);
    }
  }, [user, loadingMe, router]);

  if (blocked) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return null;
}
