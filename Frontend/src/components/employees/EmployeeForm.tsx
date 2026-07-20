import { useState } from "react";
import { Mail, Phone, User } from "lucide-react";

import type {
  EmployeeForm as EmployeeFormType,
  EmployeeRole,
  Speciality,
} from "../../types/employee";

interface EmployeeFormProps {
  initialValues?: EmployeeFormType;
  loading?: boolean;
  onSubmit: (data: EmployeeFormType) => void;
}

const roles: {
  value: EmployeeRole;
  label: string;
}[] = [
  {
    value: "employee",
    label: "Employé",
  },
  {
    value: "cashier",
    label: "Caissier",
  },
];

const specialities: {
  value: Speciality;
  label: string;
}[] = [
  {
    value: "Hair",
    label: "Coiffure",
  },
  {
    value: "Nails",
    label: "Onglerie",
  },
  {
    value: "Makeup",
    label: "Maquillage",
  },
  {
    value: "Massage",
    label: "Massage",
  },
  {
    value: "Reception",
    label: "Accueil",
  },
];

const defaultValues: EmployeeFormType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "employee",
  speciality: "Hair",
};

export default function EmployeeForm({
  initialValues = defaultValues,
  loading = false,
  onSubmit,
}: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormType>(initialValues);

  const [error, setError] = useState("");

  const updateField = (key: keyof EmployeeFormType, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRoleChange = (role: EmployeeRole) => {
    setForm((prev) => ({
      ...prev,
      role,
      speciality: role === "employee" ? (prev.speciality ?? "Hair") : undefined,
    }));
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return "Le prénom et le nom sont obligatoires";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Email invalide";
    }

    if (form.role === "employee" && !form.speciality) {
      return "La spécialité est obligatoire pour un employé";
    }

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate();

    if (validation) {
      setError(validation);

      return;
    }

    setError("");

    const data: EmployeeFormType = {
      ...form,
      speciality: form.role === "employee" ? form.speciality : undefined,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          icon={<User size={17} />}
          placeholder="Prénom"
          value={form.firstName}
          onChange={(v) => updateField("firstName", v)}
        />

        <Input
          icon={<User size={17} />}
          placeholder="Nom"
          value={form.lastName}
          onChange={(v) => updateField("lastName", v)}
        />
      </div>

      <Input
        icon={<Mail size={17} />}
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(v) => updateField("email", v)}
      />

      <Input
        icon={<Phone size={17} />}
        placeholder="Téléphone"
        value={form.phone}
        onChange={(v) => updateField("phone", v)}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={form.role}
          onChange={(e) => handleRoleChange(e.target.value as EmployeeRole)}
          className="rounded-xl border border-(--border) bg-white p-3 outline-none"
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        {form.role === "employee" && (
          <select
            value={form.speciality ?? ""}
            onChange={(e) => updateField("speciality", e.target.value)}
            className="rounded-xl border border-(--border) bg-white p-3 outline-none"
          >
            {specialities.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        disabled={loading}
        className="mt-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream) disabled:opacity-50"
      >
        {loading ? "Création..." : "Créer l'employé"}
      </button>
    </form>
  );
}

function Input({
  icon,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-(--border) px-3">
      <span className="text-(--brown)">{icon}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent p-3 outline-none"
      />
    </div>
  );
}
