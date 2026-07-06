import { Navigate } from "react-router-dom";

export default function RoleRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "cashier" | "employee";
}) {
  const userRole = localStorage.getItem("role");

  if (userRole !== role) {
    // redirection intelligente selon rôle réel
    if (userRole === "admin") return <Navigate to="/admin" />;
    if (userRole === "cashier") return <Navigate to="/cashier" />;
    if (userRole === "employee") return <Navigate to="/employee" />;

    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
