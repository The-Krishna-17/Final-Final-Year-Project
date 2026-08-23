"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMe } from "@/store/features/auth/authSlice";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loadingMe } = useAppSelector((s) => s.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          await dispatch(getMe()).unwrap();
        }
      } catch (err) {
        // Failed session fetch
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [dispatch, user]);

  if (checking || loadingMe) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Verifying admin credentials...
        </p>
      </div>
    );
  }

  // Authorization Check
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center text-3xl mb-4">
          <ShieldAlert />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Access Restricted
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mt-2 leading-relaxed">
          You need an <strong>Admin</strong> or <strong>Moderator</strong> role
          to access the platform command center. Your current role is{" "}
          <span className="underline font-semibold">
            {user?.role || "guest"}
          </span>
          .
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex text-foreground font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
