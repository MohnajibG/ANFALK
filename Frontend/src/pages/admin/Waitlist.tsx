import { useCallback, useEffect, useState } from "react";
import { Plus, X, UserRound, Calendar, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  getWaitlist,
  createWaitlistEntry,
  cancelWaitlistEntry,
} from "../../api/waitlist.api";
import { getServices } from "../../api/service.api";
import { getEmployees } from "../../api/employee.api";

import ClientAutocomplete from "../../components/appointments/ClientAutocomplete";

import type { WaitlistEntry, WaitlistStatus } from "../../types/waitlist";
import type { Client } from "../../types/client";
import type { Service } from "../../types/service";
import type { Employee } from "../../types/employee";

const statusLabels: Record<WaitlistStatus, string> = {
  waiting: "En attente",
  matched: "Placé",
  cancelled: "Annulé",
};

const statusStyle: Record<WaitlistStatus, string> = {
  waiting: "bg-amber-100 text-amber-800",
  matched: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const Waitlist = () => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [client, setClient] = useState<Client | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [desiredDateFrom, setDesiredDateFrom] = useState("");
  const [desiredDateTo, setDesiredDateTo] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const data = await getWaitlist();
      setEntries(data);
    } catch (err) {
      console.error("Erreur chargement liste d'attente:", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    };

    load();
  }, [refresh]);

  const openForm = async () => {
    try {
      const [servicesData, employeesData] = await Promise.all([
        getServices(),
        getEmployees(),
      ]);

      setServices(servicesData);
      setEmployees(employeesData);
      setShowForm(true);
    } catch (err) {
      console.error("Erreur chargement formulaire:", err);
    }
  };

  const resetForm = () => {
    setClient(null);
    setSelectedServiceIds([]);
    setEmployeeId("");
    setDesiredDateFrom("");
    setDesiredDateTo("");
    setNotes("");
    setError("");
  };

  const toggleService = (id: string) => {
    setSelectedServiceIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!client) throw new Error("Veuillez sélectionner une cliente");
      if (!selectedServiceIds.length)
        throw new Error("Veuillez sélectionner au moins une prestation");
      if (!desiredDateFrom)
        throw new Error("Veuillez choisir une date souhaitée");

      await createWaitlistEntry({
        client: client._id,
        services: selectedServiceIds,
        employee: employeeId || undefined,
        desiredDateFrom,
        desiredDateTo: desiredDateTo || undefined,
        notes,
      });

      toast.success("Ajouté à la liste d'attente");
      resetForm();
      setShowForm(false);
      refresh();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erreur lors de l'ajout à la liste d'attente");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Retirer cette entrée de la liste d'attente ?")) return;

    try {
      await cancelWaitlistEntry(id);
      setEntries((current) =>
        current.map((entry) =>
          entry._id === id ? { ...entry, status: "cancelled" } : entry,
        ),
      );
    } catch (err) {
      console.error("Erreur annulation entrée liste d'attente:", err);
      toast.error("Erreur lors du retrait de la liste d'attente");
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-title text-3xl text-(--black)">
            Liste d'attente
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Clientes en attente d'un créneau libre
          </p>
        </div>

        <button
          onClick={openForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream)"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </header>

      {showForm && (
        <div className="rounded-3xl border border-(--border) bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Nouvelle entrée</h2>

            <button onClick={() => setShowForm(false)} type="button">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <ClientAutocomplete value={client} onChange={setClient} />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Prestations souhaitées
              </label>

              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <button
                    key={service._id}
                    type="button"
                    onClick={() => toggleService(service._id)}
                    className={`rounded-xl border px-4 py-2 text-sm ${
                      selectedServiceIds.includes(service._id)
                        ? "border-(--black) bg-(--black) text-(--cream)"
                        : "border-(--border) bg-white"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Employé préféré (optionnel)
              </label>

              <select
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
              >
                <option value="">Peu importe</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Disponible à partir du
                </label>

                <input
                  type="date"
                  value={desiredDateFrom}
                  onChange={(event) => setDesiredDateFrom(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Jusqu'au (optionnel)
                </label>

                <input
                  type="date"
                  value={desiredDateTo}
                  onChange={(event) => setDesiredDateTo(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
                />
              </div>
            </div>

            <textarea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Remarque..."
              className="rounded-2xl border border-(--border) bg-(--cream) p-4"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-(--black) px-6 py-3 text-(--cream)"
              >
                {saving ? "Ajout..." : "Ajouter à la liste"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center">
          Chargement...
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-stone-500">
          Aucune entrée en liste d'attente
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <article
              key={entry._id}
              className="rounded-3xl border border-(--border) bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--cream)">
                    <UserRound size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {typeof entry.client !== "string" &&
                        `${entry.client.firstName} ${entry.client.lastName}`}
                    </h3>

                    <p className="text-sm text-stone-500">
                      {Array.isArray(entry.services) &&
                        entry.services
                          .map((service) =>
                            typeof service === "string" ? service : service.name,
                          )
                          .join(", ")}
                    </p>
                  </div>
                </div>

                <span
                  className={`self-start rounded-full px-4 py-2 text-xs font-semibold ${statusStyle[entry.status]}`}
                >
                  {statusLabels[entry.status]}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-stone-500">
                <Calendar size={16} />
                Du {entry.desiredDateFrom.slice(0, 10)}
                {entry.desiredDateTo &&
                  ` au ${entry.desiredDateTo.slice(0, 10)}`}
              </div>

              {entry.status === "waiting" && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-(--border) pt-4">
                  <button
                    onClick={() => handleCancel(entry._id)}
                    className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-red-700"
                  >
                    <Trash2 size={16} />
                    Retirer
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Waitlist;
