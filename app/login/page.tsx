"use client";

import { Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/features/auth/authSlice";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { loadingLogin, errorLogin } = useAppSelector((state) => state.auth);

  const redirectTo = searchParams.get("from") || "/dashboard";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.data?.user?.role;
      if (role === "admin" || role === "moderator") {
        router.push("/admin");
      } else {
        router.push(redirectTo);
      }
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-black/10">
      {/* Left - Form */}
      <section className="border rounded-lg max-w-md p-4 flex flex-col gap-4 shadow-2xl bg-card text-card-foreground">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Continue your journey learn new skills, share knowledge, and grow
            every day.
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
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errorLogin?.fields?.email && (
                <p className="text-xs text-destructive">
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
                  className={`pr-10 ${errorLogin?.fields?.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
                <p className="text-xs text-destructive">
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
            <p className="text-sm text-destructive font-medium">
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
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full flex items-center justify-center bg-black/10">
          <div className="border rounded-lg max-w-md w-full p-8 flex flex-col items-center justify-center gap-4 bg-card text-card-foreground">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
