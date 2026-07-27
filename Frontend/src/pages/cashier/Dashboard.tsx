import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { DollarSign, Receipt, Users, ShoppingBag, Clock } from "lucide-react";

import { getTickets } from "../../api/ticket.api";
import { getClients } from "../../api/client.api";
import { getServices } from "../../api/service.api";

import type { Ticket } from "../../types/ticket";
import type { Client } from "../../types/client";
import type { Service } from "../../types/service";

const CashierDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ticketsData, clientsData, servicesData] = await Promise.all([
          getTickets(),
          getClients(),
          getServices(),
        ]);
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);

        setClients(
          Array.isArray(clientsData)
            ? clientsData
            : (clientsData.clients ?? []),
        );
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (error) {
        console.error("[CashierDashboard]", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const todayTickets = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          new Date(ticket.createdAt).toDateString() ===
          new Date().toDateString(),
      ),
    [tickets],
  );

  const totalToday = useMemo(
    () => todayTickets.reduce((sum, ticket) => sum + ticket.total, 0),
    [todayTickets],
  );

  const popularServices = useMemo(() => {
    const counter: Record<string, number> = {};

    todayTickets.forEach((ticket) => {
      ticket.items.forEach((item) => {
        counter[item.name] = (counter[item.name] || 0) + 1;
      });
    });

    return Object.entries(counter)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [todayTickets]);

  if (loading)
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Chargement dashboard...
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <section className="ak-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="ak-kicker">Cashier</p>

          <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">ANFEL K POS</h1>

          <p className="ak-muted mt-2">Gestion des ventes et tickets du jour</p>
        </div>

        <div className="rounded-xl bg-[#F7F2EA] px-5 py-3 text-sm font-semibold">
          Réception active
        </div>
      </section>

      <section className="flex flex-wrap gap-5">
        <KpiCard
          title="Chiffre du jour"
          value={`${totalToday.toLocaleString("fr-FR")} DA`}
          icon={DollarSign}
        />

        <KpiCard
          title="Tickets"
          value={String(todayTickets.length)}
          icon={Receipt}
        />

        <KpiCard title="Clients" value={String(clients.length)} icon={Users} />

        <KpiCard
          title="Services"
          value={String(services.length)}
          icon={ShoppingBag}
        />
      </section>

      <section className="flex flex-wrap gap-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card w-full p-6 xl:w-[calc(66.666%-12px)]"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Tickets du jour</h2>

            <Receipt size={20} />
          </div>

          <div className="space-y-3">
            {todayTickets.length === 0 && (
              <p className="text-sm text-gray-400">Aucun ticket aujourd'hui</p>
            )}

            {todayTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex flex-col gap-3 rounded-2xl bg-[#F7F2EA] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">
                    {typeof ticket.client === "object"
                      ? `${ticket.client.firstName} ${ticket.client.lastName}`
                      : "Client inconnu"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {ticket.items.map((i) => i.name).join(", ")}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="font-bold text-[#3E2C23]">
                    {ticket.total.toLocaleString("fr-FR")} DA
                  </p>

                  <p className="flex items-center gap-1 text-xs text-gray-400 sm:justify-end">
                    <Clock size={12} />

                    {new Date(ticket.createdAt).toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card w-full p-6 xl:w-[calc(33.333%-16px)]"
        >
          <h2 className="mb-5 font-semibold">Services populaires</h2>

          <div className="space-y-4">
            {popularServices.length === 0 && (
              <p className="text-sm text-gray-400">Aucune donnée</p>
            )}

            {popularServices.map((service, index) => (
              <div
                key={service.name}
                className="flex items-center justify-between"
              >
                <span>
                  #{index + 1} {service.name}
                </span>

                <strong>{service.count}</strong>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const KpiCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: ComponentType<{ size?: number }>;
}) => (
  <motion.div whileHover={{ y: -5 }} className="ak-card flex-1 min-w-60 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>

        <h3 className="mt-2 text-2xl font-bold">{value}</h3>
      </div>

      <div className="rounded-full bg-[#F7F2EA] p-4">
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
);

export default CashierDashboard;
