import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, User, Euro, Eye, Pencil } from "lucide-react";

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  visits: number;
  revenue: string;
  lastVisit: string;
  favoriteService: string;
};

const clientsData: Client[] = [
  {
    id: "1",
    name: "Marie Dupont",
    phone: "06 12 34 56 78",
    email: "marie@gmail.com",
    visits: 18,
    revenue: "820 €",
    lastVisit: "12 March 2026",
    favoriteService: "Hair Coloring",
  },

  {
    id: "2",
    name: "Sophie Martin",
    phone: "07 45 22 11 90",
    email: "sophie@gmail.com",
    visits: 12,
    revenue: "540 €",
    lastVisit: "20 March 2026",
    favoriteService: "Brushing",
  },

  {
    id: "3",
    name: "Claire Bernard",
    phone: "06 88 44 22 11",
    email: "claire@gmail.com",
    visits: 25,
    revenue: "1 250 €",
    lastVisit: "02 April 2026",
    favoriteService: "Full Set Nails",
  },
];

export default function Clients() {
  const [search, setSearch] = useState("");

  const clients = clientsData.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="ak-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="ak-kicker">Administration</p>

          <h1 className="mt-2 font-[Cinzel] text-3xl font-bold">
            Clients Management
          </h1>

          <p className="ak-muted mt-2">
            Manage customer profiles and salon history.
          </p>
        </div>

        <button
          className="
          flex items-center gap-2
          rounded-xl
          bg-[#3E2C23]
          px-5 py-3
          text-[#FFF4D6]
          "
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      {/* SEARCH */}

      <div className="ak-card flex items-center gap-3 p-4">
        <Search size={20} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search client..."
          className="
          w-full
          bg-transparent
          outline-none
          "
        />
      </div>

      {/* CLIENTS TABLE */}

      <div className="ak-card overflow-hidden">
        <div
          className="
        hidden
        grid-cols-7
        border-b
        p-4
        text-sm
        font-semibold
        md:grid
        "
        >
          <span>Name</span>
          <span>Phone</span>
          <span>Visits</span>
          <span>Revenue</span>
          <span>Last Visit</span>
          <span>Favorite</span>
          <span>Actions</span>
        </div>

        <div className="divide-y">
          {clients.map((client) => (
            <motion.div
              key={client.id}
              whileHover={{
                backgroundColor: "#faf7f0",
              }}
              className="
          grid
          gap-3
          p-5
          md:grid-cols-7
          items-center
          "
            >
              {/* NAME */}

              <div className="flex items-center gap-3">
                <div
                  className="
              flex h-10 w-10
              items-center justify-center
              rounded-full
              bg-[#FFF4D6]
              "
                >
                  <User size={18} />
                </div>

                <div>
                  <p className="font-semibold">{client.name}</p>

                  <p className="text-xs text-gray-500">{client.email}</p>
                </div>
              </div>

              <span>{client.phone}</span>

              <span>{client.visits}</span>

              <span
                className="
            flex items-center gap-1
            font-semibold
            "
              >
                <Euro size={14} />
                {client.revenue}
              </span>

              <span className="text-sm text-gray-500">{client.lastVisit}</span>

              <span className="text-sm">{client.favoriteService}</span>

              {/* ACTIONS */}

              <div className="flex gap-2">
                <button
                  className="
              rounded-lg
              bg-[#FFF4D6]
              p-2
              "
                >
                  <Eye size={16} />
                </button>

                <button
                  className="
              rounded-lg
              bg-[#3E2C23]
              p-2
              text-[#FFF4D6]
              "
                >
                  <Pencil size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Clients" value="356" />

        <StatCard title="Active Clients" value="240" />

        <StatCard title="Average Client Revenue" value="185 €" />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="ak-card p-6"
    >
      <p className="ak-muted text-sm">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </motion.div>
  );
}
