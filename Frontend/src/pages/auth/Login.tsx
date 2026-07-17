/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Role = "admin" | "cashier" | "employee";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://site--ankelk--dnxhn8mdblq5.code.run/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Email ou mot de passe incorrect");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const role: Role = data.user.role;

      if (data.user.mustChangePassword) {
        navigate("/change-password");
        return;
      }

      const routes: Record<Role, string> = {
        admin: "/admin/dashboard",
        cashier: "/cashier/dashboard",
        employee: "/employee/dashboard",
      };

      navigate(routes[role]);
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      setError(err.message || "Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#fff4d6] p-4 lg:p-0">
      <div className="grid min-h-162.5 w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
            alt="ANFEL K Institute"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-14 left-12 text-white">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-serif text-6xl font-bold tracking-[0.15em]"
            >
              ANFEL K
            </motion.h1>

            <p className="mt-3 text-sm uppercase tracking-[0.5em] text-white/80">
              INSTITUTE
            </p>

            <p className="mt-8 max-w-sm text-lg text-white/80">
              Beauty management system for modern institutes
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <h2 className="font-serif text-4xl font-bold">Welcome Back</h2>

              <p className="mt-3 text-sm text-gray-500">
                Connect to your professional workspace
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@anfelk.com"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#5a3a1e] focus:ring-2 focus:ring-[#5a3a1e]/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-[#5a3a1e] focus:ring-2 focus:ring-[#5a3a1e]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111] py-3 font-semibold text-white transition hover:bg-[#5a3a1e] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-10 text-center text-xs uppercase tracking-[0.3em] text-gray-400">
              ANFEL K APP
              <br />
              Professional Edition
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
