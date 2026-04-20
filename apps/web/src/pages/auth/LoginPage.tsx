import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";

const MOCK_USER: User = {
  id: "1",
  email: "admin@downloadcenter.local",
  name: "Admin",
  role: "admin",
  token: "mock-jwt-token-xxx",
};

const isMock = import.meta.env.VITE_USE_MOCK === "true";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock / offline login
    if (isMock) {
      await new Promise((r) => setTimeout(r, 400));
      if (email === MOCK_USER.email && password === "admin123") {
        login(MOCK_USER);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
      return;
    }

    // Real API login
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }
      localStorage.setItem("auth-token", data.token);
      login({ ...data.user, token: data.token });
      navigate("/dashboard");
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white">
            <Download className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Download Center</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your admin account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@downloadcenter.local"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>

          {isMock && (
            <p className="mt-4 text-center text-xs text-gray-400">
              Mock mode — use <strong>admin@downloadcenter.local</strong> / <strong>admin123</strong>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
