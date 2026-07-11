import { motion } from "framer-motion";
import { Search, UserPlus, Phone, CalendarDays } from "lucide-react";
import { useState } from "react";

const customers = [
  {
    id: 1,
    name: "Emma Martin",
    phone: "06 12 45 78 90",
    visits: 12,
    lastVisit: "10 March 2026",
  },

  {
    id: 2,
    name: "Sophie Bernard",
    phone: "06 55 21 44 33",
    visits: 8,
    lastVisit: "12 March 2026",
  },

  {
    id: 3,
    name: "Julie Morel",
    phone: "07 10 25 66 90",
    visits: 5,
    lastVisit: "18 March 2026",
  },
];

export default function Customers() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="ak-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="ak-kicker">Cashier</p>

          <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">Customers</h1>

          <p className="ak-muted mt-2">Manage salon customers</p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#3E2C23] px-5 py-3 text-[#FFF4D6]">
          <UserPlus size={18} />
          New Customer
        </button>
      </div>

      {/* SEARCH */}

      <div className="ak-card p-5">
        <div className="flex items-center gap-3 rounded-xl border p-3">
          <Search size={18} />

          <input
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>
      </div>

      {/* CUSTOMERS */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((customer) => (
          <motion.div
            key={customer.id}
            whileHover={{
              y: -5,
            }}
            className="ak-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3E2C23] text-[#FFF4D6]">
                {customer.name.charAt(0)}
              </div>

              <div>
                <h2 className="font-bold">{customer.name}</h2>

                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CalendarDays size={17} />

                <span>{customer.visits} visits</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={17} />

                <span>Last visit : {customer.lastVisit}</span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl border border-[#3E2C23] py-2 text-sm font-semibold text-[#3E2C23]">
              View History
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
