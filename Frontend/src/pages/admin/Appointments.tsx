// src/pages/admin/Appointments.tsx

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Check,
  X,
  Clock,
  CircleCheck,
  UserRound,
  Scissors,
  Plus,
  Trash2,
} from "lucide-react";

import {
  getAppointments,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} from "../../api/appointment.api";

import { useAuth } from "../../hooks/useAuth";
import type { Appointment, AppointmentStatus } from "../../types/appointment";

import AppointmentForm from "../../components/appointments/AppointmentForm";

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  in_progress: "En cours",
  completed: "Terminé",
  waiting_payment: "Paiement attendu",
  paid: "Payé",
  cancelled: "Annulé",
  no_show: "Client absent",
};

const statusStyle: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  waiting_payment: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-stone-100 text-stone-700",
};

export default function Appointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );

  const isEmployee = user?.role === "employee";

  const canDelete = user?.role === "admin" || user?.role === "cashier";

  useEffect(() => {
    let mounted = true;

    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const data = await getAppointments();

        if (mounted) {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Erreur chargement rendez-vous", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (isEmployee) {
        const ownAppointment = appointment.services.some((service) => {
          if (typeof service.employee === "string") {
            return service.employee === user?._id;
          }

          return service.employee?._id === user?._id;
        });

        if (!ownAppointment) {
          return false;
        }
      }

      const client =
        typeof appointment.client === "string"
          ? ""
          : `${appointment.client.firstName} ${appointment.client.lastName}`.toLowerCase();

      const phone =
        typeof appointment.client === "string"
          ? ""
          : (appointment.client.phone ?? "");

      const searchMatch =
        client.includes(search.toLowerCase()) || phone.includes(search);

      const statusMatch =
        statusFilter === "all" || appointment.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [appointments, search, statusFilter, isEmployee, user]);

  const changeStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointment(id, {
        status,
      });

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === id
            ? {
                ...appointment,
                status,
              }
            : appointment,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Annuler ce rendez-vous ?")) {
      return;
    }

    try {
      await cancelAppointment(id);

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === id
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ce rendez-vous ?")) {
      return;
    }

    try {
      await deleteAppointment(id);

      setAppointments((current) =>
        current.filter((appointment) => appointment._id !== id),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-title text-3xl text-(--black)">Rendez-vous</h1>

          <p className="mt-1 text-sm text-stone-500">
            Gestion des réservations et suivi des prestations
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream)"
        >
          <Plus size={18} />
          Nouveau
        </button>
      </header>

      {showForm && (
        <AppointmentForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);

            const refresh = async () => {
              const data = await getAppointments();
              setAppointments(data);
            };

            refresh();
          }}
        />
      )}

      <div className="flex flex-col gap-3 rounded-3xl border border-(--border) bg-white p-5 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-(--cream) px-4">
          <Search size={18} />

          <input
            className="h-12 w-full bg-transparent outline-none"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="h-12 rounded-2xl border border-(--border) px-4"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as AppointmentStatus | "all")
          }
        >
          <option value="all">Tous les rendez-vous</option>

          {Object.entries(statusLabels).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center">
          Chargement...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <article
              key={appointment._id}
              className="rounded-3xl border border-(--border) bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--cream)">
                    <UserRound size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {typeof appointment.client !== "string" &&
                        `${appointment.client.firstName} ${appointment.client.lastName}`}
                    </h3>

                    <p className="text-sm text-stone-500">
                      {typeof appointment.client !== "string" &&
                        appointment.client.phone}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${statusStyle[appointment.status]}`}
                >
                  {statusLabels[appointment.status]}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3 text-sm md:flex-row">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {appointment.date} {appointment.startTime}
                </span>

                <span className="flex items-center gap-2">
                  <Scissors size={16} />
                  {appointment.services
                    .map((service) => service.name)
                    .join(", ")}
                </span>

                <strong>{appointment.estimatedPrice} DA</strong>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-(--border) pt-4">
                {(appointment.status === "pending" ||
                  appointment.status === "confirmed") && (
                  <button
                    onClick={() => changeStatus(appointment._id, "confirmed")}
                    className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-emerald-700"
                  >
                    <Check size={16} />
                    Confirmer
                  </button>
                )}

                <button
                  onClick={() => changeStatus(appointment._id, "completed")}
                  className="flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-blue-700"
                >
                  <CircleCheck size={16} />
                  Terminer
                </button>

                <button
                  onClick={() => handleCancel(appointment._id)}
                  className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-red-700"
                >
                  <X size={16} />
                  Annuler
                </button>

                {canDelete && (
                  <button
                    onClick={() => handleDelete(appointment._id)}
                    className="flex items-center gap-2 rounded-xl bg-stone-100 px-4 py-2 text-stone-700"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
