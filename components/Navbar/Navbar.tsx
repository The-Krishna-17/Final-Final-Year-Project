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
import { FaAngleDown, FaRegUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMe, logoutUser } from "@/store/features/auth/authSlice";
import { Skeleton } from "../ui/skeleton";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoKeyOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../ui/avatar";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { user, loadingMe } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getMe());
      setAuthLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
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

          <ThemeToggle />

          {authLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            loadingMe ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="profile picture"
                        className="h-9 w-9 rounded-full object-cover object-center"
                      />
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.firstName[0].toUpperCase() +
                            user.lastName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-fit mr-4 space-y-1 p-2"
                  align="start"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <TbLayoutDashboard />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Link href="/change-password">
                      <IoKeyOutline />
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Link href="/profile">
                      {" "}
                      <FaRegUser />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Button
                      onClick={() => handleLogout()}
                      variant="ghost"
                      className="w-full flex items-center justify-start"
                    >
                      <MdOutlineLogout /> Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/login")}
                className="rounded-full px-6 py-5"
              >
                Sign In
              </Button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
