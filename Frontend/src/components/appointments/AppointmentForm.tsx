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
      (acc, service) => ({
        price: acc.price + service.price,
        duration: acc.duration + service.duration,
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

    const totalMinutes = hours * 60 + minutes + duration;

    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0",
    )}`;
  }, []);

  const endTime = useMemo(() => {
    if (manualEndTime) {
      return customEndTime;
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

      if (!client) {
        throw new Error("Veuillez sélectionner une cliente");
      }

      if (!employee) {
        throw new Error("Veuillez sélectionner un employé");
      }

      if (!date) {
        throw new Error("Veuillez choisir une date");
      }

      if (!selectedServices.length) {
        throw new Error("Veuillez sélectionner au moins un soin");
      }

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

      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("[AppointmentForm] API error:", {
          status: err.response?.status,
          message: err.response?.data?.message,
        });

        setError(
          err.response?.data?.message ?? "Erreur serveur lors de la création",
        );
      } else if (err instanceof Error) {
        console.error("[AppointmentForm] Error:", err.message);

        setError(err.message);
      } else {
        console.error("[AppointmentForm] Unknown error", err);

        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (value: number) => {
    setManualPrice(true);
    setCustomPrice(value);
  };

  const handleDurationChange = (value: number) => {
    setManualDuration(true);
    setCustomDuration(value);
  };

  const handleEndTimeChange = (value: string) => {
    setManualEndTime(true);
    setCustomEndTime(value);
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);

    if (manualEndTime) {
      setManualEndTime(false);
      setCustomEndTime(null);
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
    setCustomEndTime("");

    setNotes("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ClientAutocomplete value={client} onChange={setClient} />

        <EmployeeAutocomplete value={employee} onChange={setEmployee} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border px-3 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Heure de début
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="w-full rounded-xl border px-3 py-3"
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
        onDurationChange={handleDurationChange}
        onPriceChange={handlePriceChange}
        onEndTimeChange={handleEndTimeChange}
      />

      <div>
        <label className="mb-2 block text-sm font-medium">Notes</label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Notes rendez-vous..."
          className="w-full rounded-xl border px-3 py-3"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={resetForm}
          disabled={isLoading}
          className="rounded-xl border px-5 py-3"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {isLoading ? "Création..." : "Créer le rendez-vous"}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
