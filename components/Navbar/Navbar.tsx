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
import { Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <nav className="flex items-center justify-between p-3 sm:p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <Link href="/" className="max-w-16 sm:max-w-20 block">
        <Image src={lightLogo} alt="logo" className="dark:hidden" />
        <Image src={darkLogo} alt="logo" className="hidden dark:block" />
      </Link>
      <ul className="hidden md:block">
        <li className="flex items-center gap-6 text-base">
          <Link className="cursor-pointer" href="/#home">
            Home
          </Link>
          <Link className="cursor-pointer" href="/#features">
            Features
          </Link>
          <Link className="cursor-pointer" href="/#mission">
            Mission
          </Link>
          <Link className="cursor-pointer hover:text-primary transition-colors" href="/public-blogs">
            Blogs
          </Link>
          <Link className="cursor-pointer hover:text-primary transition-colors" href="/public-jobs">
            Jobs
          </Link>
          <Link className="cursor-pointer" href="/#faqs">
            FAQs
          </Link>
          <Link className="cursor-pointer" href="/#contact">
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

            <DropdownMenuContent
              align="center"
              className="p-2"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem asChild className="cursor-pointer text-base">
                <Link href="/#problem">Problem</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer text-base">
                <Link href="/#process">Process</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer text-base">
                <Link href="/#research">Research</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer text-base">
                <Link href="/#technology">Technology</Link>
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

      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        {authLoading ? (
          <Skeleton className="h-9 w-9 rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer" aria-label="Open account menu">
                {user.avatar ? (
                  <img src={user.avatar} alt="profile picture" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mr-2 space-y-1 p-2">
              <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/my-account">My Account</Link></DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start"><MdOutlineLogout /> Logout</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => router.push("/login")} size="sm" className="rounded-full px-4">
            Sign In
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-border bg-background/95 p-4 shadow-lg backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 text-base">
            {[
              ["Home", "/#home"], ["Features", "/#features"], ["Mission", "/#mission"],
              ["Blogs", "/public-blogs"], ["Jobs", "/public-jobs"], ["FAQs", "/#faqs"],
              ["Contact", "/#contact"], ["Problem", "/#problem"], ["Process", "/#process"],
              ["Research", "/#research"], ["Technology", "/#technology"],
            ].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
