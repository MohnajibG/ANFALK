import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { getMyEmployeeProfile } from "../../api/employee.api";

import type { Employee } from "../../types/employee";

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyEmployeeProfile();

        setEmployee(data);
      } catch (error) {
        console.error("Erreur chargement profil employé", error);
      }
    };

    loadProfile();
  }, []);

  if (!employee) {
    return <div className="ak-card p-6">Chargement...</div>;
  }

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}

      <div className="ak-card px-5 py-7 text-center sm:px-8 lg:text-left">
        <p className="ak-kicker">Espace employé</p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold text-[#0b0b0b]">
          Bonjour {employee.firstName}
        </h1>

        <p className="ak-muted mt-2">{employee.speciality ?? "Employé"}</p>
      </div>

      {/* KPI */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Chiffre du jour" value="0 €" />

        <KpiCard title="Prestations réalisées" value="0" />

        <KpiCard title="Clients reçus" value="0" />

        <KpiCard title="Chiffre du mois" value="0 €" />
      </div>

      {/* CONTENT */}

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-5 sm:p-6 lg:col-span-2"
        >
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">Performance</h2>

          <div className="flex h-64 w-full items-end gap-3 rounded-3xl border border-[#e8e2d8] bg-[#f7f4ee] p-5">
            {[30, 45, 40, 65, 55, 80, 70].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-full bg-[#3E2C23]"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>

          <p className="ak-muted mt-4 text-sm">
            Évolution des prestations sur les 7 derniers jours
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="ak-card p-5 sm:p-6">
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">Ma spécialité</h2>

          <div className="space-y-4">
            <Info label="Spécialité" value={employee.speciality ?? "-"} />

            <Info
              label="Statut"
              value={employee.isActive ? "Actif" : "Inactif"}
            />

            <Info
              label="Nom complet"
              value={`${employee.firstName} ${employee.lastName}`}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-5 sm:p-6 lg:col-span-3"
        >
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">
            Dernières prestations
          </h2>

          <div className="rounded-2xl border border-[#e8e2d8] bg-[#f7f4ee] p-5 text-sm text-gray-500">
            Aucune prestation récente
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="ak-card p-6">
      <p className="ak-muted text-sm font-semibold">{title}</p>

      <h3 className="mt-2 text-2xl font-bold text-[#0b0b0b]">{value}</h3>
    </motion.div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="ak-muted text-sm">{label}</p>

      <p className="font-semibold">{value}</p>
    </div>
  );
}
