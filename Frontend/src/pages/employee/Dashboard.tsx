/* eslint-disable react-hooks/set-state-in-effect */
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Euro, Scissors, TrendingUp, Users } from "lucide-react";

import { getMyEmployeeProfile } from "../../api/employee.api";
import type { Employee } from "../../types/employee";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import LoadingState from "../../components/ui/LoadingState";
import Badge from "../../components/ui/Badge";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyEmployeeProfile();
      setEmployee(data);
    } catch (err) {
      console.error("Erreur chargement profil employé", err);
      setError("Impossible de charger votre profil");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) return <LoadingState label="Chargement de votre espace..." />;

  if (error || !employee) {
    return (
      <div className="rounded-2xl bg-red-50 p-5 text-red-600">
        {error || "Profil introuvable"}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Espace employé"
        title={`Bonjour ${employee.firstName}`}
        description={employee.speciality ?? "Employé"}
        icon={<Scissors size={24} />}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Euro}
          title="Chiffre du jour"
          value="0 DA"
          accent="black"
        />
        <StatCard
          icon={Scissors}
          title="Prestations réalisées"
          value={0}
          accent="gold"
        />
        <StatCard icon={Users} title="Clients reçus" value={0} accent="info" />
        <StatCard
          icon={TrendingUp}
          title="Chiffre du mois"
          value="0 DA"
          accent="success"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-md border border-(--border) bg-white p-6 shadow-(--shadow-sm) sm:p-6 lg:col-span-2"
        >
          <h2 className="mb-4 font-semibold text-(--black)">Performance</h2>

          <div className="flex h-64 w-full items-end gap-3 rounded-3xl border border-(--border) bg-(--surface) p-5">
            {[30, 45, 40, 65, 55, 80, 70].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-full bg-(--black)"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <p className="mt-4 text-sm text-(--muted)">
            Évolution des prestations sur les 7 derniers jours
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-md border border-(--border) bg-white shadow-(--shadow-sm) p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-(--black)">Ma spécialité</h2>
            <Badge variant={employee.isActive ? "success" : "danger"}>
              {employee.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>

          <div className="space-y-4">
            <Info label="Spécialité" value={employee.speciality ?? "-"} />
            <Info
              label="Nom complet"
              value={`${employee.firstName} ${employee.lastName}`}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-md border border-(--border) bg-white p-6 shadow-(--shadow-sm) sm:p-6 lg:col-span-3"
        >
          <div className="mb-4 flex items-center gap-2">
            <CalendarCheck size={20} className="text-(--brown)" />
            <h2 className="font-semibold text-(--black)">
              Dernières prestations
            </h2>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface) p-5 text-sm text-(--muted)">
            Aucune prestation récente
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-(--muted)">{label}</p>
    <p className="font-semibold text-(--black)">{value}</p>
  </div>
);

export default EmployeeDashboard;
