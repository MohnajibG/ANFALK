import { useMemo } from "react";
import { Clock, Euro, Scissors } from "lucide-react";

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
      (total, service) => ({
        price: total.price + service.price,
        duration: total.duration + service.duration,
      }),
      {
        price: 0,
        duration: 0,
      },
    );
  }, [services]);

  return (
    <div
      className="
        flex
        flex-col
        gap-5
        rounded-3xl
        border border-(--border)
        bg-white
        p-5
        sm:p-6
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Scissors size={18} className="text-(--champagne)" />

            <h3
              className="
                font-semibold
                text-(--black)
              "
            >
              Résumé du rendez-vous
            </h3>
          </div>

          <p
            className="
              mt-2
              text-sm
              text-stone-500
            "
          >
            Heure de début : {startTime}
          </p>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-2xl
            bg-(--cream)
          "
        >
          <Clock size={18} />
        </div>
      </div>

      {/* SERVICES */}

      <div className="flex flex-col gap-3">
        {services.length === 0 && (
          <div
            className="
              rounded-2xl
              border border-(--border)
              bg-(--cream)
              p-4
              text-sm
              text-stone-500
            "
          >
            Aucune prestation sélectionnée
          </div>
        )}

        {services.map((service) => (
          <div
            key={service.service}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border border-(--border)
              bg-(--cream)
              px-4
              py-3
            "
          >
            <span
              className="
                font-medium
                text-(--black)
              "
            >
              {service.name}
            </span>

            <span
              className="
                font-semibold
                text-(--black)
              "
            >
              {service.price} DA
            </span>
          </div>
        ))}
      </div>

      {/* INFORMATIONS */}

      <div
        className="
          flex
          flex-col
          gap-4
        "
      >
        {/* PRIX */}

        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
          <label
            className="
              text-sm
              font-medium
              text-(--black)
            "
          >
            Prix estimé
          </label>

          <div className="relative">
            <Euro
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-(--champagne)
              "
            />

            <input
              type="number"
              value={estimatedPrice}
              onChange={(event) => onPriceChange(Number(event.target.value))}
              className="
                h-12
                w-full
                rounded-2xl
                border border-(--border)
                bg-white
                pl-10
                outline-none
                focus:border-(--black)
              "
            />
          </div>

          <p
            className="
              text-xs
              text-stone-500
            "
          >
            Calcul automatique : {calculatedValues.price} DA
          </p>
        </div>

        {/* DUREE */}

        <div className="flex flex-col gap-2">
          <label
            className="
              text-sm
              font-medium
            "
          >
            Durée totale
          </label>

          <input
            type="number"
            value={totalDuration}
            onChange={(event) => onDurationChange(Number(event.target.value))}
            className="
              h-12
              rounded-2xl
              border border-(--border)
              px-4
              outline-none
              focus:border-(--black)
            "
          />

          <p
            className="
              text-xs
              text-stone-500
            "
          >
            Calcul automatique : {calculatedValues.duration} minutes
          </p>
        </div>

        {/* FIN */}

        <div className="flex flex-col gap-2">
          <label
            className="
              text-sm
              font-medium
            "
          >
            Heure de fin
          </label>

          <input
            type="time"
            value={endTime}
            onChange={(event) => onEndTimeChange(event.target.value)}
            className="
              h-12
              rounded-2xl
              border border-(--border)
              px-4
              outline-none
              focus:border-(--black)
            "
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummary;
