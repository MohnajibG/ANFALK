// src/pages/admin/Employees.tsx

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, User, Pencil, Eye, Power, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run";

type EmployeeRole = "employee" | "cashier";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  speciality?: string;
  role: EmployeeRole;
  isActive: boolean;
}

interface EmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  speciality: string;
}

export default function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
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
        setEmployees(data.employees ?? data);
      }
    } catch (error) {
      console.error("Erreur chargement employés", error);
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
      {/* HEADER */}

      <section className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-(--brown)">
            Administration
          </p>

          <h1 className="mt-2 font-title text-3xl font-bold text-(--black)">
            Gestion des employés
          </h1>

          <p className="mt-2 text-sm text-(--muted)">
            Gérez votre équipe et les accès utilisateurs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-(--black) px-5 py-3 text-(--cream)"
        >
          <Plus size={18} />
          Ajouter un employé
        </button>
      </section>

      {/* SEARCH */}

      <section className="flex items-center gap-3 rounded-2xl border border-(--border) bg-white p-4">
        <Search size={20} className="text-(--brown)" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un employé..."
          className="w-full bg-transparent outline-none"
        />
      </section>

      {/* LISTE */}

      <section className="overflow-hidden rounded-3xl border border-(--border) bg-white">
        {loading ? (
          <div className="p-10 text-center text-(--brown)">
            Chargement des employés...
          </div>
        ) : (
          <div className="flex flex-col">
            {employees.map((employee) => (
              <motion.div
                key={employee._id}
                whileHover={{ scale: 1.01 }}
                className="flex flex-col gap-5 border-b border-(--border) p-5 transition last:border-none lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-center gap-3 min-w-55">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--cream) text-(--brown)">
                    <User size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {employee.firstName} {employee.lastName}
                    </p>

                    <p className="text-sm text-(--muted)">
                      {employee.role === "employee" ? "Employé" : "Caissier"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Scissors size={17} className="text-(--brown)" />

                  <span>{employee.speciality || "Non définie"}</span>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    employee.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {employee.isActive ? "Actif" : "Inactif"}
                </span>

                <span className="text-sm">
                  {employee.phone || "Aucun téléphone"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/employees/${employee._id}`)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream)"
                  >
                    <Eye size={17} />
                  </button>

                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--black) text-white">
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => toggleStatus(employee._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"
                  >
                    <Power size={17} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* STATS */}

      <div className="flex flex-col gap-4 sm:flex-row">
        <SummaryCard title="Total employés" value={`${employees.length}`} />

        <SummaryCard
          title="Employés actifs"
          value={`${employees.filter((employee) => employee.isActive).length}`}
        />

        <SummaryCard title="Profils" value="Employé / Caissier" />
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
      className="flex-1 rounded-3xl border border-(--border) bg-white p-6"
    >
      <p className="text-sm text-(--muted)">{title}</p>

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
  const token = localStorage.getItem("token");

  const [form, setForm] = useState<EmployeeForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "employee",
    speciality: "Hair",
  });

  const createEmployee = async () => {
    await fetch(`${API_URL}/api/employees`, {
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
      <div className="w-full max-w-md rounded-3xl bg-white p-6">
        <h2 className="font-title text-2xl font-bold">Créer un employé</h2>

        <div className="mt-5 flex flex-col gap-3">
          {Object.entries(form).map(([key, value]) => (
            <input
              key={key}
              value={value}
              placeholder={key}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: e.target.value,
                } as EmployeeForm)
              }
              className="rounded-xl border border-(--border) p-3 outline-none"
            />
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={close} className="flex-1 rounded-xl border py-3">
            Annuler
          </button>

          <button
            onClick={createEmployee}
            className="flex-1 rounded-xl bg-(--black) py-3 text-(--cream)"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}
