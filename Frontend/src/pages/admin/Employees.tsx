import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getEmployees,
  updateEmployeeStatus,
  deleteEmployee,
} from "../../api/employee.api";

import type { Employee } from "../../types/employee";

import EmployeeCard from "../../components/employees/EmployeeCard";
import EmployeeModal from "../../components/employees/EmployeeModal";
import EmployeeStats from "../../components/employees/EmployeeStats";

export default function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getEmployees(search);

      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [loadEmployees]);

  const handleStatus = async (id: string, isActive: boolean) => {
    try {
      await updateEmployeeStatus(id, isActive);

      await loadEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Supprimer cet employé ?");

    if (!confirmDelete) return;

    try {
      await deleteEmployee(id);

      await loadEmployees();
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

      <EmployeeStats employees={employees} />

      {/* LISTE */}

      <section className="overflow-hidden rounded-3xl border border-(--border) bg-white">
        {loading ? (
          <div className="p-10 text-center text-(--brown)">Chargement...</div>
        ) : employees.length === 0 ? (
          <div className="p-10 text-center text-(--muted)">
            Aucun employé trouvé.
          </div>
        ) : (
          employees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onStatusChange={handleStatus}
              onDelete={handleDelete}
              onView={(id) => navigate(`/admin/employees/${id}`)}
              onEdit={(id) => navigate(`/admin/employees/${id}/edit`)}
            />
          ))
        )}
      </section>

      <EmployeeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadEmployees}
      />
    </div>
  );
}
