import { Navigate } from "react-router-dom";

export default function RoleRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "cashier" | "employee";
}) {
  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const userRole = user?.role;

  console.log("ROLE CHECK:", userRole);

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;

      case "cashier":
        return <Navigate to="/cashier/dashboard" replace />;

      case "employee":
        return <Navigate to="/employee/dashboard" replace />;

      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
