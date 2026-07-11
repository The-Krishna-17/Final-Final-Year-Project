"use client";

interface Rule {
  label: string;
  test: (p: string) => boolean;
}

const RULES: Rule[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "At least one uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "At least one number", test: (p) => /[0-9]/.test(p) },
  {
    label: "At least one special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

interface PasswordStrengthHintsProps {
  password: string;
  show: boolean;
}

export function PasswordStrengthHints({
  password,
  show,
}: PasswordStrengthHintsProps) {
  if (!show) return null;

  return (
    <ul className="flex flex-col gap-1 mt-1">
      {RULES.map(({ label, test }) => {
        const passed = test(password);
        return (
          <li key={label} className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[10px] font-bold shrink-0 transition-colors duration-200 ${
                passed
                  ? "bg-green-500/20 text-green-500 border border-green-500/30"
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              {passed ? "✓" : "✕"}
            </span>
            <span
              className={
                passed
                  ? "text-muted-foreground line-through"
                  : "text-foreground/70"
              }
            >
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Returns true only if all password rules pass — use for client-side gate */
export function isPasswordValid(password: string): boolean {
  return RULES.every(({ test }) => test(password));
}
