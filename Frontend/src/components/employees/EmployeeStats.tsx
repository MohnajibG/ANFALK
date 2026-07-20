import { motion } from "framer-motion";
import { Users, UserCheck, WalletCards } from "lucide-react";

import type { Employee } from "../../types/employee";

interface EmployeeStatsProps {
  employees: Employee[];
}

export default function EmployeeStats({ employees }: EmployeeStatsProps) {
  const total = employees.length;

  const active = employees.filter((employee) => employee.isActive).length;

  const cashiers = employees.filter(
    (employee) => employee.role === "cashier",
  ).length;

  const stats = [
    {
      title: "Total employés",
      value: total,
      icon: Users,
    },

    {
      title: "Employés actifs",
      value: active,
      icon: UserCheck,
    },

    {
      title: "Caissiers",
      value: cashiers,
      icon: WalletCards,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item) => (
        <motion.div
          key={item.title}
          whileHover={{
            y: -4,
          }}
          className="rounded-3xl border border-(--border) bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-(--muted)">{item.title}</p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream) text-(--brown)">
              <item.icon size={20} />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-(--black)">
            {item.value}
          </h2>
        </motion.div>
      ))}
    </div>
  );
}
