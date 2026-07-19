import { useMemo } from "react";

import type { AppointmentService } from "../../types/appointment";

interface AppointmentSummaryProps {
  services: AppointmentService[];

  startTime: string;

  totalDuration: number;

  estimatedPrice: number;

  endTime: string;

  onDurationChange: (value: number) => void;

  onPriceChange: (value: number) => void;

  onEndTimeChange: (value: string) => void;
}

const AppointmentSummary = ({
  services,
  startTime,
  totalDuration,
  estimatedPrice,
  endTime,
  onDurationChange,
  onPriceChange,
  onEndTimeChange,
}: AppointmentSummaryProps) => {
  const calculatedValues = useMemo(() => {
    return services.reduce(
      (accumulator, service) => ({
        price: accumulator.price + service.price,

        duration: accumulator.duration + service.duration,
      }),
      {
        price: 0,

        duration: 0,
      },
    );
  }, [services]);

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <div>
        <h3 className="font-semibold">Résumé</h3>

        <p className="text-sm opacity-70">Début : {startTime}</p>
      </div>

      <div className="space-y-2">
        {services.length === 0 && (
          <p className="text-sm opacity-70">Aucun service sélectionné.</p>
        )}

        {services.map((service) => (
          <div key={service.service} className="flex justify-between text-sm">
            <span>{service.name}</span>

            <span>{service.price} DA</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        <div>
          <label className="text-sm">Prix estimé</label>

          <input
            type="number"
            value={estimatedPrice}
            onChange={(event) => onPriceChange(Number(event.target.value))}
            className="w-full rounded-xl border px-3 py-2"
          />

          <p className="text-xs opacity-60">
            Automatique : {calculatedValues.price} DA
          </p>
        </div>

        <div>
          <label className="text-sm">Durée totale (minutes)</label>

          <input
            type="number"
            value={totalDuration}
            onChange={(event) => onDurationChange(Number(event.target.value))}
            className="w-full rounded-xl border px-3 py-2"
          />

          <p className="text-xs opacity-60">
            Automatique : {calculatedValues.duration} min
          </p>
        </div>

        <div>
          <label className="text-sm">Heure de fin</label>

          <input
            type="time"
            value={endTime}
            onChange={(event) => onEndTimeChange(event.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummary;
