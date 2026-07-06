import { Outlet, useNavigate } from "react-router-dom";

export default function EmployeeLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="ak-page flex min-h-screen flex-col lg:flex-row">
      <aside className="ak-sidebar w-full p-5 text-center lg:min-h-screen lg:w-64 lg:p-6 lg:text-left">
        <h1 className="ak-logo mb-1 text-2xl">MY AREA</h1>
        <p className="ak-logo-subtitle mb-10 text-[0.58rem]">ANFAL K</p>

        <nav className="flex gap-2 overflow-x-auto text-sm font-semibold lg:block lg:space-y-3 lg:overflow-visible">
          <p className="ak-nav-item">Dashboard</p>
          <p className="ak-nav-item">My Stats</p>
          <p className="ak-nav-item">History</p>
        </nav>

        <button
          onClick={logout}
          className="ak-button mt-10 w-full py-3"
        >
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
