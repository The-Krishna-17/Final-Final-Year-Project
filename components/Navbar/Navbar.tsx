import Image from "next/image";
import React from "react";
import lightLogo from "@/public/light-logo.png";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-400  sticky top-0 bg-background z-50">
      <Image src={lightLogo} alt="logo" className="max-w-16" />
      <ul>
        <li className="flex items-center gap-4">
          <Link href={"#"}>Home</Link>
          <Link href={"#"}>Features</Link>
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>Resources</Link>
          <Link href={"#"}>Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
