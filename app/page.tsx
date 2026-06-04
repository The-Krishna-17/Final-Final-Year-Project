"use client";

import Layout from "@/components/Layout/Layout";
import Image from "next/image";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeftLong, FaArrowRightLong, FaUsers } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import dashboardImage from "@/public/dashboard.png";
import {
  THE_PROBLEM_CONTENT,
  PROCESS_STEPS,
  LANDING_PAGE_MARQUEE,
  FEATURES,
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

  const [index, setIndex] = useState(0);
  const totalPages = Math.ceil(FEATURES.length / 3);

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

  const next = () => setIndex((prev) => (prev + 1) % totalPages);
  const prev = () => setIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const chunked = [];

  for (let i = 0; i < FEATURES.length; i += 3) {
    chunked.push(FEATURES.slice(i, i + 3));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalPages);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <main className="space-y-16" id="home">
        {/* Hero Section */}
        <section className="w-full mx-auto  flex flex-col gap-4 items-center justify-center text-center">
          <h2 className="text-2xl font-semibold text-secondary-foreground opacity-60">
            ENHANCE YOUR CAREER
          </h2>
          <h1 className="text-5xl font-bold max-w-3xl leading-tight">
            Learn and boost your skillset with
          </h1>
          <div className="max-w-44 my-4">
            <Image src={lightLogo} alt="logo" className="dark:hidden" />
            <Image src={darkLogo} alt="logo" className="hidden dark:block" />
          </div>

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
            className="border-gray-800 dark:border-gray-200 max-h-[70vh] object-cover object-top rounded-t-4xl border-t-8 border-r-8 border-l-8"
          />
        </section>

        {/* The Problem Section  */}
        <section className="space-y-6" id="problem">
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
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
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
        <section id="process">
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
                    <div className="mb-4 flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
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

        {/* Core Features */}
        <section className="space-y-6" id="features">
          <div className="flex items-start justify-between">
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Core Features
              </p>
              <h2 className="text-3xl font-bold leading-tight">
                Built around what users actually need{" "}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every feature was prioritised from real survey data and user
                interviews not assumptions. High scores validate every design
                decision.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={prev}>
                <FaArrowLeftLong />
              </Button>

              <Button variant="outline" onClick={next}>
                <FaArrowRightLong />
              </Button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {chunked.map((group, i) => (
                <div key={i} className="w-full flex gap-4 shrink-0 px-2 py-4">
                  {group.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <Card
                        key={feature.id}
                        className="group flex-1 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="text-xl" />
                        </div>

                        <span className="text-xs text-primary font-medium">
                          {feature.id} · {feature.priority}
                        </span>

                        <h3 className="text-xl font-semibold mt-2">
                          {feature.title}
                        </h3>

                        <p className="text-sm text-muted-foreground mt-2">
                          {feature.description}
                        </p>

                        <div className="pt-4 border-t mt-4">
                          <h4 className="text-2xl font-bold text-primary">
                            {feature.rating}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {feature.metricLabel}
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default page;
