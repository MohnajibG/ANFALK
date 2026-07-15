/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { X, UserPlus, Loader2 } from "lucide-react";

import { createClient } from "../../api/client.api";

interface Props {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void;
}

export default function AddClientModal({
  open,

  onClose,

  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",

    lastName: "",

    phone: "",

    email: "",

    gender: "",

    birthDate: "",

    notes: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await createClient(form);

      onSuccess();

      onClose();

      setForm({
        firstName: "",

        lastName: "",

        phone: "",

        email: "",

        gender: "",

        birthDate: "",

        notes: "",
      });
    } catch (err: any) {
      setError(err.message || "Error creating client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
p-4
"
    >
      <div
        className="
w-full
max-w-lg
rounded-3xl
bg-white
p-6
shadow-2xl
"
      >
        {/* HEADER */}

        <div
          className="
mb-6
flex
items-center
justify-between
"
        >
          <div>
            <h2
              className="
font-serif
text-2xl
font-bold
"
            >
              Add Client
            </h2>

            <p
              className="
text-sm
text-gray-500
"
            >
              Create customer profile
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="
space-y-4
"
        >
          <div
            className="
grid
gap-4
sm:grid-cols-2
"
          >
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
              className="
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-[#3E2C23]/20
"
            />

            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
              className="
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-[#3E2C23]/20
"
            />
          </div>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="
w-full
rounded-xl
border
px-4
py-3
"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="
w-full
rounded-xl
border
px-4
py-3
"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="
w-full
rounded-xl
border
px-4
py-3
"
          >
            <option value="">Gender</option>

            <option value="female">Female</option>

            <option value="male">Male</option>
          </select>

          <input
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            className="
w-full
rounded-xl
border
px-4
py-3
"
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes..."
            rows={3}
            className="
w-full
rounded-xl
border
px-4
py-3
"
          />

          {error && (
            <div
              className="
rounded-xl
bg-red-50
p-3
text-sm
text-red-600
"
            >
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="
flex
w-full
items-center
justify-center
gap-2
rounded-xl
bg-[#3E2C23]
py-3
font-semibold
text-[#FFF4D6]
hover:bg-[#5a3a1e]
disabled:opacity-60
"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Client
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
