import { motion } from "framer-motion";
import { Scissors, Clock, Star } from "lucide-react";

type Service = {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  completed: number;
  rating: number;
};

const linaServices: Service[] = [
  {
    id: "1",
    name: "Hair Coloring",
    category: "Hair",
    duration: 120,
    price: 75,
    completed: 156,
    rating: 4.9,
  },

  {
    id: "2",
    name: "Balayage",
    category: "Hair",
    duration: 180,
    price: 120,
    completed: 98,
    rating: 5,
  },

  {
    id: "3",
    name: "Hair Cut",
    category: "Hair",
    duration: 45,
    price: 40,
    completed: 240,
    rating: 4.8,
  },

  {
    id: "4",
    name: "Hair Treatment",
    category: "Care",
    duration: 90,
    price: 60,
    completed: 84,
    rating: 4.9,
  },
];

export default function MyServices() {
  return (
    <div className="space-y-8">
      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-[#3E2C23] p-8 text-[#FFF4D6]"
      >
        <h1 className="font-[Cinzel] text-4xl">My Services</h1>

        <p className="mt-2 text-white/80">
          Your professional services and performance.
        </p>
      </motion.div>

      {/* STATS */}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Total Services</p>

          <h2 className="mt-2 text-3xl font-bold text-[#3E2C23]">4</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Completed This Month</p>

          <h2 className="mt-2 text-3xl font-bold text-[#3E2C23]">98</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Average Rating</p>

          <h2 className="mt-2 text-3xl font-bold text-[#3E2C23]">4.9 ⭐</h2>
        </div>
      </div>

      {/* SERVICES */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {linaServices.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FFF4D6] p-3">
                  <Scissors size={22} className="text-[#3E2C23]" />
                </div>

                <h3 className="font-semibold text-[#3E2C23]">{service.name}</h3>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                Active
              </span>
            </div>

            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <p>
                Category :
                <span className="ml-2 font-semibold text-[#3E2C23]">
                  {service.category}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <Clock size={16} />
                {service.duration} minutes
              </p>

              <p>
                Price :
                <span className="ml-2 font-bold text-[#3E2C23]">
                  €{service.price}
                </span>
              </p>
            </div>

            <div className="mt-6 border-t pt-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">Completed</p>

                  <h4 className="text-xl font-bold text-[#3E2C23]">
                    {service.completed}
                  </h4>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Rating</p>

                  <h4 className="flex items-center gap-1 text-xl font-bold text-[#3E2C23]">
                    <Star size={18} className="fill-[#3E2C23]" />

                    {service.rating}
                  </h4>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
