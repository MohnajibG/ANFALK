/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { X } from "lucide-react";
import { createService } from "../../api/service.api";
import ServiceForm from "./ServiceForm";

import type { Service } from "../../types/service";

interface Category {
  _id: string;
  name: string;
}

interface Props {
  categories: Category[];
  onCreated: (service: Service) => void;
  onClose: () => void;
}

export default function AddServiceModal({
  categories,
  onCreated,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (data: any) => {
    try {
      setLoading(true);
      setError("");

      const service = await createService(data);

      onCreated(service);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Unable to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold">Add Service</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
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
            loading={loading}
            onSubmit={handleCreate}
          />
        </div>
      </div>
    </div>
  );
}
