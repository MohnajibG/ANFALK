import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";

import AdminLayout from "../layouts/AdminLayout";
import CashierLayout from "../layouts/CashierLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// =====================
// ADMIN
// =====================

import Dashboard from "../pages/admin/Dashboard";
import Clients from "../pages/admin/Clients";
import Employees from "../pages/admin/Employees";
import Categories from "../pages/admin/Categories";
import Services from "../pages/admin/Services";
import Appointments from "../pages/admin/Appointments";
// import Tickets from "../pages/admin/Tickets";

// =====================
// CASHIER
// =====================

import CashierDashboard from "../pages/cashier/Dashboard";
import POS from "../pages/cashier/POS";
import Customers from "../pages/cashier/Customers";
import CashierTickets from "../pages/cashier/Tickets";

// =====================
// EMPLOYEE
// =====================

import EmployeeDashboard from "../pages/employee/Dashboard";
import MyAppointments from "../pages/employee/MyAppointments";
import MyStatistics from "../pages/employee/MyStatistics";
import EmployeeServices from "../pages/employee/Services";
import EmployeeProfile from "../pages/employee/Profile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================
            PUBLIC
        ====================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* =====================
            ADMIN
        ====================== */}

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
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="clients" element={<Clients />} />

          <Route path="employees" element={<Employees />} />

          <Route path="categories" element={<Categories />} />

          <Route path="services" element={<Services />} />

          <Route path="appointments" element={<Appointments />} />

          {/* <Route path="tickets" element={<Tickets />} /> */}
        </Route>

        {/* =====================
            CASHIER
        ====================== */}

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
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<CashierDashboard />} />

          <Route path="customers" element={<Customers />} />

          <Route path="pos" element={<POS />} />

          <Route path="tickets" element={<CashierTickets />} />
        </Route>

        {/* =====================
            EMPLOYEE
        ====================== */}

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
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<EmployeeDashboard />} />

          <Route path="appointments" element={<MyAppointments />} />

          <Route path="services" element={<EmployeeServices />} />

          <Route
            path="statistics"
            element={<Navigate to="/employee/statistics/2026-03" replace />}
          />

          <Route path="statistics/:month" element={<MyStatistics />} />

          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        {/* =====================
            404
        ====================== */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
