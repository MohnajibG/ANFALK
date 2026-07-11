import { motion } from "framer-motion";
import { Scissors, CalendarDays, User, Euro } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Hair Coloring",
    category: "Coloration",
    client: "Emma Martin",
    date: "10 March 2026",
    price: "85 €",
    status: "Completed",
  },

  {
    id: 2,
    name: "Brushing",
    category: "Hair Styling",
    client: "Sophie Bernard",
    date: "12 March 2026",
    price: "35 €",
    status: "Completed",
  },

  {
    id: 3,
    name: "Hair Cut",
    category: "Haircut",
    client: "Claire Dupont",
    date: "15 March 2026",
    price: "45 €",
    status: "Completed",
  },

  {
    id: 4,
    name: "Hair Treatment",
    category: "Care",
    client: "Julie Morel",
    date: "18 March 2026",
    price: "60 €",
    status: "Completed",
  },
];

export default function Services() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="ak-card px-5 py-7 sm:px-8">
        <p className="ak-kicker">Employee Area</p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">My Services</h1>

        <p className="ak-muted mt-2">Sarah's completed services history</p>
      </div>

      {/* SERVICE LIST */}

      <div className="grid gap-5">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{
              y: -3,
            }}
            className="ak-card p-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT */}

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-[#FFF4D6] p-4">
                  <Scissors size={25} className="text-[#3E2C23]" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">{service.name}</h2>

                  <p className="ak-muted text-sm">{service.category}</p>
                </div>
              </div>

              {/* INFO */}

              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <User size={16} />

                  <span>{service.client}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />

                  <span>{service.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Euro size={16} />

                  <span className="font-semibold">{service.price}</span>
                </div>

                <div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {service.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
