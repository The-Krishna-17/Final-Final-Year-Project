"use client";

import Layout from "../Layout/Layout";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import { useEffect, useState } from "react";
import { LANDING_PAGE_MARQUEE } from "@/constant/data";
import dashboardImageLight from "@/public/dashboard-light.png";
import dashboardImageDark from "@/public/dashboard-dark.png";

const HeroSection = () => {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const currentText = LANDING_PAGE_MARQUEE[textIndex];

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
      <section className="w-full mx-auto  flex flex-col gap-4 items-center justify-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold opacity-60 text-primary"
        >
          ENHANCE YOUR CAREER
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold max-w-3xl leading-tight"
        >
          Learn and boost your skillset with
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-44 my-4"
        >
          <Image src={lightLogo} alt="logo" className="dark:hidden" />
          <Image src={darkLogo} alt="logo" className="hidden dark:block" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl font-semibold"
        >
          {displayText}
          <span className="animate-pulse">|</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size={"lg"}
            className="flex items-center gap-2 rounded-full px-8 py-6 my-4"
            onClick={() => router.push("/signup")}
          >
            Get Started <FaArrowRightLong />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Image
            src={dashboardImageLight}
            alt="dashboard"
            className="border-foreground/30 max-h-[70vh] object-cover object-top rounded-t-4xl border-t-8 border-r-8 border-l-8 dark:hidden"
          />
          <Image
            src={dashboardImageDark}
            alt="dashboard"
            className="border-foreground/30 max-h-[70vh] object-cover object-top rounded-t-4xl border-t-8 border-r-8 border-l-8 hidden dark:block"
          />
        </motion.div>
      </section>
    </Layout>
  );
};

export default HeroSection;
