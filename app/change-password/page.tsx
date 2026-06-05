"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changePassword } from "@/store/features/auth/authSlice";

const page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loadingChangePassword, errorChangePassword, successChangePassword } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError("New passwords do not match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setValidationError("New password must be different from current password");
      return;
    }

    dispatch(changePassword(formData));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dot Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--primary)_2px,transparent_1px)] bg-size-[28px_28px] animate-grid-drift" />
      {/* Glow Layers */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10" />

      <div className="relative z-10 bg-background border border-border rounded-xl shadow-sm p-8 w-full max-w-md flex flex-col gap-6">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Change password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update your account password securely.
          </p>
        </div>

        {successChangePassword ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                {successChangePassword}
              </p>
            </div>
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <div className="relative">
                  <Input
                    name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    className={`pr-10 ${errorChangePassword?.fields?.currentPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrent ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                  </button>
                </div>
                {errorChangePassword?.fields?.currentPassword && (
                  <p className="text-xs text-red-500">{errorChangePassword.fields.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <div className="relative">
                  <Input
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className={`pr-10 ${errorChangePassword?.fields?.newPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNew ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                  </button>
                </div>
                {errorChangePassword?.fields?.newPassword && (
                  <p className="text-xs text-red-500">{errorChangePassword.fields.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`pr-10 ${errorChangePassword?.fields?.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                  </button>
                </div>
                {errorChangePassword?.fields?.confirmPassword && (
                  <p className="text-xs text-red-500">{errorChangePassword.fields.confirmPassword}</p>
                )}
              </div>
            </div>

            {(validationError || errorChangePassword?.global) && (
              <p className="text-sm text-red-500 font-medium">
                {validationError || errorChangePassword?.global}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loadingChangePassword}>
              {loadingChangePassword ? "Updating..." : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};

export default page;
