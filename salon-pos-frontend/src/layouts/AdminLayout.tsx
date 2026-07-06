import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Scissors,
  Receipt,
  LogOut,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Clients",
    icon: Users,
    path: "/admin/clients",
  },
  {
    label: "Employees",
    icon: Users,
    path: "/admin/employees",
  },
  {
    label: "Services",
    icon: Scissors,
    path: "/admin/services",
  },
  {
    label: "Tickets",
    icon: Receipt,
    path: "/admin/tickets",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="ak-page flex min-h-screen flex-col lg:flex-row">
      {/* SIDEBAR */}
      <aside className="ak-sidebar flex w-full flex-col lg:min-h-screen lg:w-72">
        {/* LOGO */}
        <div className="border-b border-[#e8e2d8] p-5 text-center lg:p-6 lg:text-left">
          <h1 className="ak-logo text-2xl">ANFAL K</h1>
          <p className="ak-logo-subtitle mt-1 text-[0.58rem]">INSTITUTE</p>
        </div>

        {/* NAV */}
        <nav className="flex flex-1 gap-2 overflow-x-auto p-4 lg:block lg:space-y-3 lg:overflow-visible">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`ak-nav-item flex min-w-max items-center gap-3 text-sm transition lg:w-full ${
                  active
                    ? "text-[#0b0b0b]"
                    : "text-[#6f6f6f] hover:text-[#0b0b0b]"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="border-t border-[#e8e2d8] p-4">
          <button
            onClick={logout}
            className="ak-button flex w-full items-center gap-3 px-4 py-3 text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
