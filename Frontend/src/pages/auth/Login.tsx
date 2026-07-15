/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Role = "admin" | "cashier" | "employee";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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

      if (data.user.mustChangePassword) {
        navigate("/change-password");

        return;
      }

      const role: Role = data.user.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      }

      if (role === "cashier") {
        navigate("/cashier/dashboard");
      }

      if (role === "employee") {
        navigate("/employee/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
min-h-screen
w-full
bg-[#fff4d6]
flex
items-center
justify-center
p-4
lg:p-0
"
    >
      <div
        className="
w-full
max-w-6xl
min-h-[650px]
bg-white
rounded-3xl
overflow-hidden
shadow-2xl
grid
lg:grid-cols-2
"
      >
        {/* LEFT IMAGE */}

        <div
          className="
hidden
lg:block
relative
"
        >
          <img
            src="
https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80
"
            alt="ANFEL K Institute"
            className="
absolute
inset-0
h-full
w-full
object-cover
"
          />

          <div
            className="
absolute
inset-0
bg-black/40
"
          />

          <div
            className="
absolute
bottom-14
left-12
text-white
"
          >
            <motion.h1
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="
font-serif
text-6xl
tracking-[0.15em]
font-bold
"
            >
              ANFEL K
            </motion.h1>

            <p
              className="
mt-3
uppercase
tracking-[0.5em]
text-sm
text-white/80
"
            >
              INSTITUTE
            </p>

            <p
              className="
mt-8
max-w-sm
text-white/80
text-lg
"
            >
              Beauty management system for modern institutes
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN */}

        <div
          className="
flex
items-center
justify-center
p-8
sm:p-12
"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
w-full
max-w-md
"
          >
            <div
              className="
mb-10
"
            >
              <h2
                className="
font-serif
text-4xl
font-bold
text-[#111]
"
              >
                Welcome Back
              </h2>

              <p
                className="
mt-3
text-sm
text-gray-500
"
              >
                Connect to your professional workspace
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="
space-y-6
"
            >
              <div>
                <label
                  className="
text-sm
font-medium
text-gray-700
"
                >
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@anfelk.com"
                  className="
mt-2
w-full
rounded-xl
border
border-gray-200
px-4
py-3
outline-none
focus:border-[#5a3a1e]
focus:ring-2
focus:ring-[#5a3a1e]/20
"
                />
              </div>

              <div>
                <label
                  className="
text-sm
font-medium
text-gray-700
"
                >
                  Password
                </label>

                <div
                  className="
relative
mt-2
"
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="
w-full
rounded-xl
border
border-gray-200
px-4
py-3
pr-12
outline-none
focus:border-[#5a3a1e]
focus:ring-2
focus:ring-[#5a3a1e]/20
"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
absolute
right-4
top-1/2
-translate-y-1/2
text-gray-400
"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="
rounded-xl
bg-red-50
px-4
py-3
text-sm
text-red-600
"
                >
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="
w-full
rounded-xl
bg-[#111]
py-3
text-white
font-semibold
transition
hover:bg-[#5a3a1e]
disabled:opacity-60
flex
justify-center
items-center
gap-2
"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div
              className="
mt-10
text-center
text-xs
uppercase
tracking-[0.3em]
text-gray-400
"
            >
              ANFEL K APP
              <br />
              Professional Edition
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
