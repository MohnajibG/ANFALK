// src/pages/admin/Clients.tsx

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, User, Wallet, Eye, Pencil } from "lucide-react";

import { getClients } from "../../api/client.api";

import AddClientModal from "../../components/admin/AddClientModal";

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  visitCount: number;
  totalSpent: number;
  lastVisit?: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getClients({
        search,
        page: 1,
        limit: 20,
      });

      setClients(data.clients ?? []);
    } catch (err) {
      console.error("Erreur chargement clients", err);

      setError("Impossible de charger les clientes.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadClients();
    }, 400);

    return () => clearTimeout(timer);
  }, [loadClients]);

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}

      <section className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-(--brown)">
            Administration
          </p>

          <h1 className="mt-2 font-title text-3xl font-bold text-(--black)">
            Gestion des clientes
          </h1>

          <p className="mt-2 text-sm text-(--muted)">
            Consultez les profils clients et leur historique.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-(--black) px-5 py-3 text-(--cream) transition hover:opacity-90"
        >
          <Plus size={18} />
          Ajouter une cliente
        </button>
      </section>

      {/* SEARCH */}

      <section className="flex items-center gap-3 rounded-2xl border border-(--border) bg-white p-4">
        <Search size={20} className="text-(--brown)" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une cliente..."
          className="h-10 w-full bg-transparent text-sm outline-none"
        />
      </section>

      {/* ERROR */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LIST */}

      <section className="overflow-hidden rounded-3xl border border-(--border) bg-white">
        {loading ? (
          <div className="p-10 text-center text-(--brown)">
            Chargement des clientes...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-10 text-center text-(--brown)">
            Aucune cliente trouvée.
          </div>
        ) : (
          <div className="flex flex-col">
            {clients.map((client) => (
              <motion.div
                key={client._id}
                whileHover={{ scale: 1.01 }}
                className="flex flex-col gap-5 border-b border-(--border) p-5 transition last:border-none lg:flex-row lg:items-center lg:justify-between"
              >
                {/* CLIENT */}

                <div className="flex items-center gap-3 min-w-57.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--cream) text-(--brown)">
                    <User size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-(--black)">
                      {client.firstName} {client.lastName}
                    </p>

                    <p className="text-sm text-(--muted)">
                      {client.email || "Email non renseigné"}
                    </p>
                  </div>
                </div>

                {/* PHONE */}

                <div className="text-sm">
                  <p className="text-(--muted)">Téléphone</p>

                  <p className="font-medium">{client.phone}</p>
                </div>

                {/* VISITS */}

                <div className="text-sm">
                  <p className="text-(--muted)">Visites</p>

                  <p className="font-semibold">{client.visitCount}</p>
                </div>

                {/* MONEY */}

                <div className="flex items-center gap-2 text-sm">
                  <Wallet size={17} className="text-(--brown)" />

                  <span className="font-semibold">{client.totalSpent} DA</span>
                </div>

                {/* LAST VISIT */}

                <div className="text-sm">
                  <p className="text-(--muted)">Dernière visite</p>

                  <p>{client.lastVisit || "-"}</p>
                </div>

                {/* ACTIONS */}

                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream) text-(--brown) transition hover:scale-105">
                    <Eye size={17} />
                  </button>

                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--black) text-white transition hover:scale-105">
                    <Pencil size={17} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* STATS */}

      <div className="flex flex-col gap-4 sm:flex-row">
        <StatCard title="Total clientes" value={`${clients.length}`} />

        <StatCard title="Clientes actives" value={`${clients.length}`} />

        <StatCard title="Chiffre moyen" value="0 DA" />
      </div>

      <AddClientModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadClients}
      />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex-1 rounded-3xl border border-(--border) bg-white p-6"
    >
      <p className="text-sm text-(--muted)">{title}</p>

      <h2 className="mt-2 text-3xl font-bold text-(--black)">{value}</h2>
    </motion.div>
  );
}
