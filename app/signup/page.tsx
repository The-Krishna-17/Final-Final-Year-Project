"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import loginImg from "@/public/login.webp";
import Image from "next/image";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/features/auth/authSlice";
import {
  PasswordStrengthHints,
  isPasswordValid,
} from "@/components/ui/password-strength-hints";

import { toast } from "sonner";

const page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loadingRegister, errorRegister } = useAppSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
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

    const resultAction = await dispatch(
      registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }),
    );

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-black/10">
      {/* Right - Form */}
      <section className="border rounded-lg max-w-lg p-4 flex flex-col gap-4 shadow-2xl bg-card text-card-foreground">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">
            Create account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join the community and unlock new skills, knowledge, and
            opportunities.
          </p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-foreground">
                  First Name
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  placeholder="joe"
                  required
                  className={
                    errorRegister?.fields?.firstName
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errorRegister?.fields?.firstName && (
                  <p className="text-xs text-destructive">
                    {errorRegister.fields.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-foreground">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  placeholder="doe"
                  required
                  className={
                    errorRegister?.fields?.lastName
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errorRegister?.fields?.lastName && (
                  <p className="text-xs text-destructive">
                    {errorRegister.fields.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="email@gmail.com"
                required
                className={
                  errorRegister?.fields?.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errorRegister?.fields?.email && (
                <p className="text-xs text-destructive">
                  {errorRegister.fields.email}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className={`pr-10 ${errorRegister?.fields?.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
              {errorRegister?.fields?.password && (
                <p className="text-xs text-destructive">
                  {errorRegister.fields.password}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-lg" />
                  ) : (
                    <FaEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {(validationError || errorRegister?.global) && (
            <p className="text-sm text-destructive font-medium">
              {validationError || errorRegister?.global}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loadingRegister}>
            {loadingRegister ? "Signing up..." : "Signup"}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-10 text-sm font-medium border-border hover:bg-muted transition-colors"
        >
          <FaGoogle className="text-base shrink-0" />
          Continue with Google
        </Button> */}

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-sm font-medium"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </p>
      </section>
    </main>
  );
};

export default page;
