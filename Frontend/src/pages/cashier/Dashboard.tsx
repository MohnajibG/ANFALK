/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { DollarSign, Receipt, Users, ShoppingBag, Clock } from "lucide-react";

const todaySales = [
  {
    id: "#1024",
    client: "Emma Martin",
    service: "Hair Coloring",
    employee: "Sarah",
    amount: "85 €",
    time: "10:30",
  },

  {
    id: "#1025",
    client: "Sophie Bernard",
    service: "Brushing",
    employee: "Sarah",
    amount: "35 €",
    time: "11:15",
  },

  {
    id: "#1026",
    client: "Julie Morel",
    service: "Full Set",
    employee: "Lina",
    amount: "70 €",
    time: "12:40",
  },
];

const popularServices = [
  {
    name: "Brushing",
    count: 32,
  },

  {
    name: "Hair Coloring",
    count: 21,
  },

  {
    name: "Full Set",
    count: 18,
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="ak-card px-6 py-7">
        <p className="ak-kicker">Cashier Dashboard</p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">
          Welcome back Reception
        </h1>

        <p className="ak-muted mt-2">
          Manage today's sales and customer tickets.
        </p>
      </div>

      {/* KPI */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Today's Revenue" value="1,850 €" icon={DollarSign} />

        <KpiCard title="Tickets" value="42" icon={Receipt} />

        <KpiCard title="Customers" value="36" icon={Users} />

        <KpiCard title="Services" value="58" icon={ShoppingBag} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* SALES */}

        <motion.div
          whileHover={{
            scale: 1.01,
          }}
          className="ak-card p-6 lg:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Today's Tickets</h2>

            <Receipt size={20} />
          </div>

          <div className="space-y-3">
            {todaySales.map((sale) => (
              <div
                key={sale.id}
                className="flex flex-col gap-3 rounded-2xl bg-[#F7F4EE] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">
                    {sale.id} · {sale.client}
                  </p>

                  <p className="text-sm text-gray-500">{sale.service}</p>

                  <p className="text-xs text-gray-400">
                    Employee : {sale.employee}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-[#3E2C23]">{sale.amount}</p>

                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />

                    {sale.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* POPULAR */}

        <motion.div
          whileHover={{
            scale: 1.01,
          }}
          className="ak-card p-6"
        >
          <h2 className="mb-5 font-semibold">Popular Services</h2>

          <div className="space-y-4">
            {popularServices.map((service, index) => (
              <div
                key={service.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3E2C23] text-sm text-[#FFF4D6]">
                    {index + 1}
                  </div>

                  <span>{service.name}</span>
                </div>

                <span className="font-bold">{service.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* QUICK ACTIONS */}

      <div className="ak-card p-6">
        <h2 className="mb-5 font-semibold">Quick Actions</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <button className="rounded-xl bg-[#3E2C23] py-4 font-semibold text-[#FFF4D6]">
            New Ticket
          </button>

          <button className="rounded-xl border border-[#3E2C23] py-4 font-semibold text-[#3E2C23]">
            New Customer
          </button>

          <button className="rounded-xl bg-[#FFF4D6] py-4 font-semibold text-[#3E2C23]">
            View Tickets
          </button>
        </div>
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
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="ak-card p-6"
    >
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
