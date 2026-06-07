"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import loginImg from "@/public/login.webp";
import Image from "next/image";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/features/auth/authSlice";

const page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loadingLogin, errorLogin } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dot Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--primary)_2px,transparent_1px)] bg-size-[28px_28px] animate-grid-drift" />
      {/* Glow Layers */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10"></div>
      <div
        className="relative flex items-stretch rounded-xl border border-border max-w-2xl w-full overflow-hidden shadow-sm hover:scale-102 transition-transform duration-300
before:content-[''] before:absolute before:-bottom-16 before:-left-16 before:h-28 before:w-28 before:rounded-full before:bg-primary before:z-20 before:pointer-events-none
after:content-[''] after:absolute after:-top-16 after:-right-16 after:h-28 after:w-28 after:rounded-full after:bg-secondary after:z-20 after:pointer-events-none"
      >
        {/* Left - Form */}
        <section className="bg-background flex flex-col gap-4 flex-1 p-8">
          <div>
            <h1 className="font-semibold text-2xl text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Continue your journey — learn new skills, share knowledge, and
              grow every day.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="email@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={
                    errorLogin?.fields?.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errorLogin?.fields?.email && (
                  <p className="text-xs text-red-500">
                    {errorLogin.fields.email}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`pr-10 ${errorLogin?.fields?.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
                {errorLogin?.fields?.password && (
                  <p className="text-xs text-red-500">
                    {errorLogin.fields.password}
                  </p>
                )}
              </div>

              <span
                className="text-xs text-right text-muted-foreground underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>

            {errorLogin?.global && (
              <p className="text-sm text-red-500 font-medium">
                {errorLogin.global}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loadingLogin}>
              {loadingLogin ? "Logging in..." : "Login"}
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
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-sm font-medium"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </Button>
          </p>
        </section>

        {/* Right - Image */}
        <section className="relative z-10 flex-1 bg-primary hidden sm:flex justify-center items-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60' viewBox='0 0 120 60'%3E%3Cpath d='M0 30 Q 30 0, 60 30 T 120 30' stroke='%23a1a1aa' fill='transparent' stroke-width='2'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-md relative z-10">
            <Image src={loginImg} alt="login" className="object-cover" />
          </div>
        </section>
      </div>
    </main>
  );
};

export default page;
