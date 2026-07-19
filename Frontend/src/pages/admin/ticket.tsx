import { useEffect, useMemo, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { CreditCard, Euro, Receipt, Search, Users } from "lucide-react";

import { getTickets, cancelTicket } from "../../api/ticket.api";

import type { Ticket, TicketStatus, PaymentMethod } from "../../types/ticket";

import TicketTable from "../../components/tables/TicketTable";
import ViewTicketModal from "../../components/ticket/ViewTicketModal";
import CancelTicketModal from "../../components/ticket/CancelTicketModal";

type ModalType = "view" | "cancel" | null;

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [payment, setPayment] = useState<"all" | PaymentMethod>("all");

  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTickets = async () => {
      try {
        const data = await getTickets();

        if (!active) return;

        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;

        console.error("[Tickets] load:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les tickets",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTickets();

    return () => {
      active = false;
    };
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const clientName =
        typeof ticket.client === "object"
          ? `${ticket.client.firstName} ${ticket.client.lastName}`
          : "";

      const searchMatch =
        ticket.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
        clientName.toLowerCase().includes(search.toLowerCase());

      const statusMatch = status === "all" || ticket.status === status;

      const paymentMatch =
        payment === "all" || ticket.paymentMethod === payment;

      return searchMatch && statusMatch && paymentMatch;
    });
  }, [tickets, search, status, payment]);

  const totalRevenue = useMemo(() => {
    return tickets
      .filter((ticket) => ticket.status === "paid")
      .reduce((total, ticket) => total + ticket.total, 0);
  }, [tickets]);

  const totalClients = useMemo(() => {
    return new Set(
      tickets.map((ticket) =>
        typeof ticket.client === "object" ? ticket.client._id : ticket.client,
      ),
    ).size;
  }, [tickets]);

  const handleCancel = async () => {
    if (!selectedTicket) return;

    try {
      setCancelLoading(true);

      const updated = await cancelTicket(selectedTicket._id);

      setTickets((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );

      setSelectedTicket(null);
      setModal(null);
    } catch (err) {
      console.error("[Tickets] cancel:", err);
    } finally {
      setCancelLoading(false);
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
      <section className="flex flex-col gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
            Administration
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#111]">
            Gestion des tickets
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Suivez les ventes et paiements de l'institut.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Receipt} title="Tickets" value={tickets.length} />
        <StatCard
          icon={Euro}
          title="Chiffre d'affaires"
          value={`${totalRevenue} DA`}
        />
        <StatCard icon={Users} title="Clients" value={totalClients} />
        <StatCard
          icon={CreditCard}
          title="Payés"
          value={tickets.filter((item) => item.status === "paid").length}
        />
      </div>
      <div className="flex flex-col gap-3 rounded-3xl border border-[#eadfce] bg-white p-5 md:flex-row">
        <div className="flex flex-1 items-center gap-3">
          <Search size={20} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un ticket..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | TicketStatus)}
          className="rounded-xl border border-[#eadfce] px-4 py-2"
        >
          <option value="all">Tous les statuts</option>
          <option value="paid">Payé</option>
          <option value="cancelled">Annulé</option>
        </select>

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value as "all" | PaymentMethod)}
          className="rounded-xl border border-[#eadfce] px-4 py-2"
        >
          {/* <option value="all">Tous les paiements</option> */}
          <option value="cash">Espèces</option>
          {/* <option value="card">Carte</option>
          <option value="transfer">Virement</option> */}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <TicketTable
        tickets={filteredTickets}
        onView={(ticket) => {
          setSelectedTicket(ticket);
          setModal("view");
        }}
        onCancel={(ticket) => {
          setSelectedTicket(ticket);
          setModal("cancel");
        }}
      />

      {modal === "view" && selectedTicket && (
        <ViewTicketModal
          ticket={selectedTicket}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "cancel" && selectedTicket && (
        <CancelTicketModal
          ticket={selectedTicket}
          loading={cancelLoading}
          onConfirm={handleCancel}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: ComponentType<{ size?: number }>;
  title: string;
  value: string | number;
}) => {
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
};

export default Tickets;
