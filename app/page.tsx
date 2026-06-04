"use client";

import Layout from "@/components/Layout/Layout";
import Image from "next/image";
import lightLogo from "@/public/light-logo.png";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong, FaUsers } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import dashboardImage from "@/public/dashboard.png";
import {
  THE_PROBLEM_CONTENT,
  PROCESS_STEPS,
  LANDING_PAGE_MARQUEE,
} from "@/constant/data";
import { Card } from "@/components/ui/card";
import processImage from "@/public/process.jpg";
import { FaExchangeAlt } from "react-icons/fa";

const page = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  const currentText = LANDING_PAGE_MARQUEE[textIndex];

  const router = useRouter();

  useEffect(() => {
    let timeout;

    if (charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayText("");
        setTextIndex((prev) => (prev + 1) % LANDING_PAGE_MARQUEE.length);
      }, 1200);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, textIndex]);

  return (
    <Layout>
      <main className="space-y-16">
        {/* Hero Section */}
        <section className="w-full mx-auto  flex flex-col gap-4 items-center justify-center text-center">
          <h2 className="text-2xl font-semibold text-secondary-foreground opacity-60">
            ENHANCE YOUR CAREER
          </h2>
          <h1 className="text-5xl font-bold max-w-3xl leading-tight">
            Learn and boost your skillset with
          </h1>
          <Image src={lightLogo} alt="logo" className="max-w-44 my-4" />
          <p className="text-2xl font-semibold">
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
          <Button
            size={"lg"}
            className="flex items-center gap-2 rounded-full px-8 py-6 my-4"
            onClick={() => router.push("/signup")}
          >
            Get Started <FaArrowRightLong />
          </Button>
          <Image
            src={dashboardImage}
            alt="dashboard"
            className="max-h-[70vh] object-cover object-top rounded-t-4xl border-t-8 border-r-8 border-l-8 border-gray-800"
          />
        </section>

        {/* The Problem Section  */}
        <section className="space-y-6">
          <div className="flex flex-col gap-10">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  The Problem
                </p>

                <h2 className="text-3xl font-bold leading-tight">
                  Online learning is broken for most people.
                </h2>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Platforms like Udemy, Coursera, and Skillshare rely on
                  subscription or pay-per-course models locking out students,
                  freelancers, and learners from low income communities who have
                  real skills to share.
                </p>

                <div className="border-l-4 border-primary pl-4 italic text-foreground/80 space-y-1">
                  <p>
                    “35.1% of survey respondents had previously used a paid
                    platform but discontinued due to cost. Another 16.2% said
                    they never used one because of financial barriers alone.”
                  </p>
                  <span className="text-xs text-muted-foreground not-italic">
                    — SkillXchange User Research, 2025
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {THE_PROBLEM_CONTENT.map((c) => {
                const Icon = c.icon;

                return (
                  <Card key={c.title} className="group bg-card p-4 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition">
                      <Icon className="text-xl" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {c.content}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* The Process Section  */}
        <section className="space-y-6">
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              The Process
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              From sign-up to skill swap in minutes
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              SkillXchange makes peer learning frictionless with a clear four
              step journey powered by AI matching and real-time communication.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 p-4 flex flex-col gap-6">
              {PROCESS_STEPS.map((c) => {
                const Icon = c.icon;

                return (
                  <div key={c.title} className="group flex items-start gap-4">
                    <div className="mb-4 flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition">
                      <Icon className="text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold mb-2">{c.title}</h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 p-4 relative">
              <Image
                src={processImage}
                alt="Process"
                className="w-full rounded-2xl object-cover shadow-xl"
              />

              <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-[92%] max-w-lg rounded-lg bg-primary text-primary-foreground backdrop-blur-sm shadow-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                        <FaUsers className="text-lg text-primary" />
                      </div>

                      <h3 className="text-3xl font-semibold">100+</h3>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Members Joined
                    </p>
                  </div>

                  <div className="h-16 w-px bg-border mx-6 shrink-0" />

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                        <FaExchangeAlt className="text-lg text-primary" />
                      </div>

                      <h3 className="text-3xl font-semibold">50+</h3>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Skill Exchanges
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6"></section>
      </main>
    </Layout>
  );
};

export default page;
