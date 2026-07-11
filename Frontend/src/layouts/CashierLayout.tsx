import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Receipt,
  LogOut,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/cashier",
  },
  {
    label: "Point of Sale",
    icon: ShoppingCart,
    path: "/cashier/pos",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/cashier/customers",
  },
  {
    label: "Tickets",
    icon: Receipt,
    path: "/cashier/tickets",
  },
];

export default function CashierLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F6F6F6]">
      {/* SIDEBAR */}
      <aside className="flex w-72 flex-col bg-[#111111] text-[#FFF4D6]">
        {/* LOGO */}
        <div className="border-b border-white/10 p-6">
          <h1 className="font-[Cinzel] text-2xl tracking-[3px]">ANFEL K</h1>

          <p className="text-xs tracking-[4px] text-white/60">INSTITUTE</p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[2px] text-[#D8B98A]">
            CASHIER
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            const active =
              location.pathname === link.path ||
              (link.path !== "/cashier" &&
                location.pathname.startsWith(link.path));

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-[#3E2C23] text-[#FFF4D6]"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/20"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto bg-[#F8F8F8] p-8">
        <Outlet />
      </main>
    </div>
  );
}
