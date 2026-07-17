import { useState } from "react";
import { X } from "lucide-react";

import { updateService } from "../../api/service.api";
import ServiceForm from "./ServiceForm";

import type { Category } from "../../types/category";
import type { Service, UpdateServicePayload } from "../../types/service";

interface Props {
  service: Service;
  categories: Category[];
  onUpdated: (service: Service) => void;
  onClose: () => void;
}

const EditServiceModal = ({
  service,
  categories = [],
  onUpdated,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (data: UpdateServicePayload) => {
    try {
      setLoading(true);
      setError("");

      const updated = await updateService(service._id, data);

      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error("Update service error:", err);
      setError("Unable to update service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold">Edit Service</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6">
          <ServiceForm
            categories={categories}
            initialData={service}
            loading={loading}
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;
