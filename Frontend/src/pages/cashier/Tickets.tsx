/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Receipt, XCircle } from "lucide-react";

import { getTickets, cancelTicket } from "../../api/ticket.api";

import type { Ticket, TicketStatus } from "../../types/ticket";

const statusLabels: Record<TicketStatus, string> = {
  paid: "Payé",
  cancelled: "Annulé",
};

const CashierTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<"all" | TicketStatus>("all");

  const [selected, setSelected] = useState<Ticket | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTickets();

        setTickets(data);
      } catch (error) {
        console.error("[Cashier Tickets]", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const client =
        typeof ticket.client === "object"
          ? `${ticket.client.firstName} ${ticket.client.lastName}`
          : "";

      const matchSearch =
        ticket.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
        client.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || ticket.status === status;

      return matchSearch && matchStatus;
    });
  }, [tickets, search, status]);

  const handleCancel = async (ticket: Ticket) => {
    try {
      const updated = await cancelTicket(ticket._id);

      setTickets((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
    } catch (error) {
      console.error("[Cancel Ticket]", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Chargement des tickets...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="rounded-3xl border border-[#D8B98A]/30 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#D8B98A]">
          Cashier
        </p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">
          Historique Tickets
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Consultez les ventes réalisées.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-[#D8B98A]/30 bg-white p-5 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border p-3">
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher ticket ou client..."
            className="w-full outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="rounded-xl border p-3"
        >
          <option value="all">Tous</option>

          <option value="paid">Payés</option>

          <option value="cancelled">Annulés</option>
        </select>
      </section>

      <section className="rounded-3xl border border-[#D8B98A]/30 bg-white p-5">
        <div className="space-y-3">
          {filteredTickets.length === 0 && (
            <p className="text-center text-gray-400">Aucun ticket trouvé</p>
          )}

          {filteredTickets.map((ticket) => {
            const client =
              typeof ticket.client === "object"
                ? `${ticket.client.firstName} ${ticket.client.lastName}`
                : "Client";

            return (
              <div
                key={ticket._id}
                className="flex flex-col gap-4 rounded-2xl bg-[#F7F2EA] p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Receipt size={18} />

                    <strong>{ticket.ticketNumber}</strong>
                  </div>

                  <p className="mt-2 text-sm">{client}</p>

                  <p className="text-xs text-gray-500">
                    {ticket.items.length} prestation(s)
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-[#3E2C23]">
                    {ticket.total} DA
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      ticket.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {statusLabels[ticket.status]}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(ticket)}
                    className="rounded-xl bg-[#151515] p-3 text-[#FFF4D6]"
                  >
                    <Eye size={18} />
                  </button>

                  {ticket.status === "paid" && (
                    <button
                      onClick={() => handleCancel(ticket)}
                      className="rounded-xl bg-red-100 p-3 text-red-600"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">{selected.ticketNumber}</h2>

              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="mt-5 space-y-3">
              {selected.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between rounded-xl bg-[#F7F2EA] p-3"
                >
                  <span>{item.name}</span>

                  <strong>{item.finalPrice} DA</strong>
                </div>
              ))}

              <div className="border-t pt-4 flex justify-between text-lg">
                <span>Total</span>

                <strong>{selected.total} DA</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierTickets;
