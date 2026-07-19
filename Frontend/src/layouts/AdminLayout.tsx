import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Layers,
  LogOut,
  Receipt,
  Scissors,
  UserCog,
  Users,
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
    label: "Employés",
    icon: UserCog,
    path: "/admin/employees",
  },
  {
    label: "Catégories",
    icon: Layers,
    path: "/admin/categories",
  },
  {
    label: "Services",
    icon: Scissors,
    path: "/admin/services",
  },
  {
    label: "Rendez-vous",
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

  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const active = (path: string) => location.pathname.startsWith(path);

  return (
    <div
      className="
        flex
        min-h-screen
        bg-(--cream)
      "
    >
      {/* MOBILE HEADER */}

      <header
        className="
          fixed
          left-0
          top-0
          z-40
          flex
          h-16
          w-full
          items-center
          justify-between
          border-b
          border-(--border)
          bg-white
          px-5
          md:hidden
        "
      >
        <div>
          <h1
            className="
              font-title
              text-xl
              tracking-widest
              text-(--black)
            "
          >
            ANFAL K
          </h1>

          <p
            className="
              text-[10px]
              tracking-[0.4em]
              text-(--champagne)
            "
          >
            INSTITUTE
          </p>
        </div>

        <button
          onClick={logout}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-(--black)
            text-(--cream)
          "
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* MOBILE NAV */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          z-50
          flex
          h-20
          w-full
          items-center
          justify-around
          border-t
          border-(--border)
          bg-white
          md:hidden
        "
      >
        {links.slice(0, 5).map(({ path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              transition

              ${
                active(path)
                  ? "bg-(--black) text-(--cream)"
                  : "text-(--champagne)"
              }
            `}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>

      {/* TABLET SIDEBAR */}

      <aside
        className="
          fixed
          left-0
          top-0
          hidden
          h-screen
          w-20
          flex-col
          items-center
          border-r
          border-(--border)
          bg-white
          py-6
          md:flex
          lg:hidden
        "
      >
        <h1
          className="
            mb-8
            font-title
            text-xl
          "
        >
          AK
        </h1>

        <nav
          className="
            flex
            flex-1
            flex-col
            gap-3
          "
        >
          {links.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              title={label}
              onClick={() => navigate(path)}
              className={`
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl

                ${
                  active(path)
                    ? "bg-(--black) text-(--cream)"
                    : "text-(--champagne) hover:bg-(--cream)"
                }
              `}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-(--black)
            text-(--cream)
          "
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* DESKTOP SIDEBAR */}

      <aside
        className={`
          fixed
          left-0
          top-0
          hidden
          h-screen
          flex-col
          border-r
          border-(--border)
          bg-white
          transition-all
          duration-300
          lg:flex

          ${collapsed ? "w-24" : "w-72"}
        `}
      >
        <div
          className="
            relative
            border-b
            border-(--border)
            p-6
          "
        >
          <h1
            className="
              font-title
              text-2xl
              tracking-widest
            "
          >
            {collapsed ? "AK" : "ANFAL K"}
          </h1>

          {!collapsed && (
            <p
              className="
                mt-2
                text-[11px]
                tracking-[0.45em]
                text-(--champagne)
              "
            >
              INSTITUTE
            </p>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              absolute
              -right-4
              top-8
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-(--border)
              bg-white
            "
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        <nav
          className="
            flex
            flex-1
            flex-col
            gap-2
            overflow-y-auto
            p-4
          "
        >
          {links.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`
                flex
                items-center
                rounded-xl
                transition

                ${collapsed ? "justify-center py-3" : "gap-4 px-4 py-3"}

                ${
                  active(path)
                    ? "bg-(--black) text-(--cream)"
                    : "text-(--champagne) hover:bg-(--cream)"
                }
              `}
            >
              <Icon size={20} />

              {!collapsed && <span className="text-sm">{label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="
            m-4
            flex
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-(--black)
            py-3
            text-(--cream)
          "
        >
          <LogOut size={18} />

          {!collapsed && "Déconnexion"}
        </button>
      </aside>

      {/* PAGE CONTENT */}

      <main
        className="
          min-h-screen
          w-full
          flex-1
          pt-20
          pb-24
          md:ml-20
          md:pt-6
          lg:ml-72
          lg:pb-6
        "
      >
        <div
          className="
            p-4
            sm:p-6
            lg:p-8
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
