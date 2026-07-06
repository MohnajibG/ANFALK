import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";

type Client = {
  id: string;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
};

const initialClients: Client[] = [
  {
    id: "1",
    name: "Sarah M.",
    phone: "06 12 34 56 78",
    visits: 5,
    lastVisit: "2026-01-02",
  },
  {
    id: "2",
    name: "Lina K.",
    phone: "07 22 11 33 44",
    visits: 2,
    lastVisit: "2025-12-28",
  },
];

export default function Clients() {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  console.log(setClients);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Cinzel] text-3xl text-[#3E2C23]">Clients</h1>
          <p className="text-gray-500">Gestion de la clientèle</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#3E2C23] px-4 py-2 text-[#FFF4D6]"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 outline-none focus:border-[#3E2C23]"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4">Nom</th>
              <th>Téléphone</th>
              <th>Visites</th>
              <th>Dernière visite</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((client) => (
              <motion.tr
                key={client.id}
                whileHover={{ backgroundColor: "#FFF4D6" }}
                className="border-b"
              >
                <td className="p-4 font-medium text-[#3E2C23]">
                  {client.name}
                </td>
                <td>{client.phone}</td>
                <td>{client.visits}</td>
                <td>{client.lastVisit}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-[#3E2C23]">
              Ajouter un client
            </h2>

            <div className="mt-4 space-y-3">
              <input
                placeholder="Nom"
                className="w-full rounded-xl border p-3"
              />
              <input
                placeholder="Téléphone"
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2"
              >
                Annuler
              </button>

              <button className="rounded-xl bg-[#3E2C23] px-4 py-2 text-[#FFF4D6]">
                Enregistrer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
