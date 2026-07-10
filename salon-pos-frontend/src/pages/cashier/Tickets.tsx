import { motion } from "framer-motion";
import { Receipt, User, Clock, Banknote } from "lucide-react";

const tickets = [
  {
    id: "#1024",
    client: "Emma Martin",
    service: "Hair Coloring",
    employee: "Sarah",
    total: "85 €",
    time: "10:30",
    status: "Paid",
  },

  {
    id: "#1025",
    client: "Sophie Bernard",
    service: "Brushing",
    employee: "Sarah",
    total: "35 €",
    time: "11:15",
    status: "Paid",
  },

  {
    id: "#1026",
    client: "Julie Morel",
    service: "Full Set",
    employee: "Lina",
    total: "70 €",
    time: "12:40",
    status: "Paid",
  },
];

export default function Tickets() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="ak-card p-6">
        <p className="ak-kicker">Cashier</p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">Sales Tickets</h1>

        <p className="ak-muted mt-2">History of completed payments</p>
      </div>

      {/* LIST */}

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            whileHover={{
              scale: 1.01,
            }}
            className="ak-card p-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT */}

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-[#FFF4D6] p-4">
                  <Receipt size={25} />
                </div>

                <div>
                  <h2 className="font-bold">Ticket {ticket.id}</h2>

                  <p className="text-sm text-gray-500">{ticket.service}</p>
                </div>
              </div>

              {/* INFO */}

              <div className="grid gap-3 text-sm sm:grid-cols-4">
                <div className="flex items-center gap-2">
                  <User size={16} />

                  {ticket.client}
                </div>

                <div className="flex items-center gap-2">
                  <User size={16} />

                  {ticket.employee}
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} />

                  {ticket.time}
                </div>

                <div className="flex items-center gap-2">
                  <Banknote size={16} />

                  <b>{ticket.total}</b>
                </div>
              </div>

              <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
                {ticket.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
