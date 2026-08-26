import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import ReduxProvider from "@/store/provider";
import { Toaster } from "@/components/ui/sonner";
import LayoutContent from "@/components/LayoutContent/LayoutContent";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://skillsxchange.vercel.app"),
  title: {
    default: "SkillsXchange (Skill Exchange) - Peer-to-Peer Skill Swap & Career Platform",
    template: "%s | SkillsXchange",
  },
  description:
    "SkillsXchange (also known as Skill Exchange, SkillXchange, or Skillexchange) is the ultimate peer-to-peer platform to swap skills, learn programming, share knowledge, and discover internships & job placements.",
  keywords: [
    "skillsxchange",
    "skillexchange",
    "skillxchange",
    "skillsexchange",
    "skill exchange",
    "skills exchange",
    "skill swap",
    "skills swap",
    "skill swapping platform",
    "peer to peer learning",
    "learn programming",
    "free skill swap",
    "find internship",
    "placement board",
    "knowledge sharing",
    "skill network",
  ],
  authors: [{ name: "SkillsXchange Team" }],
  creator: "SkillsXchange",
  publisher: "SkillsXchange",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "nQFyYMiJ3L0r68BX55J0q9nRX3_NmlIOYvReJQgGjQE",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skillsxchange.vercel.app",
    siteName: "SkillsXchange",
    title: "SkillsXchange - Swap Skills, Learn & Grow Together",
    description:
      "Join SkillsXchange (Skill Exchange / Skillexchange). Connect with mentors and peers, swap skills, and discover job & internship opportunities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillsXchange - Peer-to-Peer Skill Swap Platform",
    description:
      "Swap skills, meet mentors, and build your professional circle on SkillsXchange.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SkillsXchange",
    alternateName: [
      "Skill Exchange",
      "Skillexchange",
      "SkillXchange",
      "Skills Exchange",
      "Skillsxchange",
    ],
    url: "https://skillsxchange.vercel.app",
    description:
      "Peer-to-peer platform for skill swapping, mentorship, technical learning, and career placements.",
  };

  return (
    <html lang="en" className={`${poppins.variable} ${poppins.className} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutContent>{children}</LayoutContent>
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
