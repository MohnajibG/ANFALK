import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Scissors } from "lucide-react";

type Speciality = "Coiffure" | "Manucure" | "Maquillage";

type Service = {
  id: string;
  name: string;
  price: number;
  speciality: Speciality;
  duration: number;
  active: boolean;
};

const initialServices: Service[] = [
  {
    id: "1",
    name: "Brushing",
    price: 25,
    speciality: "Coiffure",
    duration: 30,
    active: true,
  },
  {
    id: "2",
    name: "Coupe",
    price: 40,
    speciality: "Coiffure",
    duration: 45,
    active: true,
  },
  {
    id: "3",
    name: "Pose complète",
    price: 50,
    speciality: "Manucure",
    duration: 60,
    active: true,
  },
  {
    id: "4",
    name: "Maquillage mariée",
    price: 80,
    speciality: "Maquillage",
    duration: 90,
    active: false,
  },
];

export default function Services() {
  const [services] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Cinzel] text-3xl text-[#3E2C23]">Prestations</h1>
          <p className="text-gray-500">Gestion des services du salon</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#3E2C23] px-4 py-2 text-[#FFF4D6]"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une prestation..."
          className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 outline-none focus:border-[#3E2C23]"
        />
      </div>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-white p-6 shadow"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors size={18} className="text-[#3E2C23]" />
                <h3 className="font-semibold text-[#3E2C23]">{service.name}</h3>
              </div>

              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  service.active
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {service.active ? "Actif" : "Inactif"}
              </span>
            </div>

            {/* INFO */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>
                Spécialité :{" "}
                <span className="font-medium text-[#3E2C23]">
                  {service.speciality}
                </span>
              </p>

              <p>
                Durée :{" "}
                <span className="font-medium text-[#3E2C23]">
                  {service.duration} min
                </span>
              </p>
            </div>

            {/* PRICE */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xl font-bold text-[#3E2C23]">
                {service.price} €
              </span>

              <button className="rounded-xl bg-[#3E2C23] px-3 py-1 text-sm text-[#FFF4D6]">
                Modifier
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-[#3E2C23]">
              Ajouter une prestation
            </h2>

            <div className="mt-4 space-y-3">
              <input
                placeholder="Nom"
                className="w-full rounded-xl border p-3"
              />

              <input
                placeholder="Prix"
                type="number"
                className="w-full rounded-xl border p-3"
              />

              <input
                placeholder="Durée (min)"
                type="number"
                className="w-full rounded-xl border p-3"
              />

              <select className="w-full rounded-xl border p-3">
                <option>Coiffure</option>
                <option>Manucure</option>
                <option>Maquillage</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2"
              >
                Annuler
              </button>

              <button className="rounded-xl bg-[#3E2C23] px-4 py-2 text-[#FFF4D6]">
                Enregistrer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
