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
  title: "SkillXchange - Swap Skills, Meet People",
  description: "Swap skills, meet people, and build your professional network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${poppins.className} h-full antialiased`}>
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
