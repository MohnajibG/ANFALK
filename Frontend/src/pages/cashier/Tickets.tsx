import { Eye, Search, Receipt, XCircle, X } from "lucide-react";

import useTickets from "../../hooks/useTickets";

import type { TicketStatus } from "../../types/ticket";

const statusLabels: Record<TicketStatus, string> = {
  waiting_payment: "En attente de paiement",
  paid: "Payé",
  cancelled: "Annulé",
};

const CashierTickets = () => {
  const {
    filteredTickets,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    selectedTicket,
    setSelectedTicket,
    handleCancel,
  } = useTickets();

  const cancelTicket = async (id: string) => {
    if (!confirm("Annuler ce ticket ?")) return;

    await handleCancel(id);
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
      <section className="rounded-[var(--radius-md)] border border-(--border) bg-white p-6 shadow-[var(--shadow-sm)] flex flex-col gap-3 p-6">
        <p className="ak-kicker">Cashier</p>

        <h1 className="font-[Cinzel] text-3xl font-bold">Historique Tickets</h1>

        <p className="ak-muted">Consultez les ventes réalisées.</p>
      </section>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <section className="rounded-[var(--radius-md)] border border-(--border) bg-white p-6 shadow-[var(--shadow-sm)] flex flex-col gap-4 p-5 md:flex-row">
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

      <section className="rounded-[var(--radius-md)] border border-(--border) bg-white p-6 shadow-[var(--shadow-sm)] p-5">
        {!filteredTickets.length && (
          <p className="text-center text-gray-400">Aucun ticket trouvé</p>
        )}

        <div className="flex flex-col gap-4">
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
                    onClick={() => setSelectedTicket(ticket)}
                    className="rounded-xl bg-[#151515] p-3 text-[#FFF4D6]"
                  >
                    <Eye size={18} />
                  </button>

                  {ticket.status === "paid" && (
                    <button
                      onClick={() => cancelTicket(ticket._id)}
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

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-[Cinzel] text-xl font-bold">
                {selectedTicket.ticketNumber}
              </h2>

              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-xl p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {selectedTicket.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-[#F7F2EA] p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>

                    <p className="text-xs text-gray-500">{item.duration} min</p>
                  </div>

                  <strong>{item.finalPrice.toLocaleString("fr-FR")} DA</strong>
                </div>
              ))}

              {selectedTicket.discount > 0 && (
                <div className="flex justify-between border-t pt-3 text-sm">
                  <span>Remise</span>

                  <strong>-{selectedTicket.discount} DA</strong>
                </div>
              )}

              <div className="flex justify-between border-t pt-4 text-lg">
                <span>Total</span>

                <strong className="text-[#3E2C23]">
                  {selectedTicket.total.toLocaleString("fr-FR")} DA
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
