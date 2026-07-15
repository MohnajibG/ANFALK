/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, User, Euro, Eye, Pencil } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getClients({
        search,
        page: 1,
        limit: 20,
      });

      setClients(data.clients || []);
    } catch (err: any) {
      setError(err.message || "Unable to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchClients = async () => {
      try {
        setLoading(true);

        const data = await getClients({
          search,
          page: 1,
          limit: 20,
        });

        if (!ignore) {
          setClients(data.clients || []);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || "Unable to load clients");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchClients();

    return () => {
      ignore = true;
    };
  }, [search]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-3xl bg-white border border-[#eadfce] p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
            Administration
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold text-[#111]">
            Clients Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage customer profiles and history.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3E2C23] px-5 py-3 text-[#FFF4D6] transition hover:bg-[#5a3a1e]"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-[#eadfce] p-4 flex items-center gap-3">
        <Search size={20} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search client..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <div className="overflow-hidden rounded-3xl bg-white border border-[#eadfce]">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No clients found.
          </div>
        ) : (
          clients.map((client) => (
            <motion.div
              key={client._id}
              whileHover={{ backgroundColor: "#faf7f0" }}
              className="grid gap-4 border-b border-[#eee] p-5 md:grid-cols-6 md:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4D6]">
                  <User size={18} />
                </div>

                <div>
                  <p className="font-semibold">
                    {client.firstName} {client.lastName}
                  </p>

                  <p className="text-xs text-gray-500">{client.email || "-"}</p>
                </div>
              </div>

              <span>{client.phone}</span>

              <span className="text-sm font-medium">
                {client.visitCount} visits
              </span>

              <span className="flex items-center gap-1 font-semibold">
                <Euro size={14} />
                {client.totalSpent} DA
              </span>

              <span className="text-sm text-gray-500">
                {client.lastVisit || "-"}
              </span>

              <div className="flex gap-2">
                <button className="rounded-lg bg-[#FFF4D6] p-2">
                  <Eye size={16} />
                </button>

                <button className="rounded-lg bg-[#3E2C23] p-2 text-white">
                  <Pencil size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Clients" value={clients.length.toString()} />

        <StatCard title="Active Clients" value={clients.length.toString()} />

        <StatCard title="Average Revenue" value="0 DA" />
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
      className="rounded-3xl bg-white border border-[#eadfce] p-6"
    >
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </motion.div>
  );
}
