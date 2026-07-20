import { useCallback, useMemo, useState } from "react";
import { AxiosError } from "axios";

import { createAppointment } from "../../api/appointment.api";
import type {
  AppointmentService,
  CreateAppointmentPayload,
} from "../../types/appointment";

import type { Client } from "../../types/client";
import type { Employee } from "../../types/employee";
import type { Service } from "../../types/service";

import ClientAutocomplete from "./ClientAutocomplete";
import AppointmentServicesSelector from "./AppointmentServicesSelector";
import AppointmentSummary from "./AppointmentSummary";

interface AppointmentFormProps {
  services: Service[];
  employees: Employee[];
  onSuccess?: () => void;
}

const AppointmentForm = ({
  services,
  employees,
  onSuccess,
}: AppointmentFormProps) => {
  const [client, setClient] = useState<Client | null>(null);

  const [selectedServices, setSelectedServices] = useState<
    AppointmentService[]
  >([]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");

  const [customPrice, setCustomPrice] = useState<number>();
  const [customDuration, setCustomDuration] = useState<number>();
  const [customEndTime, setCustomEndTime] = useState<string>();

  const [manualPrice, setManualPrice] = useState(false);
  const [manualDuration, setManualDuration] = useState(false);
  const [manualEndTime, setManualEndTime] = useState(false);

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Calcul automatique
   */
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

  const totalDuration = manualDuration
    ? (customDuration ?? 0)
    : automaticValues.duration;

  const estimatedPrice = manualPrice
    ? (customPrice ?? 0)
    : automaticValues.price;

  /**
   * Calcul heure fin
   */
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

  /**
   * Reset
   */
  const resetForm = () => {
    setClient(null);

    setSelectedServices([]);

    setDate("");
    setStartTime("09:00");

    setCustomPrice(undefined);
    setCustomDuration(undefined);
    setCustomEndTime(undefined);

    setManualPrice(false);
    setManualDuration(false);
    setManualEndTime(false);

    setNotes("");

    setError("");
  };

  /**
   * Submit
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!client) {
        throw new Error("Veuillez sélectionner une cliente");
      }

      if (!date) {
        throw new Error("Veuillez sélectionner une date");
      }

      if (!selectedServices.length) {
        throw new Error("Veuillez sélectionner au moins une prestation");
      }

      const missingEmployee = selectedServices.some(
        (service) => !service.employee || typeof service.employee !== "string",
      );

      if (missingEmployee) {
        throw new Error("Veuillez choisir un employé pour chaque prestation");
      }

      const payload: CreateAppointmentPayload = {
        client: client._id,

        services: selectedServices.map((service) => ({
          service: service.service,

          employee: service.employee as string,

          name: service.name,

          price: service.price,

          duration: service.duration,
        })),

        date,

        startTime,

        endTime,

        totalDuration,

        estimatedPrice,

        notes,

        source: "admin",
      };

      await createAppointment(payload);

      resetForm();

      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ??
            "Erreur lors de la création du rendez-vous",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div
          className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-4
          text-sm
          text-red-700
        "
        >
          {error}
        </div>
      )}

      <ClientAutocomplete value={client} onChange={setClient} />

      <div
        className="
        grid
        gap-4
        md:grid-cols-2
      "
      >
        <div>
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
          "
          >
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              h-12
              w-full
              rounded-2xl
              border
              border-(--border)
              bg-(--cream)
              px-4
            "
          />
        </div>

        <div>
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
          "
          >
            Heure début
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="
              h-12
              w-full
              rounded-2xl
              border
              border-(--border)
              bg-(--cream)
              px-4
            "
          />
        </div>
      </div>

      <AppointmentServicesSelector
        services={services}
        employees={employees}
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

      <textarea
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Ajouter une remarque..."
        className="
          rounded-2xl
          border
          border-(--border)
          bg-(--cream)
          p-4
        "
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={resetForm}
          disabled={loading}
          className="
            rounded-2xl
            border
            px-6
            py-3
          "
        >
          Réinitialiser
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-2xl
            bg-(--black)
            px-6
            py-3
            text-(--cream)
          "
        >
          {loading ? "Création..." : "Créer le rendez-vous"}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
