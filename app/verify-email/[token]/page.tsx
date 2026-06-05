"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyEmail } from "@/store/features/auth/authSlice";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  const dispatch = useAppDispatch();
  const { loadingVerifyEmail, errorVerifyEmail, successVerifyEmail } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token, dispatch]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dot Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--primary)_2px,transparent_1px)] bg-size-[28px_28px] animate-grid-drift" />
      {/* Glow Layers */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10" />

      <div className="relative z-10 bg-background border border-border rounded-xl shadow-sm p-8 w-full max-w-md flex flex-col items-center gap-6 text-center">
        {loadingVerifyEmail && (
          <>
            <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div>
              <h1 className="font-semibold text-2xl text-foreground">Verifying your email</h1>
              <p className="text-sm text-muted-foreground mt-1">Please wait a moment…</p>
            </div>
          </>
        )}

        {successVerifyEmail && !loadingVerifyEmail && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 text-2xl">
              ✓
            </div>
            <div>
              <h1 className="font-semibold text-2xl text-foreground">Email verified!</h1>
              <p className="text-sm text-muted-foreground mt-1">{successVerifyEmail}</p>
            </div>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Continue to Login
            </Button>
          </>
        )}

        {errorVerifyEmail && !loadingVerifyEmail && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 text-2xl">
              ✕
            </div>
            <div>
              <h1 className="font-semibold text-2xl text-foreground">Verification failed</h1>
              <p className="text-sm text-red-500 mt-1">
                {errorVerifyEmail.global ?? "This link may be invalid or expired."}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Button className="w-full" onClick={() => router.push("/signup")}>
                Register again
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => router.push("/login")}>
                Back to Login
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default page;
