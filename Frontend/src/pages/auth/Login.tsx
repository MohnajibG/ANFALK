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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

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

      if (!response.ok) {
        throw new Error(data.message || "Email ou mot de passe incorrect");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      const role = data.user.role as Role;

      if (data.user.mustChangePassword) {
        navigate("/change-password");
        return;
      }

      const dashboardRoutes: Record<Role, string> = {
        admin: "/admin/dashboard",
        cashier: "/cashier/dashboard",
        employee: "/employee/dashboard",
      };

      const dashboard = dashboardRoutes[role];

      if (!dashboard) {
        throw new Error("Rôle utilisateur invalide");
      }

      navigate(dashboard);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de se connecter au serveur",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-(--cream) bg-cover bg-center p-4 sm:p-6 lg:bg-none lg:p-8"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80)",
      }}
    >
      <div className="absolute inset-0 bg-black/40 lg:hidden" />

      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-(--white) shadow-(--shadow-md) lg:max-w-6xl lg:flex-row">
        <div className="relative hidden min-h-162.5 flex-1 lg:flex">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
            alt="Institut ANFEL K"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex flex-col justify-end p-12 text-white">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-title text-6xl font-bold tracking-[0.15em]"
            >
              ANFEL K
            </motion.h1>

            <p className="mt-3 font-body text-xs uppercase tracking-[0.5em] text-white/80">
              INSTITUTE
            </p>

            <p className="mt-8 max-w-sm font-body text-lg text-white/80">
              Système de gestion beauté pour instituts modernes
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-md flex-col"
          >
            <div className="mb-10">
              <h2 className="font-title text-4xl font-bold text-(--dark)">
                Bienvenue
              </h2>

              <p className="mt-3 font-body text-sm text-(--muted)">
                Connectez-vous à votre espace professionnel
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-body text-sm font-semibold text-(--text)">
                  Email
                </label>

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@anfelk.com"
                  className="w-full appearance-none rounded-2xl border border-(--border) bg-(--white) px-6 py-4 font-body text-base outline-none transition placeholder:text-(--muted) focus:border-(--gold) focus:ring-4 focus:ring-(--gold)/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-body text-sm font-semibold text-(--text)">
                  Mot de passe
                </label>

                <div className="relative flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full appearance-none rounded-2xl border border-(--border) bg-(--white) px-6 py-4 pr-14 font-body text-base outline-none transition placeholder:text-(--muted) focus:border-(--gold) focus:ring-4 focus:ring-(--gold)/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-(--muted) transition hover:text-(--black)"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-(--black) px-8 font-body font-semibold text-(--white) transition hover:bg-(--gold) disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <div className="mt-10 text-center font-body text-xs uppercase tracking-[0.3em] text-(--muted)">
              ANFEL K APP
              <br />
              Édition professionnelle
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
