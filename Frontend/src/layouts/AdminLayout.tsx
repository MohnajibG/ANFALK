import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Scissors,
  Receipt,
  CalendarDays,
  UserCog,
  LogOut,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Clients",
    icon: Users,
    path: "/admin/clients",
  },
  {
    label: "Employees",
    icon: UserCog,
    path: "/admin/employees",
  },
  {
    label: "Services",
    icon: Scissors,
    path: "/admin/services",
  },
  {
    label: "Appointments",
    icon: CalendarDays,
    path: "/admin/appointments",
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fff4d6]">
      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside
        className="
      hidden
      lg:flex
      fixed
      left-0
      top-0
      h-screen
      w-72
      bg-white
      border-r
      border-[#eadfce]
      flex-col
      z-40
      "
      >
        <div className="p-8 border-b border-[#eadfce]">
          <h1
            className="
          font-serif
          text-3xl
          font-bold
          tracking-[0.15em]
          "
          >
            ANFEL K
          </h1>

          <p
            className="
          mt-2
          text-xs
          tracking-[0.45em]
          text-[#8b7560]
          "
          >
            INSTITUTE
          </p>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            const active = location.pathname.startsWith(link.path);

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`
              w-full
              flex
              items-center
              gap-4
              rounded-xl
              px-4
              py-3
              transition

              ${
                active
                  ? "bg-[#111] text-white"
                  : "text-[#6f6257] hover:bg-[#f7efe2]"
              }

              `}
              >
                <Icon size={20} />

                <span className="text-sm font-medium">{link.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="
        m-5
        rounded-xl
        bg-[#111]
        text-white
        py-3
        flex
        items-center
        justify-center
        gap-3
        "
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ================= TABLET + MOBILE HEADER ================= */}

      <header
        className="
      lg:hidden
      sticky
      top-0
      z-30
      bg-white
      border-b
      border-[#eadfce]
      "
      >
        <div
          className="
        flex
        items-center
        justify-between
        px-5
        py-4
        "
        >
          <div>
            <h1
              className="
            font-serif
            text-xl
            font-bold
            tracking-[0.15em]
            "
            >
              ANFEL K
            </h1>

            <p
              className="
            text-[0.55rem]
            tracking-[0.4em]
            text-[#8b7560]
            "
            >
              INSTITUTE
            </p>
          </div>

          <button
            onClick={logout}
            className="
          rounded-xl
          bg-[#111]
          p-3
          text-white
          "
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* TABLET MENU */}

        <nav
          className="
        hidden
        sm:flex
        overflow-x-auto
        gap-3
        px-5
        pb-4
        "
        >
          {links.map((link) => {
            const Icon = link.icon;

            const active = location.pathname.startsWith(link.path);

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`
            flex
            items-center
            gap-2
            whitespace-nowrap
            rounded-xl
            px-4
            py-2
            text-sm

            ${active ? "bg-[#111] text-white" : "bg-[#f7efe2] text-[#6f6257]"}

            `}
              >
                <Icon size={16} />

                {link.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ================= CONTENT ================= */}

      <main
        className="

      lg:ml-72

      p-4

      sm:p-6

      lg:p-8

      pb-24

      "
      >
        <Outlet />
      </main>

      {/* ================= MOBILE BOTTOM ================= */}

      <nav
        className="
      fixed
      bottom-0
      left-0
      right-0
      h-20
      bg-white
      border-t
      border-[#eadfce]
      flex
      items-center
      justify-around
      sm:hidden
      z-50
      "
      >
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;

          const active = location.pathname.startsWith(link.path);

          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`
          flex
          flex-col
          items-center
          text-xs
          gap-1

          ${active ? "text-[#111]" : "text-gray-400"}

          `}
            >
              <Icon size={20} />

              {link.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
