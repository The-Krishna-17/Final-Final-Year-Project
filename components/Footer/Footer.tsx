import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import lightLogo from "@/public/light-logo.png";
import darkLogo from "@/public/dark-logo.png";

export default function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="max-w-16 block">
              <Image src={lightLogo} alt="logo" className="dark:hidden" />
              <Image src={darkLogo} alt="logo" className="hidden dark:block" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Democratizing access to skill development through peer-to-peer
              learning and meaningful knowledge exchange.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#home">Home</Link>
              </li>
              <li>
                <Link href="#problem">The Problem</Link>
              </li>
              <li>
                <Link href="#process">The Process</Link>
              </li>
              <li>
                <Link href="#features">Features</Link>
              </li>
              <li>
                <Link href="#faqs">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/login">Sign In</Link>
              </li>
              <li>
                <Link href="/register">Get Started</Link>
              </li>
              <li>
                <Link href="#research">Research</Link>
              </li>
              <li>
                <Link href="#mission">Mission</Link>
              </li>
              <li>
                <Link href="#contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>

            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <FaGithub size={18} />
              </Link>

              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <FaLinkedin size={18} />
              </Link>

              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <FaTwitter size={18} />
              </Link>

              <Link
                href="mailto:contact@skillxchange.com"
                className="text-muted-foreground hover:text-primary transition"
              >
                <FaEnvelope size={18} />
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              contact@skillxchange.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SkillXchange. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
