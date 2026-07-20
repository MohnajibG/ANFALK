import { useMemo, useState } from "react";
import { Check, ChevronDown, Scissors } from "lucide-react";

import type { Service } from "../../types/service";
import type { Employee } from "../../types/employee";
import type { AppointmentService } from "../../types/appointment";

interface AppointmentServicesSelectorProps {
  services: Service[];
  employees: Employee[];

  selectedServices: AppointmentService[];

  onChange: (services: AppointmentService[]) => void;
}

const AppointmentServicesSelector = ({
  services,
  employees,
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

  const selected = (id: string) => {
    return selectedServices.some((item) => item.service === id);
  };

  const toggleService = (service: Service) => {
    if (selected(service._id)) {
      onChange(selectedServices.filter((item) => item.service !== service._id));

      return;
    }

    onChange([
      ...selectedServices,

      {
        service: service._id,

        employee: "",

        name: service.name,

        price: service.price,

        duration: service.duration,
      },
    ]);
  };

  const updateEmployee = (serviceId: string, employeeId: string) => {
    onChange(
      selectedServices.map((item) =>
        item.service === serviceId
          ? {
              ...item,

              employee: employeeId,
            }
          : item,
      ),
    );
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
    <div
      className="
      flex
      flex-col
      gap-4
      "
    >
      <div
        className="
        flex
        items-center
        gap-2
        "
      >
        <Scissors size={18} className="text-(--champagne)" />

        <label
          className="
          text-sm
          font-semibold
          "
        >
          Choisir les prestations
        </label>
      </div>

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
                hover:bg-(--cream)
                "
            >
              <span className="font-semibold">{category}</span>

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
                  border-t
                  border-(--border)
                  bg-(--cream)
                  p-4
                  "
              >
                {items.map((service) => {
                  const item = selectedServices.find(
                    (s) => s.service === service._id,
                  );

                  const isActive = !!item;

                  return (
                    <div
                      key={service._id}
                      className={`
                      rounded-2xl
                      border
                      p-4
                      ${
                        isActive
                          ? "border-(--black) bg-(--black) text-(--cream)"
                          : "border-(--border) bg-white"
                      }
                      `}
                    >
                      <button
                        type="button"
                        onClick={() => toggleService(service)}
                        className="
                        flex
                        w-full
                        items-center
                        justify-between
                        text-left
                        "
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
                            ${isActive ? "text-(--cream)" : "text-stone-500"}
                            `}
                          >
                            {service.price} DA
                            {" • "}
                            {service.duration} min
                          </p>
                        </div>

                        {isActive && (
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

                      {isActive && (
                        <div
                          className="
                          mt-4
                          "
                        >
                          <label
                            className="
                            text-xs
                            "
                          >
                            Employé responsable
                          </label>

                          <select
                            value={
                              typeof item.employee === "string"
                                ? item.employee
                                : item.employee._id
                            }
                            onChange={(e) =>
                              updateEmployee(service._id, e.target.value)
                            }
                            className="
                            mt-2
                            w-full
                            rounded-xl
                            bg-white
                            p-3
                            text-black
                            "
                          >
                            <option value="">Choisir un employé</option>

                            {employees.map((employee) => (
                              <option key={employee._id} value={employee._id}>
                                {employee.firstName} {employee.lastName}
                                {employee.speciality &&
                                  ` - ${employee.speciality}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
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
