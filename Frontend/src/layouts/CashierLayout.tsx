import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Receipt,
  ShoppingCart,
  UserRound,
  Users,
} from "lucide-react";

const links = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/cashier/dashboard" },
  { label: "Point de vente", icon: ShoppingCart, path: "/cashier/pos" },
  { label: "Clients", icon: Users, path: "/cashier/customers" },
  { label: "Rendez-vous", icon: CalendarDays, path: "/cashier/appointments" },
  { label: "Liste d'attente", icon: ListTodo, path: "/cashier/waitlist" },
  { label: "Tickets", icon: Receipt, path: "/cashier/tickets" },
  { label: "Profil", icon: UserRound, path: "/cashier/profile" },
];

const CashierLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const active = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="role-cashier flex min-h-screen bg-(--cream)">
      {/* MOBILE HEADER */}
      <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-(--role-shell-border) bg-(--role-shell-bg) px-5 md:hidden">
        <div>
          <h1 className="font-title text-xl tracking-widest text-(--role-shell-text)">
            ANFAL K
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-(--role-shell-accent)">
            INSTITUTE
          </p>
          <p className="text-xs text-(--role-shell-text)/60">
            {user.firstName || "Caissier"}
          </p>
        </div>

        <button
          onClick={logout}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--role-shell-accent) text-(--role-shell-accent-text)"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-(--role-shell-border) bg-(--role-shell-bg) md:hidden">
        {links.slice(0, 5).map(({ path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${active(path) ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)" : "text-(--role-shell-text)"}`}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>

      {/* TABLET SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-20 flex-col items-center border-r border-(--role-shell-border) bg-(--role-shell-bg) py-6 md:flex lg:hidden">
        <h1 className="mb-8 font-title text-xl text-(--role-shell-text)">AK</h1>

        <nav className="flex flex-1 flex-col gap-3">
          {links.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              title={label}
              onClick={() => navigate(path)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${active(path) ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)" : "text-(--role-shell-text) hover:bg-white/10"}`}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/20 text-red-300"
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 hidden h-screen flex-col border-r border-(--role-shell-border) bg-(--role-shell-bg) transition-all duration-300 lg:flex ${collapsed ? "w-24" : "w-72"}`}
      >
        <div className="relative border-b border-(--role-shell-border) p-6">
          <h1 className="font-title text-2xl tracking-widest text-(--role-shell-text)">
            {collapsed ? "AK" : "ANFAL K"}
          </h1>

          {!collapsed && (
            <>
              <p className="mt-2 text-[11px] tracking-[0.45em] text-(--role-shell-accent)">
                INSTITUTE
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-(--role-shell-text)/60">
                CAISSIER
              </p>
              <p className="mt-2 text-sm text-(--role-shell-text)/70">
                {user.firstName} {user.lastName}
              </p>
            </>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-4 top-8 flex h-8 w-8 items-center justify-center rounded-full border border-(--role-shell-border) bg-(--role-shell-bg) text-(--role-shell-text)"
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          {links.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center rounded-xl transition ${collapsed ? "justify-center py-3" : "gap-4 px-4 py-3"} ${active(path) ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)" : "text-(--role-shell-text)/70 hover:bg-white/10"}`}
            >
              <Icon size={20} />

              {!collapsed && <span className="text-sm">{label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="m-4 flex items-center justify-center gap-3 rounded-xl bg-(--role-shell-accent) py-3 text-(--role-shell-accent-text)"
        >
          <LogOut size={18} />

          {!collapsed && "Déconnexion"}
        </button>
      </aside>

      {/* CONTENT */}
      <main
        className={`min-h-screen w-full flex-1 pt-20 pb-24 md:ml-20 md:pt-6 lg:pb-6 ${collapsed ? "lg:ml-24" : "lg:ml-72"}`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CashierLayout;
