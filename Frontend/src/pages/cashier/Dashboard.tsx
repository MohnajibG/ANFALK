import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { DollarSign, Receipt, Users, ShoppingBag, Clock } from "lucide-react";

const todaySales = [
  {
    id: "#1024",
    client: "Emma Martin",
    service: "Hair Coloring",
    employee: "Sarah",
    amount: "8500 DA",
    time: "10:30",
  },
  {
    id: "#1025",
    client: "Sophie Bernard",
    service: "Brushing",
    employee: "Sarah",
    amount: "3500 DA",
    time: "11:15",
  },
  {
    id: "#1026",
    client: "Julie Morel",
    service: "Full Set",
    employee: "Lina",
    amount: "7000 DA",
    time: "12:40",
  },
];

const popularServices = [
  {
    name: "Brushing",
    count: 32,
  },
  {
    name: "Coloration",
    count: 21,
  },
  {
    name: "Full Set",
    count: 18,
  },
];

const CashierDashboard = () => {
  return (
    <div className="w-full space-y-6">
      <section className="rounded-3xl border border-[#D8B98A]/30 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#D8B98A]">
          Cashier Dashboard
        </p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold text-[#151515]">
          Bienvenue Réception
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Gestion des ventes et tickets du jour.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Chiffre du jour" value="185000 DA" icon={DollarSign} />

        <KpiCard title="Tickets" value="42" icon={Receipt} />

        <KpiCard title="Clients" value="36" icon={Users} />

        <KpiCard title="Services" value="58" icon={ShoppingBag} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[#D8B98A]/30 bg-white p-6 lg:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Tickets du jour</h2>

            <Receipt size={20} />
          </div>

          <div className="space-y-3">
            {todaySales.map((sale) => (
              <div
                key={sale.id}
                className="flex flex-col gap-3 rounded-2xl bg-[#F7F2EA] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">
                    {sale.id} · {sale.client}
                  </p>

                  <p className="text-sm text-gray-500">{sale.service}</p>

                  <p className="text-xs text-gray-400">
                    Employé : {sale.employee}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-[#3E2C23]">{sale.amount}</p>

                  <p className="flex items-center justify-end gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    {sale.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[#D8B98A]/30 bg-white p-6"
        >
          <h2 className="mb-5 font-semibold">Services populaires</h2>

          <div className="space-y-4">
            {popularServices.map((service, index) => (
              <div
                key={service.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151515] text-sm text-[#FFF4D6]">
                    {index + 1}
                  </div>

                  <span>{service.name}</span>
                </div>

                <strong>{service.count}</strong>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="rounded-3xl border border-[#D8B98A]/30 bg-white p-6">
        <h2 className="mb-5 font-semibold">Actions rapides</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <button className="rounded-xl bg-[#151515] py-4 font-semibold text-[#FFF4D6]">
            Nouveau ticket
          </button>

          <button className="rounded-xl border border-[#151515] py-4 font-semibold text-[#151515]">
            Nouveau client
          </button>

          <button className="rounded-xl bg-[#D8B98A] py-4 font-semibold text-[#151515]">
            Voir tickets
          </button>
        </div>
      </section>
    </div>
  );
};

const KpiCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: ComponentType<{ size?: number }>;
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-[#D8B98A]/30 bg-white p-6"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold">{value}</h3>
        </div>

        <div className="rounded-full bg-[#F7F2EA] p-4">
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
};

export default CashierDashboard;
