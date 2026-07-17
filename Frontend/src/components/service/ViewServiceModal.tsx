import { Clock, Euro, Layers, Scissors, Sparkles, X } from "lucide-react";

import type { Service } from "../../types/service";

interface Props {
  service: Service;
  onClose: () => void;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3">
    <div className="text-[#8b7560]">{icon}</div>

    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const ViewServiceModal = ({ service, onClose }: Props) => {
  const categoryName =
    typeof service.category === "object" ? service.category?.name : "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold">Service Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <InfoItem
            icon={<Scissors size={20} />}
            label="Name"
            value={service.name}
          />

          <InfoItem
            icon={<Layers size={20} />}
            label="Category"
            value={categoryName || "-"}
          />

          <InfoItem
            icon={<Euro size={20} />}
            label="Price"
            value={`${service.price} DA`}
          />

          <InfoItem
            icon={<Clock size={20} />}
            label="Duration"
            value={`${service.duration} minutes`}
          />

          <InfoItem
            icon={<Sparkles size={20} />}
            label="Speciality"
            value={service.speciality}
          />

          {service.description && (
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1 text-gray-700">{service.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Status</p>

            <span
              className={`mt-2 inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                service.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {service.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-[#111] py-3 text-white transition hover:bg-[#3E2C23]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewServiceModal;
