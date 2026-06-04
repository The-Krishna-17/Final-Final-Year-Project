"use client";

import Image from "next/image";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeProvider/ThemeToggle";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-400  sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <Link href="/" className="max-w-16 block">
        <Image src={lightLogo} alt="logo" className="dark:hidden" />
        <Image src={darkLogo} alt="logo" className="hidden dark:block" />
      </Link>
      <ul>
        <li className="flex items-center gap-6 text-sm">
          <Link href={"#home"}>Home</Link>
          <Link href={"#problem"}>The Problem</Link>
          <Link href={"#process"}>The Process</Link>
          <Link href={"#features"}>Features</Link>
          <Link href={"#blogs"}>Blogs</Link>
          <Link href={"#faqs"}>FAQs</Link>
          <Link href={"#contact"}>Contact</Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Button
              onClick={() => router.push("/login")}
              className="rounded-full px-6"
            >
              Sign In
            </Button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
