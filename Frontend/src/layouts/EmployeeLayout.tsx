import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const links = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/employee/dashboard",
  },
  {
    label: "My Services",
    icon: Briefcase,
    path: "/employee/services",
  },
  {
    label: "My Appointments",
    icon: CalendarDays,
    path: "/employee/appointments",
  },
  {
    label: "My Statistics",
    icon: BarChart3,
    path: "/employee/statistics",
  },
  {
    label: "My Profile",
    icon: User,
    path: "/employee/profile",
  },
];

const months = ["2026-01", "2026-02", "2026-03", "2026-04"];

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openStats, setOpenStats] = useState(
    location.pathname.includes("statistics"),
  );

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <aside className="hidden w-72 flex-col bg-[#111] text-[#FFF4D6] md:flex">
        <div className="border-b border-white/10 p-6">
          <h1 className="font-[Cinzel] text-2xl tracking-[3px]">ANFEL K</h1>

          <p className="text-xs tracking-[4px] text-white/60">INSTITUTE</p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[2px] text-[#D8B98A]">
            EMPLOYEE
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {links.map(({ label, icon: Icon, path }) => {
            if (label === "My Statistics") {
              return (
                <div key={path}>
                  <button
                    onClick={() => setOpenStats(!openStats)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm ${
                      location.pathname.includes("statistics")
                        ? "bg-[#3E2C23]"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {label}
                    </span>

                    <ChevronDown
                      size={16}
                      className={
                        openStats ? "rotate-180 transition" : "transition"
                      }
                    />
                  </button>

                  {openStats && (
                    <div className="ml-6 mt-2 space-y-1">
                      {months.map((month) => (
                        <button
                          key={month}
                          onClick={() =>
                            navigate(`/employee/statistics/${month}`)
                          }
                          className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/60 hover:bg-white/10"
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                  location.pathname === path
                    ? "bg-[#3E2C23]"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
