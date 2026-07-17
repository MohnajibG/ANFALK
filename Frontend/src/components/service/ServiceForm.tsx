import { useState } from "react";

import type {
  CreateServicePayload,
  Service,
  ServiceSpeciality,
} from "../../types/service";

import type { Category } from "../../types/category";

interface Props {
  categories: Category[];
  initialData?: Service;
  loading?: boolean;
  onSubmit: (data: CreateServicePayload) => void;
}

const specialities: ServiceSpeciality[] = [
  "Hair",
  "Nails",
  "Makeup",
  "Massage",
  "Reception",
];

const ServiceForm = ({
  categories = [],
  initialData,
  loading = false,
  onSubmit,
}: Props) => {
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateServicePayload>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    duration: initialData?.duration ?? 0,
    category:
      typeof initialData?.category === "object"
        ? initialData.category._id
        : (initialData?.category ?? ""),
    speciality: initialData?.speciality ?? "Hair",
  });

  const updateField = (
    field: keyof CreateServicePayload,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Service name is required");
      return;
    }

    if (form.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (form.duration <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    if (!form.category) {
      setError("Please select a category");
      return;
    }

    if (!form.speciality) {
      setError("Please select a speciality");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <input
        className="input"
        placeholder="Service name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <textarea
        className="input min-h-24"
        placeholder="Description"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Price DA"
        value={form.price}
        onChange={(e) => updateField("price", Number(e.target.value))}
      />

      <input
        className="input"
        type="number"
        placeholder="Duration minutes"
        value={form.duration}
        onChange={(e) => updateField("duration", Number(e.target.value))}
      />

      <select
        className="input"
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
      >
        <option value="">Select category</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        className="input"
        value={form.speciality}
        onChange={(e) =>
          updateField("speciality", e.target.value as ServiceSpeciality)
        }
      >
        {specialities.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#111] py-3 text-white transition hover:bg-[#3E2C23] disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : initialData
            ? "Update Service"
            : "Save Service"}
      </button>
    </form>
  );
};

export default ServiceForm;
