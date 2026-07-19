import { X } from "lucide-react";

import type { Ticket } from "../../types/ticket";

interface ViewTicketModalProps {
  ticket: Ticket;
  onClose: () => void;
}

const ViewTicketModal = ({ ticket, onClose }: ViewTicketModalProps) => {
  const client = typeof ticket.client === "object" ? ticket.client : null;
  const employee = typeof ticket.employee === "object" ? ticket.employee : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#eadfce] bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b7560]">
              Ticket
            </p>
            <h2 className="mt-2 text-2xl font-bold">{ticket.ticketNumber}</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-[#eadfce] p-2 hover:bg-[#fff4d6]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl bg-[#fffaf0] p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Client</p>
            <p className="font-medium">
              {client ? `${client.firstName} ${client.lastName}` : "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Employé</p>
            <p className="font-medium">
              {employee ? `${employee.firstName} ${employee.lastName}` : "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Paiement</p>
            <p className="font-medium capitalize">{ticket.paymentMethod}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="font-medium">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-semibold">Prestations</h3>

          <div className="space-y-3">
            {ticket.items.map((item) => (
              <div
                key={item.service}
                className="flex items-center justify-between rounded-2xl border border-[#eadfce] p-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.duration} min</p>
                </div>

                <p className="font-semibold">{item.finalPrice} DA</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-[#fffaf0] p-4">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{ticket.subtotal} DA</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Remise</span>
            <span>- {ticket.discount} DA</span>
          </div>

          <div className="flex justify-between border-t border-[#eadfce] pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{ticket.total} DA</span>
          </div>
        </div>

        {ticket.notes && (
          <div className="mt-5 rounded-2xl border border-[#eadfce] p-4">
            <p className="text-xs text-gray-500">Note</p>
            <p>{ticket.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTicketModal;
