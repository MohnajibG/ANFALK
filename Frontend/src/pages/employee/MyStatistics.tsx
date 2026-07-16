/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "framer-motion";
import { DollarSign, Scissors, Users, TrendingUp } from "lucide-react";
import { useParams } from "react-router-dom";

const monthlyData = {
  "2026-01": {
    month: "January 2026",
    revenue: "3,850 €",
    services: 82,
    customers: 64,
    average: "46 €",
    growth: "+8%",
  },

  "2026-02": {
    month: "February 2026",
    revenue: "4,250 €",
    services: 96,
    customers: 73,
    average: "44 €",
    growth: "+10%",
  },

  "2026-03": {
    month: "March 2026",
    revenue: "5,100 €",
    services: 112,
    customers: 89,
    average: "45 €",
    growth: "+12%",
  },

  "2026-04": {
    month: "April 2026",
    revenue: "5,650 €",
    services: 125,
    customers: 98,
    average: "47 €",
    growth: "+14%",
  },
};

const topServices = [
  {
    name: "Hair Coloring",
    count: 42,
    revenue: "2,940 €",
  },
  {
    name: "Brushing",
    count: 38,
    revenue: "950 €",
  },
  {
    name: "Hair Cut",
    count: 25,
    revenue: "1,000 €",
  },
];

export default function MyStatistics() {
  const { month } = useParams();

  const data =
    monthlyData[month as keyof typeof monthlyData] ?? monthlyData["2026-03"];

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}

      <div className="ak-card px-5 py-7 sm:px-8">
        <p className="ak-kicker">Employee Statistics</p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">
          Sarah's Performance
        </h1>

        <p className="ak-muted mt-2">Hair Stylist · Coiffure</p>

        <div className="mt-4 inline-flex rounded-xl bg-[#FFF4D6] px-4 py-2 text-sm font-semibold text-[#3E2C23]">
          {data.month}
        </div>
      </div>

      {/* KPI */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Monthly Revenue"
          value={data.revenue}
          icon={DollarSign}
        />

        <KpiCard
          title="Services Completed"
          value={`${data.services}`}
          icon={Scissors}
        />

        <KpiCard title="Customers" value={`${data.customers}`} icon={Users} />

        <KpiCard
          title="Average Ticket"
          value={data.average}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* CHART */}

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-6 lg:col-span-2"
        >
          <h2 className="mb-5 font-semibold">Revenue Evolution</h2>

          <div className="flex h-64 items-end gap-3 rounded-3xl bg-[#f7f4ee] p-5">
            {[40, 55, 65, 50, 75, 85, 90].map((height, index) => (
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
            Daily revenue during {data.month}
          </p>
        </motion.div>

        {/* SUMMARY */}

        <motion.div whileHover={{ scale: 1.01 }} className="ak-card p-6">
          <h2 className="mb-5 font-semibold">Monthly Summary</h2>

          <div className="space-y-4 text-sm">
            <p>
              Best service:
              <b> Hair Coloring</b>
            </p>

            <p>
              Best day:
              <b> Saturday</b>
            </p>

            <p>
              Growth:
              <b className="ml-2 text-green-600">{data.growth}</b>
            </p>
          </div>
        </motion.div>

        {/* SERVICES */}

        <motion.div className="ak-card p-6 lg:col-span-3">
          <h2 className="mb-5 font-semibold">
            Services Performed in {data.month}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {topServices.map((service) => (
              <div key={service.name} className="rounded-2xl bg-[#f7f4ee] p-5">
                <h3 className="font-semibold">{service.name}</h3>

                <p className="ak-muted mt-2">{service.count} appointments</p>

                <p className="mt-3 font-bold text-[#3E2C23]">
                  {service.revenue}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: any;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} className="ak-card p-6">
      <div className="flex justify-between">
        <div>
          <p className="ak-muted text-sm">{title}</p>

          <h3 className="mt-2 text-2xl font-bold">{value}</h3>
        </div>

        <div className="rounded-full bg-[#FFF4D6] p-4">
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}
