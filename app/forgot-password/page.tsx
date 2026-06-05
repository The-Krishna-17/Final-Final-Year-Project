"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { forgotPassword } from "@/store/features/auth/authSlice";

const page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loadingForgotPassword, errorForgotPassword, successForgotPassword } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dot Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--primary)_2px,transparent_1px)] bg-size-[28px_28px] animate-grid-drift" />
      {/* Glow Layers */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10" />

      <div className="relative z-10 bg-background border border-border rounded-xl shadow-sm p-8 w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Forgot password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {successForgotPassword ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                {successForgotPassword}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Check your inbox and follow the instructions. The link expires in 1 hour.
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={errorForgotPassword?.fields?.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errorForgotPassword?.fields?.email && (
                <p className="text-xs text-red-500">{errorForgotPassword.fields.email}</p>
              )}
            </div>

            {errorForgotPassword?.global && (
              <p className="text-sm text-red-500 font-medium">{errorForgotPassword.global}</p>
            )}

            <Button type="submit" className="w-full" disabled={loadingForgotPassword}>
              {loadingForgotPassword ? "Sending..." : "Send reset link"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};

export default page;
