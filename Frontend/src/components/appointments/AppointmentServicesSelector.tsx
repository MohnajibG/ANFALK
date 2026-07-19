import { useMemo, useState } from "react";
import { Check, ChevronDown, Scissors } from "lucide-react";

import type { Service } from "../../types/service";
import type { AppointmentService } from "../../types/appointment";

interface AppointmentServicesSelectorProps {
  services: Service[];
  selectedServices: AppointmentService[];
  onChange: (services: AppointmentService[]) => void;
}

const AppointmentServicesSelector = ({
  services,
  selectedServices,
  onChange,
}: AppointmentServicesSelectorProps) => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const groupedServices = useMemo(() => {
    return services.reduce<Record<string, Service[]>>((groups, service) => {
      const category = service.category?.name ?? "Autres";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(service);

      return groups;
    }, {});
  }, [services]);

  const toggleCategory = (category: string) => {
    setOpenCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const isSelected = (id: string) => {
    return selectedServices.some((service) => service.service === id);
  };

  const toggleService = (service: Service) => {
    if (isSelected(service._id)) {
      onChange(selectedServices.filter((item) => item.service !== service._id));

      return;
    }

    onChange([
      ...selectedServices,

      {
        service: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration,
      },
    ]);
  };

  if (!services.length) {
    return (
      <div
        className="
          rounded-2xl
          border border-(--border)
          bg-(--cream)
          p-5
          text-sm
          text-stone-500
        "
      >
        Aucune prestation disponible
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Scissors size={18} className="text-(--champagne)" />

        <label
          className="
          text-sm
          font-semibold
          text-(--black)
        "
        >
          Choisir les prestations
        </label>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(groupedServices).map(([category, items]) => {
          const opened = openCategories.includes(category);

          return (
            <div
              key={category}
              className="
                overflow-hidden
                rounded-3xl
                border border-(--border)
                bg-white
              "
            >
              {/* CATEGORY HEADER */}

              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-5
                  py-4
                  transition
                  hover:bg-(--cream)
                "
              >
                <span
                  className="
                  font-semibold
                  text-(--black)
                "
                >
                  {category}
                </span>

                <ChevronDown
                  size={20}
                  className={`
                    transition-transform
                    ${opened ? "rotate-180" : ""}
                  `}
                />
              </button>

              {opened && (
                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    border-t border-(--border)
                    p-4
                    bg-(--cream)
                  "
                >
                  {items.map((service) => {
                    const selected = isSelected(service._id);

                    return (
                      <button
                        key={service._id}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`
                          flex
                          items-center
                          justify-between
                          rounded-2xl
                          border
                          p-4
                          text-left
                          transition
                          ${
                            selected
                              ? `
                              border-(--black)
                              bg-(--black)
                              text-(--cream)
                            `
                              : `
                              border-(--border)
                              bg-white
                              hover:border-(--champagne)
                            `
                          }
                        `}
                      >
                        <div>
                          <p
                            className="
                            font-semibold
                          "
                          >
                            {service.name}
                          </p>

                          <p
                            className={`
                              mt-1
                              text-sm
                              ${selected ? "text-(--cream)" : "text-stone-500"}
                            `}
                          >
                            {service.price} DA
                            {" • "}
                            {service.duration} minutes
                          </p>
                        </div>

                        {selected && (
                          <div
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-full
                              bg-(--cream)
                              text-(--black)
                            "
                          >
                            <Check size={17} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentServicesSelector;
