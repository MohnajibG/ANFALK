import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";

import AdminLayout from "../layouts/AdminLayout";
import CashierLayout from "../layouts/CashierLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Dashboard from "../pages/admin/Dashboard";
import Clients from "../pages/admin/Clients";
import Employees from "../pages/admin/Employees";

import POS from "../pages/cashier/POS";
import Services from "../pages/admin/Services";

import EmployeeDashboard from "../pages/employee/Dashboard";
import MyAppointments from "../pages/employee/MyAppointments";
import MyStatistics from "../pages/employee/MyStatistics";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ===================== */}
        {/* 👑 ADMIN AREA */}
        {/* ===================== */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="employees" element={<Employees />} />
          <Route path="services" element={<Services />} />
        </Route>

        {/* ===================== */}
        {/* 💰 CASHIER AREA */}
        {/* ===================== */}
        <Route
          path="/cashier/*"
          element={
            <ProtectedRoute>
              <RoleRoute role="cashier">
                <CashierLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Cashier Dashboard</div>} />
          <Route path="pos" element={<POS />} />
        </Route>

        {/* ===================== */}
        {/* 💄 EMPLOYEE AREA */}
        {/* ===================== */}
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute>
              <RoleRoute role="employee">
                <EmployeeLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="statistics" element={<MyStatistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
