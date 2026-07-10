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

const months = [
  {
    label: "January 2026",
    path: "/employee/statistics/2026-01",
  },
  {
    label: "February 2026",
    path: "/employee/statistics/2026-02",
  },
  {
    label: "March 2026",
    path: "/employee/statistics/2026-03",
  },
  {
    label: "April 2026",
    path: "/employee/statistics/2026-04",
  },
];

const links = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/employee",
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

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openStats, setOpenStats] = useState(false);

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
          <h1 className="font-[Cinzel] text-2xl tracking-[3px]">ANFAL K</h1>

          <p className="text-xs tracking-[4px] text-white/60">INSTITUTE</p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[2px] text-[#D8B98A]">
            EMPLOYEE
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            // STATISTICS MENU
            if (link.label === "My Statistics") {
              return (
                <div key={link.path}>
                  <button
                    onClick={() => setOpenStats(!openStats)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                      location.pathname.includes("/statistics")
                        ? "bg-[#3E2C23] text-[#FFF4D6]"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      {link.label}
                    </div>

                    <ChevronDown
                      size={16}
                      className={`transition ${openStats ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openStats && (
                    <div className="ml-6 mt-2 space-y-1">
                      {months.map((month) => (
                        <button
                          key={month.path}
                          onClick={() => navigate(month.path)}
                          className={`block w-full rounded-lg px-3 py-2 text-left text-xs transition ${
                            location.pathname === month.path
                              ? "bg-[#D8B98A] text-[#111111]"
                              : "text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {month.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  location.pathname === link.path
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

      {/* CONTENT */}

      <main className="flex-1 overflow-auto bg-[#F8F8F8] p-8">
        <Outlet />
      </main>
    </div>
  );
}
