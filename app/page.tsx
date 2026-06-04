"use client";

import Layout from "@/components/Layout/Layout";
import Image from "next/image";
import lightLogo from "@/public/light-logo.png";
import { LANDING_PAGE_MARQUEE } from "@/constant/data";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import dashboardImage from "@/public/dashboard.png";

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
      <main>
        {/* hero section */}
        <section className="w-full mx-auto  flex flex-col gap-4 items-center justify-center text-center">
          <h2 className="text-2xl font-semibold text-secondary-foreground opacity-60">
            ENHANCE YOUR CAREER
          </h2>
          <h1 className="text-5xl font-bold max-w-3xl leading-tight">
            Learn and boost your skillset with
          </h1>
          <Image src={lightLogo} alt="logo" className="max-w-52" />
          <p className="text-2xl font-semibold">
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
          <Button
            size={"lg"}
            className="flex items-center gap-2 rounded-full px-8 py-6"
            onClick={() => router.push("/signup")}
          >
            Get Started <FaArrowRightLong />
          </Button>
          <Image
            src={dashboardImage}
            alt="dashboard"
            className="max-h-[70vh] object-cover object-top rounded-t-4xl border-t-8 border-r-8 border-l-8 border-gray-400 mt-4"
          />
        </section>
      </main>
    </Layout>
  );
};

export default page;
