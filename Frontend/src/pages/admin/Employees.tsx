/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, User, Pencil, Eye, Power, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run";

type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  speciality?: string;
  role: "employee" | "cashier";
  isActive: boolean;
};

export default function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/employees?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setEmployees(data.employees || data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 400);

    return () => clearTimeout(timer);
  }, [loadEmployees]);

  const toggleStatus = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/employees/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="rounded-3xl border border-[#eadfce] bg-white p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
            Administration
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#111]">
            Employees Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your team members and access.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3E2C23] px-5 py-3 text-[#fff4d6]"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="rounded-3xl border border-[#eadfce] bg-white p-4 flex items-center gap-3">
        <Search size={20} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employee..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center">
          Loading employees...
        </div>
      ) : (
        <div className="rounded-3xl border border-[#eadfce] bg-white overflow-hidden">
          <div className="hidden md:grid grid-cols-7 border-b p-4 text-sm font-semibold">
            <span>Name</span>
            <span>Role</span>
            <span>Speciality</span>
            <span>Status</span>
            <span>Phone</span>
            <span>Activity</span>
            <span>Actions</span>
          </div>

          <div className="divide-y">
            {employees.map((employee) => (
              <motion.div
                key={employee._id}
                whileHover={{ backgroundColor: "#faf7f0" }}
                className="grid gap-4 p-5 md:grid-cols-7 items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4d6]">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{employee.role}</p>
                  </div>
                </div>

                <span className="capitalize">{employee.role}</span>

                <span className="flex items-center gap-2">
                  <Scissors size={15} />
                  {employee.speciality || "-"}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold w-fit ${employee.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {employee.isActive ? "Active" : "Inactive"}
                </span>

                <span>{employee.phone || "-"}</span>

                <span className="text-sm text-gray-500">Current</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/employees/${employee._id}`)}
                    className="rounded-lg bg-[#fff4d6] p-2"
                  >
                    <Eye size={16} />
                  </button>

                  <button className="rounded-lg bg-[#3E2C23] p-2 text-[#fff4d6]">
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => toggleStatus(employee._id)}
                    className="rounded-lg bg-red-50 p-2 text-red-500"
                  >
                    <Power size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Employees"
          value={employees.length.toString()}
        />
        <SummaryCard
          title="Active Employees"
          value={employees.filter((e) => e.isActive).length.toString()}
        />
        <SummaryCard title="Roles" value="Employee / Cashier" />
      </div>

      {showModal && (
        <EmployeeModal
          close={() => setShowModal(false)}
          refresh={loadEmployees}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-[#eadfce] bg-white p-6"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </motion.div>
  );
}

function EmployeeModal({
  close,
  refresh,
}: {
  close: () => void;
  refresh: () => void;
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "employee",
    speciality: "Hair",
  });

  const token = localStorage.getItem("token");

  const createEmployee = async () => {
    await fetch("https://site--ankelk--dnxhn8mdblq5.code.run/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Add Employee</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full rounded-xl border p-3 outline-none"
          />
        ))}

        <div className="flex gap-3">
          <button onClick={close} className="flex-1 rounded-xl border py-3">
            Cancel
          </button>
          <button
            onClick={createEmployee}
            className="flex-1 rounded-xl bg-[#3E2C23] text-[#fff4d6] py-3"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
