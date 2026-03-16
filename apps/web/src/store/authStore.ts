import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const stored = localStorage.getItem("auth-user");
  const user = stored ? (JSON.parse(stored) as User) : null;

  return {
    user,
    isAuthenticated: !!user,
    login: (user: User) => {
      localStorage.setItem("auth-user", JSON.stringify(user));
      localStorage.setItem("auth-token", user.token);
      set({ user, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem("auth-user");
      localStorage.removeItem("auth-token");
      set({ user: null, isAuthenticated: false });
    },
  };
});
