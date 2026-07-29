import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Euro,
  Lock,
  Receipt,
  Search,
  TrendingDown,
  TrendingUp,
  Unlock,
} from "lucide-react";

import { getCashRegisterHistory } from "../../api/cashRegister.api";
import type { CashRegister } from "../../types/cashRegister";

const CashRegisterHistory = () => {
  const [history, setHistory] = useState<CashRegister[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "open" | "closed">("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getCashRegisterHistory(
          status !== "all" ? { status } : undefined,
        );
        setHistory(data);
      } catch (err) {
        console.error("[CashRegisterHistory]", err);
        setError("Impossible de charger l'historique des caisses");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  const filteredHistory = useMemo(() => {
    const query = search.toLowerCase();
    return history.filter((item) => {
      const cashierName =
        typeof item.cashier === "object"
          ? `${item.cashier.firstName} ${item.cashier.lastName}`.toLowerCase()
          : "";
      return cashierName.includes(query) || item.date.includes(query);
    });
  }, [history, search]);

  const totalRevenue = useMemo(
    () =>
      history.reduce(
        (sum, item) =>
          sum + item.totals.cash + item.totals.card + item.totals.transfer,
        0,
      ),
    [history],
  );

  const exportCSV = () => {
    const headers = [
      "Date",
      "Caissier",
      "Statut",
      "Fond ouverture",
      "Espèces",
      "Carte",
      "Virement",
      "Tickets",
      "Comptage réel",
      "Attendu",
      "Écart",
    ];

    const rows = filteredHistory.map((item) => {
      const cashierName =
        typeof item.cashier === "object"
          ? `${item.cashier.firstName} ${item.cashier.lastName}`
          : "";
      return [
        item.date,
        cashierName,
        item.status === "open" ? "Ouverte" : "Fermée",
        item.openingAmount,
        item.totals.cash,
        item.totals.card,
        item.totals.transfer,
        item.totals.ticketsCount,
        item.closingAmount ?? "",
        item.expectedAmount ?? "",
        item.difference ?? "",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(";"))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `historique-caisses-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Chargement de l'historique des caisses...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
            Administration
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold">
            Historique des caisses
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Suivi des ouvertures/fermetures de caisse par journée
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3E2C23] px-5 py-3 text-[#fff4d6] transition hover:bg-[#5a3a1e]"
        >
          <Download size={18} />
          Exporter CSV
        </button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Receipt} title="Sessions" value={history.length} />
        <StatCard
          icon={Euro}
          title="Total encaissé"
          value={`${totalRevenue} DA`}
        />
        <StatCard
          icon={Unlock}
          title="Caisses ouvertes"
          value={history.filter((h) => h.status === "open").length}
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <div className="flex flex-col gap-3 rounded-3xl border border-[#eadfce] bg-white p-5 md:flex-row">
        <div className="flex flex-1 items-center gap-3">
          <Search size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par caissier ou date..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "all" | "open" | "closed")
          }
          className="rounded-xl border border-[#eadfce] px-4 py-2"
        >
          <option value="all">Tous les statuts</option>
          <option value="open">Ouvertes</option>
          <option value="closed">Fermées</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#eadfce] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left">
            <thead className="border-b border-[#eadfce] bg-[#fffaf0]">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-sm font-semibold">Caissier</th>
                <th className="px-6 py-4 text-sm font-semibold">Fond</th>
                <th className="px-6 py-4 text-sm font-semibold">Espèces</th>
                <th className="px-6 py-4 text-sm font-semibold">Carte</th>
                <th className="px-6 py-4 text-sm font-semibold">Virement</th>
                <th className="px-6 py-4 text-sm font-semibold">Écart</th>
                <th className="px-6 py-4 text-sm font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => {
                const cashierName =
                  typeof item.cashier === "object"
                    ? `${item.cashier.firstName} ${item.cashier.lastName}`
                    : "-";
                return (
                  <tr
                    key={item._id}
                    className="border-b border-[#eadfce] last:border-none"
                  >
                    <td className="px-6 py-4 font-semibold">{item.date}</td>
                    <td className="px-6 py-4">{cashierName}</td>
                    <td className="px-6 py-4">{item.openingAmount} DA</td>
                    <td className="px-6 py-4">{item.totals.cash} DA</td>
                    <td className="px-6 py-4">{item.totals.card} DA</td>
                    <td className="px-6 py-4">{item.totals.transfer} DA</td>
                    <td className="px-6 py-4">
                      {item.difference === undefined ? (
                        "-"
                      ) : item.difference === 0 ? (
                        <span className="text-green-600">Juste</span>
                      ) : item.difference > 0 ? (
                        <span className="flex items-center gap-1 text-blue-600">
                          <TrendingUp size={14} />+{item.difference} DA
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <TrendingDown size={14} />
                          {item.difference} DA
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${item.status === "open" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {item.status === "open" ? (
                          <Unlock size={12} />
                        ) : (
                          <Lock size={12} />
                        )}
                        {item.status === "open" ? "Ouverte" : "Fermée"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!filteredHistory.length && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Aucune session de caisse trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function StatCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  value: string | number;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-[#eadfce] bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-3xl font-bold">{value}</h3>
    </motion.div>
  );
}

export default CashRegisterHistory;
