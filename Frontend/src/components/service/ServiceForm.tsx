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

export default function ServiceForm({
  categories = [],
  initialData,
  loading = false,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateServicePayload>(() => {
    if (initialData) {
      return {
        name: initialData.name,

        description: initialData.description ?? "",

        price: initialData.price,

        duration: initialData.duration,

        category:
          typeof initialData.category === "object"
            ? initialData.category._id
            : initialData.category,

        speciality: initialData.speciality,
      };
    }

    return {
      name: "",

      description: "",

      price: 0,

      duration: 0,

      category: "",

      speciality: "Hair",
    };
  });

  const updateField = (
    field: keyof CreateServicePayload,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    if (form.price <= 0) return;

    if (form.duration <= 0) return;

    if (!form.category) return;

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

        {(categories ?? []).map((cat) => (
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
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-[#111]
          py-3
          text-white
          hover:bg-[#3E2C23]
          disabled:opacity-50
        "
      >
        {loading ? "Saving..." : "Save Service"}
      </button>
    </form>
  );
}
