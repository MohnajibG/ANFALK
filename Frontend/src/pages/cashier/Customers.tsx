import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  CalendarDays,
  WalletCards,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getClients } from "../../api/client.api";
import type { Client } from "../../types/client";

const Customers = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getClients();
        setClients(Array.isArray(data) ? data : (data.clients ?? []));
      } catch (error) {
        console.error("[Customers]", error);
        setError("Impossible de charger les clientes.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        `${client.firstName} ${client.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [clients, search],
  );

  if (loading)
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Chargement des clientes...
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <section className="ak-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="ak-kicker">CRM</p>
          <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">Customers</h1>
          <p className="ak-muted mt-2">Gestion des clientes du salon</p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#3E2C23] px-5 py-3 text-[#FFF4D6] transition hover:opacity-90">
          <UserPlus size={18} />
          Nouvelle cliente
        </button>
      </section>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <section className="ak-card p-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#D8B98A]/30 bg-[#FFFDF8] p-4">
          <Search size={18} className="text-[#D8B98A]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une cliente..."
            className="w-full bg-transparent outline-none"
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-6">
        {filteredClients.map((client) => (
          <motion.article
            key={client._id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="ak-card w-full p-6 sm:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#3E2C23] font-[Cinzel] text-xl font-bold text-[#FFF4D6]">
                {client.firstName?.charAt(0)}
                {client.lastName?.charAt(0)}
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  {client.firstName} {client.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  {client.phone || "Téléphone non renseigné"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <div className="flex-1 rounded-2xl bg-[#F7F2EA] p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={15} />
                  Visites
                </div>
                <p className="mt-2 font-bold">{client.visitCount ?? 0}</p>
              </div>

              <div className="flex-1 rounded-2xl bg-[#F7F2EA] p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <WalletCards size={15} />
                  Total
                </div>
                <p className="mt-2 font-bold">{client.totalSpent ?? 0} DA</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-[#D8B98A]/30 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Star size={16} className="text-[#D8B98A]" />
                Fidélité
              </div>
              <strong>{client.loyaltyPoints ?? 0}</strong>
            </div>

            <button className="mt-6 w-full rounded-xl border border-[#3E2C23] py-3 text-sm font-semibold text-[#3E2C23] transition hover:bg-[#3E2C23] hover:text-[#FFF4D6]">
              Voir historique
            </button>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Customers;
