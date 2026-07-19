import { useCallback, useMemo, useState } from "react";
import { AxiosError } from "axios";

import { createAppointment } from "../../api/appointment.api";

import type {
  CreateAppointmentPayload,
  AppointmentService,
} from "../../types/appointment";

import type { Client } from "../../types/client";
import type { Employee } from "../../types/employee";
import type { Service } from "../../types/service";

import ClientAutocomplete from "./ClientAutocomplete";
import EmployeeAutocomplete from "./EmployeeAutocomplete";
import AppointmentServicesSelector from "./AppointmentServicesSelector";
import AppointmentSummary from "./AppointmentSummary";

interface AppointmentFormProps {
  services: Service[];
  onSuccess?: () => void;
}

const AppointmentForm = ({ services, onSuccess }: AppointmentFormProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [selectedServices, setSelectedServices] = useState<
    AppointmentService[]
  >([]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");

  const [manualPrice, setManualPrice] = useState(false);
  const [manualDuration, setManualDuration] = useState(false);
  const [manualEndTime, setManualEndTime] = useState(false);

  const [customPrice, setCustomPrice] = useState<number | null>(null);

  const [customDuration, setCustomDuration] = useState<number | null>(null);

  const [customEndTime, setCustomEndTime] = useState<string | null>(null);

  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const automaticValues = useMemo(() => {
    return selectedServices.reduce(
      (total, service) => ({
        price: total.price + service.price,
        duration: total.duration + service.duration,
      }),
      {
        price: 0,
        duration: 0,
      },
    );
  }, [selectedServices]);

  const totalDuration =
    manualDuration && customDuration !== null
      ? customDuration
      : automaticValues.duration;

  const estimatedPrice =
    manualPrice && customPrice !== null ? customPrice : automaticValues.price;

  const calculateEndTime = useCallback((time: string, duration: number) => {
    const [hours, minutes] = time.split(":").map(Number);

    const total = hours * 60 + minutes + duration;

    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
      total % 60,
    ).padStart(2, "0")}`;
  }, []);

  const endTime = useMemo(() => {
    if (manualEndTime) {
      return customEndTime ?? "";
    }

    if (!startTime || !totalDuration) {
      return "";
    }

    return calculateEndTime(startTime, totalDuration);
  }, [
    manualEndTime,
    customEndTime,
    startTime,
    totalDuration,
    calculateEndTime,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      if (!client) throw new Error("Veuillez sélectionner une cliente");

      if (!employee) throw new Error("Veuillez sélectionner un employé");

      if (!date) throw new Error("Veuillez choisir une date");

      if (!selectedServices.length)
        throw new Error("Veuillez sélectionner au moins une prestation");

      const payload: CreateAppointmentPayload = {
        client: client._id,

        employee: employee._id,

        services: selectedServices.map(({ service }) => service),

        date,

        startTime,

        notes,

        source: "admin",
      };

      await createAppointment(payload);

      resetForm();

      onSuccess?.();
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data?.message ??
            "Erreur lors de la création du rendez-vous",
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setClient(null);
    setEmployee(null);

    setSelectedServices([]);

    setDate("");
    setStartTime("09:00");

    setManualPrice(false);
    setManualDuration(false);
    setManualEndTime(false);

    setCustomPrice(null);
    setCustomDuration(null);
    setCustomEndTime(null);

    setNotes("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div
          className="
          rounded-2xl
          border border-red-200
          bg-red-50
          p-4
          text-sm
          text-red-700
        "
        >
          {error}
        </div>
      )}

      <div
        className="
        flex flex-col gap-4
        md:flex-row
      "
      >
        <div className="flex-1">
          <ClientAutocomplete value={client} onChange={setClient} />
        </div>

        <div className="flex-1">
          <EmployeeAutocomplete value={employee} onChange={setEmployee} />
        </div>
      </div>

      <div
        className="
        flex flex-col gap-4
        md:flex-row
      "
      >
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Date du rendez-vous
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              h-12 w-full
              rounded-2xl
              border border-(--border)
              bg-(--cream)
              px-4
              outline-none
            "
          />
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Heure de début
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="
              h-12 w-full
              rounded-2xl
              border border-(--border)
              bg-(--cream)
              px-4
              outline-none
            "
          />
        </div>
      </div>

      <AppointmentServicesSelector
        services={services}
        selectedServices={selectedServices}
        onChange={setSelectedServices}
      />

      <AppointmentSummary
        services={selectedServices}
        startTime={startTime}
        totalDuration={totalDuration}
        estimatedPrice={estimatedPrice}
        endTime={endTime}
        onDurationChange={(value) => {
          setManualDuration(true);
          setCustomDuration(value);
        }}
        onPriceChange={(value) => {
          setManualPrice(true);
          setCustomPrice(value);
        }}
        onEndTimeChange={(value) => {
          setManualEndTime(true);
          setCustomEndTime(value);
        }}
      />

      <div>
        <label className="mb-2 block text-sm font-medium">
          Notes complémentaires
        </label>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ajouter une remarque..."
          className="
            w-full
            rounded-2xl
            border border-(--border)
            bg-(--cream)
            p-4
            outline-none
          "
        />
      </div>

      <div
        className="
        flex flex-col gap-3
        sm:flex-row
      "
      >
        <button
          type="button"
          onClick={resetForm}
          disabled={isLoading}
          className="
            rounded-2xl
            border border-(--border)
            px-6 py-3
            transition
            hover:bg-(--cream)
          "
        >
          Réinitialiser
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="
            rounded-2xl
            bg-(--black)
            px-6 py-3
            text-(--cream)
            transition
            hover:opacity-90
            disabled:opacity-50
          "
        >
          {isLoading ? "Création en cours..." : "Créer le rendez-vous"}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
