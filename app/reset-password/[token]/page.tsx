"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPassword } from "@/store/features/auth/authSlice";
import {
  PasswordStrengthHints,
  isPasswordValid,
} from "@/components/ui/password-strength-hints";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  const dispatch = useAppDispatch();
  const { loadingResetPassword, errorResetPassword, successResetPassword } =
    useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSubmitAttempted(true);

    if (!isPasswordValid(formData.password)) {
      setValidationError("Please meet all password requirements below.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    dispatch(resetPassword({ token, ...formData }));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dot Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--primary)_2px,transparent_1px)] bg-size-[28px_28px] animate-grid-drift" />
      {/* Glow Layers */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10" />

      <div className="relative z-10 bg-background border border-border rounded-xl shadow-sm p-8 w-full max-w-md flex flex-col gap-6">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your new password below. Make sure it&apos;s strong and
            unique.
          </p>
        </div>

        {successResetPassword ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-success/30 bg-success-muted p-4">
              <p className="text-sm text-success-muted-foreground font-medium">
                {successResetPassword}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You can now log in with your new password.
              </p>
            </div>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`pr-10 ${errorResetPassword?.fields?.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-lg" />
                    ) : (
                      <FaEye className="text-lg" />
                    )}
                  </button>
                </div>
                <PasswordStrengthHints
                  password={formData.password}
                  show={submitAttempted}
                />
                {errorResetPassword?.fields?.password && (
                  <p className="text-xs text-destructive">
                    {errorResetPassword.fields.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? (
                      <FaEyeSlash className="text-lg" />
                    ) : (
                      <FaEye className="text-lg" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {(validationError || errorResetPassword?.global) && (
              <p className="text-sm text-destructive font-medium">
                {validationError || errorResetPassword?.global}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loadingResetPassword}
            >
              {loadingResetPassword ? "Resetting..." : "Reset password"}
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
