import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  console.log("PROTECTED CHECK:", {
    token: !!token,
    user: !!user,
  });

  if (!token || !user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
