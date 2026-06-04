"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        relative flex h-10 w-10 items-center justify-center
        rounded-full border bg-background
        transition-all duration-300
        hover:scale-105
        hover:shadow-md
      "
    >
      <Sun
        className="
          h-5 w-5
          rotate-0 scale-100
          transition-all duration-300
          dark:-rotate-90 dark:scale-0
        "
      />

      <Moon
        className="
          absolute h-5 w-5
          rotate-90 scale-0
          transition-all duration-300
          dark:rotate-0 dark:scale-100
        "
      />
    </button>
  );
}
