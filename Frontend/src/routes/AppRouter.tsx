import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";

import AdminLayout from "../layouts/AdminLayout";
import CashierLayout from "../layouts/CashierLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// ADMIN
import Dashboard from "../pages/admin/Dashboard";
import Clients from "../pages/admin/Clients";
import Employees from "../pages/admin/Employees";
import Services from "../pages/admin/Services";

// CASHIER
import CashierDashboard from "../pages/cashier/Dashboard";
import POS from "../pages/cashier/POS";
import Customers from "../pages/cashier/Customers";
import Tickets from "../pages/cashier/Tickets";

// EMPLOYEE
import EmployeeDashboard from "../pages/employee/Dashboard";
import MyAppointments from "../pages/employee/MyAppointments";
import MyStatistics from "../pages/employee/MyStatistics";
import EmployeeServices from "../pages/employee/Services";
import EmployeeProfile from "../pages/employee/Profile";
import Categories from "../pages/admin/Categories";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===================== */}
        {/* 🌐 PUBLIC */}
        {/* ===================== */}

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
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="clients" element={<Clients />} />

          <Route path="employees" element={<Employees />} />

          <Route path="categories" element={<Categories />} />

          <Route path="services" element={<Services />} />
          <Route
            path="appointments"
            element={<Navigate to="/admin/appointments/2026-03" replace />}
          />
          <Route path="appointments/:month" element={<MyAppointments />} />
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
          <Route index element={<CashierDashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="tickets" element={<Tickets />} />
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
          {/* DEFAULT DASHBOARD */}

          <Route index element={<EmployeeDashboard />} />

          {/* SERVICES */}

          <Route path="services" element={<EmployeeServices />} />

          {/* APPOINTMENTS */}

          <Route path="appointments" element={<MyAppointments />} />

          {/* STATISTICS DEFAULT */}

          <Route
            path="statistics"
            element={<Navigate to="/employee/statistics/2026-03" replace />}
          />

          {/* STATISTICS BY MONTH */}

          <Route path="statistics/:month" element={<MyStatistics />} />

          {/* PROFILE */}

          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        {/* ===================== */}
        {/* 404 */}
        {/* ===================== */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
