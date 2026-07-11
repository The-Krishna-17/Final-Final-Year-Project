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
      router.push("/verify-email");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dot Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--primary)_2px,transparent_1px)] bg-size-[28px_28px] animate-grid-drift" />
      {/* Glow Layers */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10"></div>
      <div
        className="relative flex items-stretch rounded-xl border border-border max-w-4xl w-full overflow-hidden shadow-sm hover:scale-102 transition-transform duration-300
before:content-[''] before:absolute before:-bottom-16 before:-left-16 before:h-28 before:w-28 before:rounded-full before:bg-secondary before:z-20 before:pointer-events-none
after:content-[''] after:absolute after:-top-16 after:-right-16 after:h-28 after:w-28 after:rounded-full after:bg-primary after:z-20 after:pointer-events-none"
      >
        {/* Left - Image */}
        <section className="relative z-10 flex-1 bg-primary hidden sm:flex justify-center items-center p-4 overflow-hidden">
          {/* wave background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60' viewBox='0 0 120 60'%3E%3Cpath d='M0 30 Q 30 0, 60 30 T 120 30' stroke='%23a1a1aa' fill='transparent' stroke-width='2'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-md relative z-10 ">
            <Image
              src={loginImg}
              alt="login"
              className="object-cover scale-x-[-1]"
            />
          </div>
        </section>
        {/* Right - Form */}
        <section className="bg-background flex flex-col gap-4 flex-1 p-8">
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
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {errorRegister?.fields?.firstName && (
                    <p className="text-xs text-red-500">
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
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {errorRegister?.fields?.lastName && (
                    <p className="text-xs text-red-500">
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
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errorRegister?.fields?.email && (
                  <p className="text-xs text-red-500">
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
                    className={`pr-10 ${errorRegister?.fields?.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
                  <p className="text-xs text-red-500">
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
              <p className="text-sm text-red-500 font-medium">
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

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-10 text-sm font-medium border-border hover:bg-muted transition-colors"
          >
            <FaGoogle className="text-base shrink-0" />
            Continue with Google
          </Button>

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
      </div>
    </main>
  );
};

export default page;
