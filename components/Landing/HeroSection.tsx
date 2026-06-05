import Layout from "../Layout/Layout";
import Image from "next/image";
import { Button } from "../ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import { useEffect, useState } from "react";
import { LANDING_PAGE_MARQUEE } from "@/constant/data";
import dashboardImage from "@/public/dashboard.png";

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
    </Layout>
  );
};

export default HeroSection;
