"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaEnvelopeOpenText } from "react-icons/fa";

const VerifyEmailNoticePage = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dot Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--primary)_2px,transparent_1px)] bg-size-[28px_28px] animate-grid-drift" />
      {/* Glow Layers */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10" />

      <div className="relative z-10 bg-background border border-border rounded-xl shadow-sm p-8 w-full max-w-md flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-3xl">
          <FaEnvelopeOpenText />
        </div>
        <div>
          <h1 className="font-semibold text-2xl text-foreground">
            Verify your email
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full mt-2">
          <Button className="w-full" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmailNoticePage;
