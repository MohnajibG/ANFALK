/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Euro,
  Receipt,
  Users,
  UserCog,
  TrendingUp,
  Scissors,
} from "lucide-react";
import { getAdminDashboard } from "../../api/dashboard.api";

interface DashboardData {
  salesToday: { revenue: number; tickets: number };
  salesMonth: { revenue: number; tickets: number };
  clients: number;
  employees: number;
  popularServices: { _id: string; count: number; revenue: number }[];
  topEmployees: { _id: string; revenue: number; tickets: number }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getAdminDashboard();
        setData(result);
      } catch (error: any) {
        setError(error.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="rounded-2xl bg-red-50 p-5 text-red-600">{error}</div>
    );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-3xl border border-[#eadfce] bg-white p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
          ADMIN
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#111]">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          ANFEL K Institute management overview
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Euro}
          title="Revenue Today"
          value={`${data?.salesToday.revenue ?? 0} DA`}
        />

        <KpiCard
          icon={Receipt}
          title="Tickets Today"
          value={data?.salesToday.tickets ?? 0}
        />

        <KpiCard icon={Users} title="Clients" value={data?.clients ?? 0} />

        <KpiCard
          icon={UserCog}
          title="Employees"
          value={data?.employees ?? 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[#eadfce] bg-white p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Monthly Revenue</h2>

            <TrendingUp size={20} />
          </div>

          <div className="mt-6 rounded-3xl bg-[#f7f4ee] p-5">
            <div className="flex h-52 items-end gap-3">
              {[35, 55, 45, 70, 60, 90, 75].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-full bg-[#3E2C23]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-between text-sm text-gray-500">
            <span>This month</span>

            <strong className="text-[#111]">
              {data?.salesMonth.revenue ?? 0} DA
            </strong>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[#eadfce] bg-white p-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <Scissors size={20} />

            <h2 className="font-semibold">Popular Services</h2>
          </div>

          <div className="space-y-4">
            {data?.popularServices.length ? (
              data.popularServices.map((service) => (
                <div key={service._id} className="flex justify-between text-sm">
                  <span>{service._id}</span>

                  <span className="font-bold">{service.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No sales yet</p>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[#eadfce] bg-white p-6 lg:col-span-3"
        >
          <h2 className="mb-5 font-semibold">Employee Performance</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.topEmployees.length ? (
              data.topEmployees.map((employee) => (
                <div
                  key={employee._id}
                  className="rounded-2xl bg-[#f7f4ee] p-5"
                >
                  <p className="font-semibold">{employee._id}</p>

                  <p className="mt-2 text-sm text-gray-500">
                    Revenue : {employee.revenue} DA
                  </p>

                  <p className="text-sm text-gray-500">
                    Tickets : {employee.tickets}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No employee data</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string | number;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-[#eadfce] bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-3xl font-bold text-[#111]">{value}</h3>
    </motion.div>
  );
}
