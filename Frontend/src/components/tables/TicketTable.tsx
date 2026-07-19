import { Eye, XCircle } from "lucide-react";

import type { Ticket } from "../../types/ticket";

interface TicketTableProps {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
  onCancel: (ticket: Ticket) => void;
}

const TicketTable = ({ tickets, onView, onCancel }: TicketTableProps) => {
  if (!tickets.length) {
    return (
      <div className="rounded-3xl border border-[#eadfce] bg-white p-8 text-center text-gray-500">
        Aucun ticket trouvé.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#eadfce] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left">
          <thead className="border-b border-[#eadfce] bg-[#fffaf0]">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold">Ticket</th>
              <th className="px-6 py-4 text-sm font-semibold">Client</th>
              <th className="px-6 py-4 text-sm font-semibold">Employé</th>
              <th className="px-6 py-4 text-sm font-semibold">Total</th>
              <th className="px-6 py-4 text-sm font-semibold">Paiement</th>
              <th className="px-6 py-4 text-sm font-semibold">Statut</th>
              <th className="px-6 py-4 text-sm font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => {
              const client =
                typeof ticket.client === "object" ? ticket.client : null;
              const employee =
                typeof ticket.employee === "object" ? ticket.employee : null;

              return (
                <tr
                  key={ticket._id}
                  className="border-b border-[#eadfce] last:border-none"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold">{ticket.ticketNumber}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {client ? `${client.firstName} ${client.lastName}` : "-"}
                  </td>

                  <td className="px-6 py-4">
                    {employee
                      ? `${employee.firstName} ${employee.lastName}`
                      : "-"}
                  </td>

                  <td className="px-6 py-4 font-semibold">{ticket.total} DA</td>

                  <td className="px-6 py-4 capitalize">
                    {ticket.paymentMethod}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${ticket.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {ticket.status === "paid" ? "Payé" : "Annulé"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onView(ticket)}
                        className="rounded-xl border border-[#eadfce] p-2 transition hover:bg-[#fff4d6]"
                        title="Voir"
                      >
                        <Eye size={18} />
                      </button>

                      {ticket.status === "paid" && (
                        <button
                          onClick={() => onCancel(ticket)}
                          className="rounded-xl border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                          title="Annuler"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
