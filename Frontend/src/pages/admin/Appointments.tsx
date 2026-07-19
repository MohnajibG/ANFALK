// src/pages/admin/Appointments.tsx

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Check,
  X,
  Clock,
  CircleCheck,
  UserRound,
  Scissors,
} from "lucide-react";

import {
  getAppointments,
  updateAppointment,
  cancelAppointment,
} from "../../api/appointment.api";

import type { Appointment, AppointmentStatus } from "../../types/appointment";

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  completed: "Terminé",
  cancelled: "Annulé",
  no_show: "Client absent",
};

const statusStyle: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-stone-100 text-stone-700",
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const data = await getAppointments();

        if (!cancelled) {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Impossible de charger les rendez-vous", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const client =
        `${appointment.client.firstName} ${appointment.client.lastName}`.toLowerCase();

      const recherche =
        client.includes(search.toLowerCase()) ||
        appointment.client.phone?.includes(search);

      const statut =
        statusFilter === "all" || appointment.status === statusFilter;

      return recherche && statut;
    });
  }, [appointments, search, statusFilter]);

  const changeStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointment(id, { status });

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
    if (!window.confirm("Voulez-vous annuler ce rendez-vous ?")) return;

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

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-title text-3xl text-(--black)">Rendez-vous</h1>

          <p className="mt-1 text-sm text-stone-500">
            Gestion des réservations et suivi des prestations
          </p>
        </div>

        <div
          className="
          flex h-14 w-14 items-center justify-center
          rounded-2xl
          bg-(--black)
          text-(--cream)
        "
        >
          <CalendarDays size={26} />
        </div>
      </header>

      <div
        className="
        flex flex-col gap-3
        rounded-3xl
        border border-(--border)
        bg-white
        p-5
        md:flex-row
      "
      >
        <div
          className="
          flex flex-1 items-center gap-3
          rounded-2xl
          bg-(--cream)
          px-4
        "
        >
          <Search size={18} />

          <input
            className="
              h-12 w-full
              bg-transparent
              outline-none
              placeholder:text-stone-400
            "
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="
            h-12 rounded-2xl
            border border-(--border)
            bg-white
            px-4
            outline-none
          "
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
        <div
          className="
          rounded-3xl
          bg-white
          p-10
          text-center
        "
        >
          Chargement des rendez-vous...
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAppointments.map((appointment) => (
            <article
              key={appointment._id}
              className="
                flex flex-col gap-5
                rounded-3xl
                border border-(--border)
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-md
              "
            >
              <div
                className="
                flex flex-col gap-4
                md:flex-row
                md:items-center
                md:justify-between
              "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-(--cream)
                  "
                  >
                    <UserRound size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {appointment.client.firstName}{" "}
                      {appointment.client.lastName}
                    </h3>

                    <p className="text-sm text-stone-500">
                      {appointment.client.phone}
                    </p>
                  </div>
                </div>

                <span
                  className={`
                    rounded-full
                    px-4 py-2
                    text-xs font-semibold
                    ${statusStyle[appointment.status]}
                  `}
                >
                  {statusLabels[appointment.status]}
                </span>
              </div>

              <div
                className="
                flex flex-col gap-3
                text-sm
                md:flex-row
                md:items-center
              "
              >
                <div className="flex items-center gap-2">
                  <Clock size={16} />

                  {appointment.date}

                  <span>{appointment.startTime}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Scissors size={16} />

                  {appointment.services
                    .map((service) => service.name)
                    .join(", ")}
                </div>

                <strong>{appointment.estimatedPrice} DA</strong>
              </div>

              <div
                className="
                flex flex-wrap gap-2
                border-t border-(--border)
                pt-4
              "
              >
                <button
                  onClick={() => changeStatus(appointment._id, "confirmed")}
                  className="
                    flex items-center gap-2
                    rounded-xl
                    bg-emerald-100
                    px-4 py-2
                    text-sm
                    text-emerald-700
                  "
                >
                  <Check size={16} />
                  Confirmer
                </button>

                <button
                  onClick={() => changeStatus(appointment._id, "completed")}
                  className="
                    flex items-center gap-2
                    rounded-xl
                    bg-blue-100
                    px-4 py-2
                    text-sm
                    text-blue-700
                  "
                >
                  <CircleCheck size={16} />
                  Terminer
                </button>

                <button
                  onClick={() => handleCancel(appointment._id)}
                  className="
                    flex items-center gap-2
                    rounded-xl
                    bg-red-100
                    px-4 py-2
                    text-sm
                    text-red-700
                  "
                >
                  <X size={16} />
                  Annuler
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
