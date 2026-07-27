import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Receipt, XCircle, X } from "lucide-react";

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

    void load();
  }, []);

  const filteredTickets = useMemo(() => {
    const value = search.toLowerCase().trim();

    return tickets.filter((ticket) => {
      const client =
        typeof ticket.client === "object"
          ? `${ticket.client.firstName} ${ticket.client.lastName}`
          : "";

      const matchSearch =
        !value ||
        ticket.ticketNumber.toLowerCase().includes(value) ||
        client.toLowerCase().includes(value);

      const matchStatus = status === "all" || ticket.status === status;

      return matchSearch && matchStatus;
    });
  }, [tickets, search, status]);

  const handleCancel = async (ticket: Ticket) => {
    if (!confirm("Annuler ce ticket ?")) return;

    try {
      const updated = await cancelTicket(ticket._id);

      setTickets((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item)),
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
      <section className="ak-card flex flex-col gap-3 p-6">
        <p className="ak-kicker">Cashier</p>

        <h1 className="font-[Cinzel] text-3xl font-bold">Historique Tickets</h1>

        <p className="ak-muted">Consultez les ventes réalisées.</p>
      </section>

      <section className="ak-card flex flex-col gap-4 p-5 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#D8B98A]/30 bg-[#FFFDF8] p-3">
          <Search size={18} className="text-[#D8B98A]" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher ticket ou cliente..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | TicketStatus)}
          className="rounded-xl border border-[#D8B98A]/30 p-3"
        >
          <option value="all">Tous</option>
          <option value="paid">Payés</option>
          <option value="cancelled">Annulés</option>
        </select>
      </section>

      <section className="ak-card p-5">
        <div className="flex flex-col gap-4">
          {filteredTickets.length === 0 && (
            <p className="text-center text-gray-400">Aucun ticket trouvé</p>
          )}

          {filteredTickets.map((ticket) => {
            const client =
              typeof ticket.client === "object"
                ? `${ticket.client.firstName} ${ticket.client.lastName}`
                : "Client";

            return (
              <article
                key={ticket._id}
                className="flex flex-col gap-4 rounded-2xl bg-[#F7F2EA] p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Receipt size={18} />

                    <strong>{ticket.ticketNumber}</strong>
                  </div>

                  <span className="text-sm">{client}</span>

                  <span className="text-xs text-gray-500">
                    {ticket.items.length} prestation(s)
                  </span>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <strong className="text-xl text-[#3E2C23]">
                    {ticket.total.toLocaleString("fr-FR")} DA
                  </strong>

                  <span className="rounded-full bg-white px-3 py-1 text-xs">
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
              </article>
            );
          })}
        </div>
      </section>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-[Cinzel] text-xl font-bold">
                {selected.ticketNumber}
              </h2>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {selected.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-[#F7F2EA] p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>

                    {item.duration && (
                      <p className="text-xs text-gray-500">
                        {item.duration} min
                      </p>
                    )}
                  </div>

                  <strong>{item.finalPrice.toLocaleString("fr-FR")} DA</strong>
                </div>
              ))}

              {selected.discount > 0 && (
                <div className="flex justify-between border-t pt-3 text-sm">
                  <span>Remise</span>

                  <strong>-{selected.discount} DA</strong>
                </div>
              )}

              <div className="flex justify-between border-t pt-4 text-lg">
                <span>Total</span>

                <strong className="text-[#3E2C23]">
                  {selected.total.toLocaleString("fr-FR")} DA
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierTickets;
