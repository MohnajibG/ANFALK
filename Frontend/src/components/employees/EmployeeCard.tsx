import { motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Power,
  Trash2,
  User,
  Scissors,
  Phone,
} from "lucide-react";

import type { Employee } from "../../types/employee";

interface EmployeeCardProps {
  employee: Employee;

  onStatusChange: (id: string, isActive: boolean) => void;

  onDelete: (id: string) => void;

  onView: (id: string) => void;

  onEdit: (id: string) => void;
}

export default function EmployeeCard({
  employee,

  onStatusChange,

  onDelete,

  onView,

  onEdit,
}: EmployeeCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="flex flex-col gap-5 border-b border-(--border) p-5 last:border-none lg:flex-row lg:items-center lg:justify-between"
    >
      {/* IDENTITE */}

      <div className="flex items-center gap-3 min-w-55">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--cream) text-(--brown)">
          <User size={20} />
        </div>

        <div>
          <p className="font-semibold text-(--black)">
            {employee.firstName} {employee.lastName}
          </p>

          <p className="text-sm text-(--muted)">
            {employee.role === "employee" ? "Employé" : "Caissier"}
          </p>
        </div>
      </div>

      {/* SPECIALITE */}

      <div className="flex items-center gap-2 text-sm">
        <Scissors size={17} className="text-(--brown)" />

        <span>{employee.speciality || "Non définie"}</span>
      </div>

      {/* TELEPHONE */}

      <div className="flex items-center gap-2 text-sm text-(--muted)">
        <Phone size={16} />

        <span>{employee.phone || "Aucun téléphone"}</span>
      </div>

      {/* STATUS */}

      <span
        className={`
          rounded-full px-4 py-2 text-xs font-semibold w-fit
          ${
            employee.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        `}
      >
        {employee.isActive ? "Actif" : "Inactif"}
      </span>

      {/* ACTIONS */}

      <div className="flex gap-2">
        <button
          onClick={() => onView(employee._id)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream)"
        >
          <Eye size={17} />
        </button>

        <button
          onClick={() => onEdit(employee._id)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--black) text-white"
        >
          <Pencil size={17} />
        </button>

        <button
          onClick={() => onStatusChange(employee._id, !employee.isActive)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"
        >
          <Power size={17} />
        </button>

        <button
          onClick={() => onDelete(employee._id)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </motion.div>
  );
}
