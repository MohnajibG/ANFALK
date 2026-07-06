import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Role = "admin" | "cashier" | "employee";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 LOGIN PAR BOUTONS (TEST DASHBOARD)
  const loginAs = (role: Role) => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("role", role);

    if (role === "admin") navigate("/admin");
    if (role === "cashier") navigate("/cashier");
    if (role === "employee") navigate("/employee");
  };

  // 🔐 LOGIN FORM (future API)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      let role: Role = "cashier";

      if (email.includes("admin")) role = "admin";
      else if (email.includes("employee")) role = "employee";

      localStorage.setItem("token", "fake-token");
      localStorage.setItem("role", role);

      setLoading(false);

      if (role === "admin") navigate("/admin");
      else if (role === "cashier") navigate("/cashier");
      else navigate("/employee");
    }, 1000);
  };

  return (
    <div className="ak-page grid min-h-screen w-full place-items-center px-4 py-24 lg:grid-cols-2 lg:px-0 lg:py-0">
      {/* LEFT IMAGE */}
      <div className="relative hidden h-screen w-full overflow-hidden lg:flex">
        <img
          src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1600&q=80"
          className="h-full w-full object-cover"
          alt="Luxury beauty studio"
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute bottom-16 left-10 right-10 text-white">
          <h1 className="font-[Cinzel] text-5xl font-bold uppercase tracking-[0.12em] text-white">
            ANFAL K
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.42em] text-white/80">
            Institute
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full justify-center px-0 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="ak-card w-full max-w-md p-6 sm:p-10"
        >
        <h2 className="font-[Cinzel] text-3xl text-[#0b0b0b]">Sign In</h2>

        <p className="ak-muted mt-2 text-sm">
          Access the ANFAL K Institute management area.
        </p>

        {/* 🔥 TEST BUTTONS */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => loginAs("admin")}
            className="ak-button w-full py-3"
          >
            Admin Dashboard
          </button>

          <button
            onClick={() => loginAs("cashier")}
            className="ak-button ak-button-light w-full py-3"
          >
            Cashier POS
          </button>

          <button
            onClick={() => loginAs("employee")}
            className="ak-button ak-button-light w-full py-3"
          >
            Employee Area
          </button>
        </div>

        {/* DIVIDER */}
        <div className="ak-muted my-6 text-center text-xs font-semibold uppercase tracking-[0.24em]">
          or continue with email
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="ak-input"
          />

          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              placeholder="Password"
              className="ak-input pr-12"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c6257]"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ak-button w-full py-3 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
      </div>
    </div>
  );
}
