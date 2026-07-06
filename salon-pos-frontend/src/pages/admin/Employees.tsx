import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, User } from "lucide-react";

type Speciality = "Coiffure" | "Manucure" | "Maquillage";

type Employee = {
  id: string;
  name: string;
  speciality: Speciality;
  status: "active" | "inactive";
  revenue: number;
};

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah",
    speciality: "Coiffure",
    status: "active",
    revenue: 3200,
  },
  {
    id: "2",
    name: "Lina",
    speciality: "Manucure",
    status: "active",
    revenue: 2850,
  },
  {
    id: "3",
    name: "Sonia",
    speciality: "Maquillage",
    status: "inactive",
    revenue: 2100,
  },
];

export default function Employees() {
  const [employees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Cinzel] text-3xl text-[#3E2C23]">Employés</h1>
          <p className="text-gray-500">Gestion des équipes et performances</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#3E2C23] px-4 py-2 text-[#FFF4D6]"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un employé..."
          className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 outline-none focus:border-[#3E2C23]"
        />
      </div>

      {/* GRID CARDS */}
      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map((emp) => (
          <motion.div
            key={emp.id}
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-white p-6 shadow"
          >
            {/* TOP */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4D6]">
                <User size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-[#3E2C23]">{emp.name}</h3>
                <p className="text-xs text-gray-500">{emp.speciality}</p>
              </div>
            </div>

            {/* STATUS */}
            <div className="mt-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  emp.status === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {emp.status === "active" ? "Actif" : "Inactif"}
              </span>
            </div>

            {/* REVENUE */}
            <div className="mt-6">
              <p className="text-sm text-gray-500">Chiffre d'affaires</p>
              <h4 className="text-2xl font-bold text-[#3E2C23]">
                {emp.revenue} €
              </h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL (simple placeholder) */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-[#3E2C23]">
              Ajouter un employé
            </h2>

            <div className="mt-4 space-y-3">
              <input
                placeholder="Nom"
                className="w-full rounded-xl border p-3"
              />

              <select className="w-full rounded-xl border p-3">
                <option>Coiffure</option>
                <option>Manucure</option>
                <option>Maquillage</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2"
              >
                Annuler
              </button>

              <button className="rounded-xl bg-[#3E2C23] px-4 py-2 text-[#FFF4D6]">
                Enregistrer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
