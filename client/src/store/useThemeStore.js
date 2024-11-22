import { create } from "zustand";
import { THEMES } from "../constants";

const getDefaultTheme = () => {
  const savedTheme = localStorage.getItem("chat-theme");
  return THEMES.includes(savedTheme) ? savedTheme : "dark";
};

export const useThemeStore = create((set) => ({
  theme: getDefaultTheme(),
  setTheme: (theme) => {
    if (!THEMES.includes(theme)) return;
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));