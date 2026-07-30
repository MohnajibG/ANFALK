import { Users, UserCheck, WalletCards } from "lucide-react";
import StatCard from "../ui/StatCard";
import type { Employee } from "../../types/employee";

const EmployeeStats = ({ employees }: { employees: Employee[] }) => {
  const total = employees.length;
  const active = employees.filter((e) => e.isActive).length;
  const cashiers = employees.filter((e) => e.role === "cashier").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={Users}
        title="Total employés"
        value={total}
        accent="black"
      />
      <StatCard
        icon={UserCheck}
        title="Employés actifs"
        value={active}
        accent="success"
      />
      <StatCard
        icon={WalletCards}
        title="Caissiers"
        value={cashiers}
        accent="gold"
      />
    </div>
  );
};

export default EmployeeStats;
