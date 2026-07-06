import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash } from "lucide-react";

type Speciality = "Coiffure" | "Manucure" | "Maquillage";

type Employee = {
  id: string;
  name: string;
  speciality: Speciality;
};

type Service = {
  id: string;
  name: string;
  price: number;
  speciality: Speciality;
};

type CartItem = {
  service: Service;
  employee?: Employee;
};

const employees: Employee[] = [
  { id: "1", name: "Sarah", speciality: "Coiffure" },
  { id: "2", name: "Lina", speciality: "Manucure" },
  { id: "3", name: "Sonia", speciality: "Maquillage" },
];

const services: Service[] = [
  { id: "1", name: "Brushing", price: 25, speciality: "Coiffure" },
  { id: "2", name: "Coupe", price: 40, speciality: "Coiffure" },
  { id: "3", name: "Pose complète", price: 50, speciality: "Manucure" },
  { id: "4", name: "Remplissage", price: 35, speciality: "Manucure" },
  { id: "5", name: "Maquillage mariée", price: 80, speciality: "Maquillage" },
];

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient] = useState("Client Test");

  // ➕ add service
  const addService = (service: Service) => {
    const availableEmployees = employees.filter(
      (e) => e.speciality === service.speciality,
    );

    setCart((prev) => [
      ...prev,
      {
        service,
        employee: availableEmployees[0],
      },
    ]);
  };

  // ❌ remove item
  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // 💰 total
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.service.price, 0),
    [cart],
  );

  // 💳 pay
  const handlePay = () => {
    alert("Paiement validé (mock)");
    setCart([]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* LEFT - SERVICES */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="font-[Cinzel] text-3xl text-[#3E2C23]">Caisse POS</h1>

        <p className="text-gray-500">
          Client : <span className="font-semibold">{selectedClient}</span>
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl bg-white p-4 shadow"
            >
              <h3 className="font-semibold text-[#3E2C23]">{s.name}</h3>

              <p className="text-sm text-gray-500">{s.speciality}</p>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-[#3E2C23]">{s.price} €</span>

                <button
                  onClick={() => addService(s)}
                  className="flex items-center gap-1 rounded-xl bg-[#3E2C23] px-3 py-1 text-sm text-[#FFF4D6]"
                >
                  <Plus size={14} />
                  Ajouter
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT - CART */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-[#3E2C23]">Panier</h2>

        <div className="mt-4 space-y-3">
          {cart.length === 0 && (
            <p className="text-sm text-gray-400">Aucun service ajouté</p>
          )}

          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <div>
                <p className="font-medium text-[#3E2C23]">
                  {item.service.name}
                </p>
                <p className="text-xs text-gray-500">{item.employee?.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.service.price}€</span>

                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between">
            <span>Total</span>
            <span className="text-xl font-bold text-[#3E2C23]">{total} €</span>
          </div>

          <button
            onClick={handlePay}
            disabled={cart.length === 0}
            className="mt-4 w-full rounded-xl bg-green-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            Encaisser (Espèces)
          </button>
        </div>
      </div>
    </div>
  );
}
