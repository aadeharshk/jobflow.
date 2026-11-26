import { useState } from "react";
import { applyTheme, currentTheme, type Theme } from "../lib/theme";
import { IconMoon, IconSun } from "./icons";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => currentTheme());
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={`Switch to ${next} theme`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}
