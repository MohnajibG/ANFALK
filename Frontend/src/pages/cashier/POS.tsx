import { Receipt } from "lucide-react";

import usePOS from "../../hooks/usePOS";

import ClientSelector from "../../components/POS/ClientSelector";
import ServiceSelector from "../../components/POS/ServiceSelector";
import TicketCart from "../../components/POS/TicketCart";
import WaitingAppointments from "../../components/POS/WaitingAppointments";
import PaymentBox from "../../components/POS/PaymentBox";

const POS = () => {
  const pos = usePOS();

  if (pos.loading) {
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

          <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">ANFAL K POS</h1>

          <p className="mt-2 text-sm text-gray-500">
            Création d'un nouveau ticket
          </p>
        </div>

        <div
          onClick={pos.newTicket}
          className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#F7F2EA] px-5 py-3"
        >
          <Receipt size={20} />
          Nouvelle vente
        </div>
      </section>

      {pos.error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">
          {pos.error}
        </div>
      )}

      {pos.selectedAppointment && (
        <div className="rounded-2xl bg-green-50 p-4 text-green-700">
          Rendez-vous chargé dans le ticket
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <ClientSelector
            selectedClient={pos.selectedClient}
            search={pos.searchClient}
            setSearch={pos.setSearchClient}
            setClient={pos.setSelectedClient}
          />

          <ServiceSelector
            services={pos.filteredServices}
            search={pos.searchService}
            setSearch={pos.setSearchService}
            addService={pos.addService}
          />

          <WaitingAppointments
            appointments={pos.waitingAppointments}
            selectAppointment={pos.selectAppointment}
          />
        </div>

        <div>
          <TicketCart
            cart={pos.cart}
            employees={pos.employees}
            removeItem={pos.removeItem}
            updateEmployee={pos.updateEmployee}
            updatePrice={pos.updatePrice}
          />

          <PaymentBox
            total={pos.total}
            paymentMethod={pos.paymentMethod}
            setPaymentMethod={pos.setPaymentMethod}
            saving={pos.saving}
            checkout={pos.checkout}
          />
        </div>
      </div>
    </div>
  );
};

export default POS;
