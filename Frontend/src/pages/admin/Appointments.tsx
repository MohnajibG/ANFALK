// src/pages/admin/Appointments.tsx

import { useCallback, useEffect, useMemo, useState } from "react";

import { Search, CalendarDays, Check, X, Clock } from "lucide-react";

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
  no_show: "Absent",
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAppointments();

      setAppointments(data);
    } catch (error) {
      console.error("Erreur chargement rendez-vous", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      await loadAppointments();
    };

    fetchAppointments();
  }, [loadAppointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const client =
        `${item.client.firstName} ${item.client.lastName}`.toLowerCase();

      const matchSearch =
        client.includes(search.toLowerCase()) ||
        item.client.phone?.includes(search);

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [appointments, search, statusFilter]);

  const changeStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointment(id, { status });

      loadAppointments();
    } catch (error) {
      console.error("Erreur statut", error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Annuler ce rendez-vous ?")) return;

    try {
      await cancelAppointment(id);

      loadAppointments();
    } catch (error) {
      console.error("Erreur annulation", error);
    }
  };

  return (
    <section className="appointments-page">
      <header className="page-header">
        <div>
          <h1>Rendez-vous</h1>

          <p>Gestion des réservations</p>
        </div>

        <CalendarDays />
      </header>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher client..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as AppointmentStatus | "all")
          }
        >
          <option value="all">Tous</option>

          {Object.entries(statusLabels).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client</th>

                <th>Employé</th>

                <th>Date</th>

                <th>Services</th>

                <th>Prix</th>

                <th>Statut</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    <strong>
                      {appointment.client.firstName}{" "}
                      {appointment.client.lastName}
                    </strong>

                    <br />

                    {appointment.client.phone}
                  </td>

                  <td>
                    {appointment.employee.firstName}{" "}
                    {appointment.employee.lastName}
                  </td>

                  <td>
                    <Clock size={15} />
                    {appointment.date}
                    <br />
                    {appointment.startTime}-{appointment.endTime}
                  </td>

                  <td>
                    {appointment.services
                      .map((service) => service.name)
                      .join(", ")}
                  </td>

                  <td>{appointment.estimatedPrice} DA</td>

                  <td>
                    <span className={`status ${appointment.status}`}>
                      {statusLabels[appointment.status]}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => changeStatus(appointment._id, "confirmed")}
                    >
                      <Check size={16} />
                    </button>

                    <button
                      onClick={() => changeStatus(appointment._id, "completed")}
                    >
                      ✓
                    </button>

                    <button onClick={() => handleCancel(appointment._id)}>
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
