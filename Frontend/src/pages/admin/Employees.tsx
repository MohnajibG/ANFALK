import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  User,
  Pencil,
  Eye,
  Power,
  Scissors,
  Euro,
} from "lucide-react";

type Speciality = "Coiffure" | "Manucure" | "Maquillage";

type Employee = {
  id: string;
  name: string;
  phone: string;
  speciality: Speciality;
  status: "Active" | "Inactive";
  services: number;
  revenue: string;
  lastActivity: string;
};

const employeesData: Employee[] = [
  {
    id: "1",
    name: "Sarah",
    phone: "06 12 34 56 78",
    speciality: "Coiffure",
    status: "Active",
    services: 145,
    revenue: "5 850 €",
    lastActivity: "Today",
  },

  {
    id: "2",
    name: "Lina",
    phone: "07 45 22 11 90",
    speciality: "Manucure",
    status: "Active",
    services: 98,
    revenue: "4 200 €",
    lastActivity: "Yesterday",
  },

  {
    id: "3",
    name: "Sonia",
    phone: "06 88 44 22 11",
    speciality: "Maquillage",
    status: "Inactive",
    services: 56,
    revenue: "2 900 €",
    lastActivity: "10 April 2026",
  },
];

export default function Employees() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const employees = employeesData.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="ak-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="ak-kicker">Administration</p>

          <h1 className="mt-2 font-[Cinzel] text-3xl font-bold">
            Employees Management
          </h1>

          <p className="ak-muted mt-2">
            Manage your team and employee performance.
          </p>
        </div>

        <button
          className="
flex items-center gap-2
rounded-xl
bg-[#3E2C23]
px-5 py-3
text-[#FFF4D6]
"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* SEARCH */}

      <div className="ak-card flex items-center gap-3 p-4">
        <Search size={20} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employee..."
          className="
w-full
bg-transparent
outline-none
"
        />
      </div>

      {/* EMPLOYEE TABLE */}

      <div className="ak-card overflow-hidden">
        <div
          className="
hidden
grid-cols-7
border-b
p-4
text-sm
font-semibold
md:grid
"
        >
          <span>Name</span>

          <span>Speciality</span>

          <span>Status</span>

          <span>Services</span>

          <span>Revenue</span>

          <span>Activity</span>

          <span>Actions</span>
        </div>

        <div className="divide-y">
          {employees.map((employee) => (
            <motion.div
              key={employee.id}
              whileHover={{
                backgroundColor: "#faf7f0",
              }}
              className="
grid
gap-4
p-5
items-center
md:grid-cols-7
"
            >
              {/* NAME */}

              <div className="flex items-center gap-3">
                <div
                  className="
flex h-10 w-10
items-center justify-center
rounded-full
bg-[#FFF4D6]
"
                >
                  <User size={18} />
                </div>

                <div>
                  <p className="font-semibold">{employee.name}</p>

                  <p className="text-xs text-gray-500">{employee.phone}</p>
                </div>
              </div>

              {/* SPECIALITY */}

              <div className="flex items-center gap-2">
                <Scissors size={15} />

                {employee.speciality}
              </div>

              {/* STATUS */}

              <div>
                <span
                  className={`
rounded-full
px-3 py-1
text-xs
font-semibold

${
  employee.status === "Active"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700"
}

`}
                >
                  {employee.status}
                </span>
              </div>

              {/* SERVICES */}

              <div>
                {employee.services}

                <p className="text-xs text-gray-400">performed</p>
              </div>

              {/* REVENUE */}

              <div
                className="
flex items-center gap-1
font-semibold
"
              >
                <Euro size={14} />

                {employee.revenue}
              </div>

              {/* ACTIVITY */}

              <div className="text-sm text-gray-500">
                {employee.lastActivity}
              </div>

              {/* ACTIONS */}

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/employees/${employee.id}`)}
                  className="
rounded-lg
bg-[#FFF4D6]
p-2
transition
hover:scale-105
"
                >
                  <Eye size={16} />
                </button>

                <button
                  className="
rounded-lg
bg-[#3E2C23]
p-2
text-[#FFF4D6]
"
                >
                  <Pencil size={16} />
                </button>

                <button
                  className="
rounded-lg
bg-red-50
p-2
text-red-500
"
                >
                  <Power size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}

      <div
        className="
grid
gap-4
md:grid-cols-3
"
      >
        <SummaryCard title="Total Employees" value="12" />

        <SummaryCard title="Active Employees" value="10" />

        <SummaryCard title="Monthly Payroll" value="18 500 €" />
      </div>
    </div>
  );
}

function SummaryCard({
  title,

  value,
}: {
  title: string;

  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="ak-card p-6"
    >
      <p className="ak-muted text-sm">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </motion.div>
  );
}
