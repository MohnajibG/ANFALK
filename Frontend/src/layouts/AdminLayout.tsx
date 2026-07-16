import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Scissors,
  Receipt,
  CalendarDays,
  UserCog,
  LogOut,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

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
    label: "Categories",
    icon: Layers,
    path: "/admin/categories",
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

  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div
      className="
min-h-screen
bg-[#fff4d6]
flex
"
    >
      {/* SIDEBAR DESKTOP */}

      <aside
        className={`
hidden
h-screen
shrink-0
border-r
border-[#eadfce]
bg-white
transition-all
duration-300
lg:flex
flex-col

${collapsed ? "w-24" : "w-72"}

`}
      >
        {/* LOGO */}

        <div
          className="
relative
border-b
border-[#eadfce]
p-6
"
        >
          <div className={collapsed ? "text-center" : ""}>
            <h1
              className={`
font-serif
font-bold
tracking-[0.15em]

${collapsed ? "text-xl" : "text-3xl"}

`}
            >
              {collapsed ? "AK" : "ANFEL K"}
            </h1>

            {!collapsed && (
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
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
absolute
right-[-14px]
top-8
flex
h-8
w-8
items-center
justify-center
rounded-full
border
border-[#eadfce]
bg-white
shadow
"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* MENU */}

        <nav
          className="
flex-1
space-y-2
overflow-y-auto
p-4
"
        >
          {links.map(({ label, icon: Icon, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`
flex
w-full
items-center
rounded-xl
transition

${collapsed ? "justify-center px-3 py-3" : "gap-4 px-4 py-3"}


${isActive(path) ? "bg-[#111] text-white" : "text-[#6f6257] hover:bg-[#f7efe2]"}

`}
            >
              <Icon size={20} />

              {!collapsed && (
                <span
                  className="
text-sm
font-medium
"
                >
                  {label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className={`
m-4
flex
items-center
rounded-xl
bg-[#111]
py-3
text-white

${collapsed ? "justify-center" : "justify-center gap-3"}

`}
        >
          <LogOut size={18} />

          {!collapsed && "Logout"}
        </button>
      </aside>

      {/* MOBILE HEADER */}

      <header
        className="
fixed
top-0
left-0
right-0
z-30
border-b
border-[#eadfce]
bg-white
lg:hidden
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
      </header>

      {/* MAIN */}

      <main
        className="
flex-1
min-w-0
min-h-screen
p-4
pb-24
sm:p-6
lg:p-8
"
      >
        <Outlet />
      </main>
    </div>
  );
}
