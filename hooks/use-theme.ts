"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // O script no layout já aplicou a classe antes da hidratação;
    // aqui só sincronizamos o estado do React com o DOM.
    setThemeState(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return { theme, setTheme, toggleTheme };
}
