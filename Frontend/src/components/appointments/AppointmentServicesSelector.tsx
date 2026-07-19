import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

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

  const isSelected = (id: string) =>
    selectedServices.some((service) => service.service === id);

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
      <div className="rounded-xl border p-4 text-sm opacity-70">
        Aucun soin disponible
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Prestations</label>

      {Object.entries(groupedServices).map(([category, items]) => {
        const opened = openCategories.includes(category);

        return (
          <div key={category} className="overflow-hidden rounded-xl border">
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <span className="font-medium">{category}</span>

              <ChevronDown size={18} className={opened ? "rotate-180" : ""} />
            </button>

            {opened && (
              <div className="space-y-2 p-3">
                {items.map((service) => {
                  const selected = isSelected(service._id);

                  return (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${
                        selected ? "border-black bg-black text-white" : ""
                      }`}
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>

                        <p className="text-sm opacity-70">
                          {service.price} DA
                          {" • "}
                          {service.duration} min
                        </p>
                      </div>

                      {selected && <Check size={18} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentServicesSelector;
