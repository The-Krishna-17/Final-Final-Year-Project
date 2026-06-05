"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {isHome && <Navbar />}

      <main className="flex-1 flex flex-col">{children}</main>

      {isHome && <Footer />}
    </>
  );
}
