import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  CreditCard,
  Plus,
  Receipt,
  Search,
  Trash2,
  User,
  WalletCards,
} from "lucide-react";

import { getServices } from "../../api/service.api";
import { getClients } from "../../api/client.api";
import { getEmployees } from "../../api/employee.api";
import { createTicket } from "../../api/ticket.api";

import type { Service } from "../../types/service";
import type { Client } from "../../types/client";
import type { Employee } from "../../types/employee";

type PaymentMethod = "cash" | "card" | "transfer";

type CartItem = {
  service: Service;
  employee: Employee | null;
  finalPrice: number;
};

const POS = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [cart, setCart] = useState<CartItem[]>([]);

  const [searchService, setSearchService] = useState("");
  const [searchClient, setSearchClient] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, clientsData, employeesData] = await Promise.all([
          getServices(),
          getClients(),
          getEmployees(),
        ]);

        setServices(Array.isArray(servicesData) ? servicesData : []);

        setClients(Array.isArray(clientsData) ? clientsData : []);

        setEmployees(
          Array.isArray(employeesData)
            ? employeesData.filter((item) => item.role === "employee")
            : [],
        );
      } catch (err) {
        console.error("[POS] load:", err);
        setError("Impossible de charger la caisse");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.name.toLowerCase().includes(searchService.toLowerCase()),
    );
  }, [services, searchService]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchClient.toLowerCase()),
    );
  }, [clients, searchClient]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.finalPrice, 0);
  }, [cart]);

  const addService = (service: Service) => {
    setCart((current) => [
      ...current,
      {
        service,
        employee: selectedEmployee,
        finalPrice: service.price,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setCart((current) => current.filter((_, i) => i !== index));
  };

  const updateEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);

    setCart((current) =>
      current.map((item) => ({
        ...item,
        employee,
      })),
    );
  };

  const checkout = async () => {
    if (!selectedClient) {
      setError("Veuillez sélectionner un client");
      return;
    }

    if (!selectedEmployee) {
      setError("Veuillez sélectionner un employé");
      return;
    }

    if (!cart.length) {
      setError("Le panier est vide");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createTicket({
        client: selectedClient._id,
        employee: selectedEmployee._id,
        services: cart.map((item) => ({
          service: item.service._id,
          finalPrice: item.finalPrice,
        })),
        paymentMethod,
      });

      setCart([]);
      setSelectedClient(null);
    } catch (err) {
      console.error("[POS] checkout:", err);
      setError("Erreur lors de la création du ticket");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Chargement de la caisse...
      </div>
    );
  }
  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-[#D8B98A]/30 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#D8B98A]">
            Cashier
          </p>

          <h1 className="mt-3 font-[Cinzel] text-3xl font-bold text-[#151515]">
            ANFAL K POS
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Création d'un nouveau ticket
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#F7F2EA] px-5 py-3">
          <Receipt size={20} />

          <span className="font-semibold">Nouvelle vente</span>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-5 lg:col-span-2">
          {/* CLIENT */}
          <section className="rounded-3xl border border-[#D8B98A]/30 bg-white p-5">
            <label className="text-sm font-semibold">Client</label>

            <div className="mt-3 flex items-center gap-3 rounded-xl border p-3">
              <User size={18} />

              <input
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
                placeholder="Rechercher un client..."
                className="w-full outline-none"
              />
            </div>

            {searchClient && (
              <div className="mt-3 space-y-2">
                {filteredClients.slice(0, 5).map((client) => (
                  <button
                    key={client._id}
                    onClick={() => {
                      setSelectedClient(client);
                      setSearchClient("");
                    }}
                    className="flex w-full justify-between rounded-xl bg-[#F7F2EA] p-3 text-left"
                  >
                    <span>
                      {client.firstName} {client.lastName}
                    </span>

                    <span className="text-xs text-gray-500">
                      {client.phone}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedClient && (
              <div className="mt-3 rounded-xl bg-[#151515] p-3 text-[#FFF4D6]">
                Client :
                <strong className="ml-2">
                  {selectedClient.firstName} {selectedClient.lastName}
                </strong>
              </div>
            )}
          </section>

          {/* EMPLOYEE */}

          <section className="rounded-3xl border border-[#D8B98A]/30 bg-white p-5">
            <label className="text-sm font-semibold">Employé</label>

            <select
              value={selectedEmployee?._id || ""}
              onChange={(e) => {
                const employee = employees.find(
                  (item) => item._id === e.target.value,
                );

                if (employee) {
                  updateEmployee(employee);
                }
              }}
              className="mt-3 w-full rounded-xl border p-3 outline-none"
            >
              <option value="">Choisir un employé</option>

              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </section>

          {/* SERVICES */}

          <section className="rounded-3xl border border-[#D8B98A]/30 bg-white p-5">
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <Search size={18} />

              <input
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                placeholder="Rechercher une prestation..."
                className="w-full outline-none"
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {filteredServices.map((service) => (
                <motion.div
                  key={service._id}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-[#D8B98A]/20 p-5"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold">{service.name}</h3>

                      <p className="text-sm text-gray-500">
                        {service.duration} min
                      </p>
                    </div>

                    <strong>{service.price} DA</strong>
                  </div>

                  <button
                    onClick={() => addService(service)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3E2C23] py-3 text-[#FFF4D6]"
                  >
                    <Plus size={17} />
                    Ajouter
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}

        <section className="h-fit rounded-3xl border border-[#D8B98A]/30 bg-white p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">Ticket</h2>

            <Receipt />
          </div>

          <div className="mt-5 space-y-3">
            {cart.length === 0 && (
              <p className="text-sm text-gray-400">Aucun service</p>
            )}

            {cart.map((item, index) => (
              <div key={index} className="rounded-xl border p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{item.service.name}</p>

                    <p className="text-xs text-gray-500">
                      {item.employee?.firstName || "Sans employé"}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="mt-2 font-bold">{item.finalPrice} DA</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between text-xl">
              <span>Total</span>

              <strong>{total} DA</strong>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`rounded-xl p-3 ${paymentMethod === "cash" ? "bg-[#151515] text-[#FFF4D6]" : "bg-[#F7F2EA]"}`}
              >
                <Banknote size={18} className="mx-auto" />
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`rounded-xl p-3 ${paymentMethod === "card" ? "bg-[#151515] text-[#FFF4D6]" : "bg-[#F7F2EA]"}`}
              >
                <CreditCard size={18} className="mx-auto" />
              </button>

              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`rounded-xl p-3 ${paymentMethod === "transfer" ? "bg-[#151515] text-[#FFF4D6]" : "bg-[#F7F2EA]"}`}
              >
                <WalletCards size={18} className="mx-auto" />
              </button>
            </div>

            <button
              disabled={saving}
              onClick={checkout}
              className="mt-5 w-full rounded-xl bg-[#D8B98A] py-4 font-bold text-[#151515] disabled:opacity-50"
            >
              {saving ? "Paiement..." : "Valider le paiement"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default POS;
