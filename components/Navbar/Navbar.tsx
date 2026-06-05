"use client";

import Image from "next/image";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeProvider/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-400  sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <Link href="/" className="max-w-16 block">
        <Image src={lightLogo} alt="logo" className="dark:hidden" />
        <Image src={darkLogo} alt="logo" className="hidden dark:block" />
      </Link>
      <ul>
        <li className="flex items-center gap-6 text-sm">
          <Link className="cursor-pointer" href="#home">
            Home
          </Link>
          <Link className="cursor-pointer" href="#features">
            Features
          </Link>
          <Link className="cursor-pointer" href="#mission">
            Mission
          </Link>
          <Link className="cursor-pointer" href="#blogs">
            Blogs
          </Link>
          <Link className="cursor-pointer" href="#faqs">
            FAQs
          </Link>
          <Link className="cursor-pointer" href="#contact">
            Contact
          </Link>

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="flex items-center gap-1 outline-none cursor-pointer">
              More
              <FaAngleDown
                className={`transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
              <DropdownMenuItem asChild>
                <Link href="#problem" className="cursor-pointer">
                  Problem
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="#process" className="cursor-pointer">
                  Process
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="#research" className="cursor-pointer">
                  Research
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="#technology" className="cursor-pointer">
                  Technology
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              onClick={() => router.push("/login")}
              className="rounded-full px-6 py-5"
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
