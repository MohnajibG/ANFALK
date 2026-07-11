import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Trash2,
  User,
  Receipt,
  Banknote,
  Clock,
} from "lucide-react";

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
  employee: Employee;
};

const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah",
    speciality: "Coiffure",
  },

  {
    id: "2",
    name: "Lina",
    speciality: "Manucure",
  },

  {
    id: "3",
    name: "Sonia",
    speciality: "Maquillage",
  },
];

const services: Service[] = [
  {
    id: "1",
    name: "Brushing",
    price: 25,
    speciality: "Coiffure",
  },

  {
    id: "2",
    name: "Hair Cut",
    price: 40,
    speciality: "Coiffure",
  },

  {
    id: "3",
    name: "Full Set",
    price: 70,
    speciality: "Manucure",
  },

  {
    id: "4",
    name: "Refill",
    price: 35,
    speciality: "Manucure",
  },

  {
    id: "5",
    name: "Bridal Makeup",
    price: 120,
    speciality: "Maquillage",
  },
];

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [search, setSearch] = useState("");

  const [client, setClient] = useState("Walk-in Customer");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addService = (service: Service) => {
    const employee = employees.find((e) => e.speciality === service.speciality);

    if (!employee) return;

    setCart((prev) => [
      ...prev,
      {
        service,
        employee,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.service.price, 0);
  }, [cart]);

  const payment = () => {
    alert("Payment completed");

    setCart([]);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="ak-card flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="ak-kicker">Cashier</p>

          <h1 className="font-[Cinzel] text-3xl font-bold">ANFAL K POS</h1>

          <p className="ak-muted">Create a new customer ticket</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#FFF4D6] px-5 py-3">
          <Receipt size={20} />

          <span className="font-semibold">Ticket #1025</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT SIDE */}

        <div className="space-y-5 lg:col-span-2">
          {/* CLIENT */}

          <div className="ak-card p-5">
            <label className="text-sm font-semibold">Customer</label>

            <div className="mt-3 flex items-center gap-3 rounded-xl border p-3">
              <User size={18} />

              <input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* SEARCH */}

          <div className="ak-card p-5">
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <Search size={18} />

              <input
                placeholder="Search service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* SERVICES */}

          <div className="grid gap-4 md:grid-cols-2">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{
                  y: -4,
                }}
                className="ak-card p-5"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{service.name}</h3>

                    <p className="ak-muted text-sm">{service.speciality}</p>
                  </div>

                  <span className="font-bold">{service.price} €</span>
                </div>

                <button
                  onClick={() => addService(service)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3E2C23] py-3 text-[#FFF4D6]"
                >
                  <Plus size={17} />
                  Add Service
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT TICKET */}

        <div className="ak-card flex h-fit flex-col p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Current Ticket</h2>

            <Clock size={20} />
          </div>

          <div className="mt-5 space-y-3">
            {cart.length === 0 && (
              <p className="text-sm text-gray-400">No service selected</p>
            )}

            {cart.map((item, index) => (
              <div key={index} className="rounded-xl border p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{item.service.name}</p>

                    <p className="text-xs text-gray-500">
                      Employee : {item.employee.name}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="mt-2 font-bold">{item.service.price} €</p>
              </div>
            ))}
          </div>

          {/* TOTAL */}

          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between text-lg">
              <span>Total</span>

              <strong>{total} €</strong>
            </div>

            <button
              disabled={!cart.length}
              onClick={payment}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white disabled:opacity-40"
            >
              <Banknote size={20} />
              Cash Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
