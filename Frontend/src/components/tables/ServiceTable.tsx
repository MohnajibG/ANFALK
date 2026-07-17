import { motion } from "framer-motion";
import { Clock, Euro, Eye, Pencil, Power, Trash2 } from "lucide-react";
import type { Service } from "../../types/service";

interface Props {
  services: Service[];
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggle: (service: Service) => void;
}

interface ActionProps {
  service: Service;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggle: (service: Service) => void;
}

const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

const Actions = ({
  service,
  onView,
  onEdit,
  onDelete,
  onToggle,
}: ActionProps) => (
  <div className="flex gap-2">
    <button
      onClick={() => onView(service)}
      className="rounded-lg bg-[#faf7f1] p-2 transition hover:scale-105"
    >
      <Eye size={16} />
    </button>

    <button
      onClick={() => onEdit(service)}
      className="rounded-lg bg-[#111] p-2 text-white transition hover:scale-105"
    >
      <Pencil size={16} />
    </button>

    <button
      onClick={() => onToggle(service)}
      className="rounded-lg bg-yellow-50 p-2 text-yellow-700 transition hover:scale-105"
    >
      <Power size={16} />
    </button>

    <button
      onClick={() => onDelete(service)}
      className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:scale-105"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

const ServiceTable = ({
  services,
  onView,
  onEdit,
  onDelete,
  onToggle,
}: Props) => (
  <div className="overflow-hidden rounded-3xl border border-[#eadfce] bg-white">
    <div className="hidden md:block">
      <div className="grid grid-cols-7 border-b border-[#eadfce] px-6 py-4 text-sm font-semibold text-gray-600">
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Duration</span>
        <span>Status</span>
        <span>Speciality</span>
        <span>Actions</span>
      </div>

      <div className="divide-y">
        {services.map((service) => (
          <motion.div
            key={service._id}
            whileHover={{ backgroundColor: "#faf7f1" }}
            className="grid grid-cols-7 items-center px-6 py-5 text-sm"
          >
            <div>
              <p className="font-semibold">{service.name}</p>
              {service.description && (
                <p className="text-xs text-gray-400">{service.description}</p>
              )}
            </div>

            <span>{service.category.name}</span>

            <span className="flex items-center gap-1 font-semibold">
              <Euro size={14} />
              {service.price}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={14} />
              {service.duration} min
            </span>

            <StatusBadge active={service.isActive} />

            <span>{service.speciality}</span>

            <Actions
              service={service}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          </motion.div>
        ))}
      </div>
    </div>

    <div className="space-y-4 p-4 md:hidden">
      {services.map((service) => (
        <motion.div
          key={service._id}
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-[#eadfce] p-5"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.category.name}</p>
            </div>

            <StatusBadge active={service.isActive} />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              Price : <b className="ml-2">{service.price} DA</b>
            </p>

            <p>
              Duration : <b className="ml-2">{service.duration} min</b>
            </p>
          </div>

          <div className="mt-5">
            <Actions
              service={service}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ServiceTable;
