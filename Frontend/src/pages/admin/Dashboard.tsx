import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Euro,
  Receipt,
  Users,
  UserCog,
  TrendingUp,
  Scissors,
} from "lucide-react";

import { getAdminDashboard, type DashboardData } from "../../api/dashboard.api";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const result = await getAdminDashboard();

      setData(result);
    } catch (err) {
      console.error("[Dashboard] load:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger le dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!mounted) return;

      setLoading(true);

      await loadDashboard();
    };

    run();

    return () => {
      mounted = false;
    };
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Chargement du dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-5 text-red-600">{error}</div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-yellow-50 p-5 text-yellow-700">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="rounded-3xl border border-[#eadfce] bg-white p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
          ADMIN
        </p>

        <h1 className="mt-3 font-serif text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-sm text-gray-500">
          Vue globale de gestion ANFEL K Institute
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Euro}
          title="Chiffre du jour"
          value={`${data.salesToday.revenue} DA`}
        />

        <KpiCard
          icon={Receipt}
          title="Tickets aujourd'hui"
          value={data.salesToday.tickets}
        />

        <KpiCard icon={Users} title="Clients" value={data.clients.total} />

        <KpiCard icon={UserCog} title="Employés" value={data.employees.total} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[#eadfce] bg-white p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Revenus mensuels</h2>

            <TrendingUp size={20} />
          </div>

          <div className="mt-6 rounded-3xl bg-[#f7f4ee] p-5">
            <h3 className="text-3xl font-bold">{data.salesMonth.revenue} DA</h3>

            <p className="text-gray-500">{data.salesMonth.tickets} tickets</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[#eadfce] bg-white p-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <Scissors size={20} />

            <h2 className="font-semibold">Services populaires</h2>
          </div>

          <div className="space-y-3">
            {data.popularServices.length ? (
              data.popularServices.map((service) => (
                <div
                  key={service._id}
                  className="flex justify-between border-b py-2 text-sm"
                >
                  <span>{service._id}</span>

                  <strong>{service.sales}</strong>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun service vendu</p>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[#eadfce] bg-white p-6 lg:col-span-3"
        >
          <h2 className="mb-5 font-semibold">Performance employés</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.topEmployees.length ? (
              data.topEmployees.map((employee) => (
                <div
                  key={employee._id}
                  className="rounded-2xl bg-[#f7f4ee] p-5"
                >
                  <p className="font-semibold">{employee._id}</p>

                  <p className="mt-2 text-sm text-gray-500">
                    CA : {employee.revenue} DA
                  </p>

                  <p className="text-sm text-gray-500">
                    Tickets : {employee.tickets}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun employé disponible</p>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

const KpiCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
  title: string;
  value: string | number;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="rounded-3xl border border-[#eadfce] bg-white p-6"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{title}</p>

      <Icon size={22} />
    </div>

    <h3 className="mt-4 text-3xl font-bold">{value}</h3>
  </motion.div>
);
