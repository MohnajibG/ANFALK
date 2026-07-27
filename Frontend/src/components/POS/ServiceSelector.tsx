import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

import type { Service } from "../../types/service";

type Props = {
  services: Service[];
  search: string;
  setSearch: (value: string) => void;
  addService: (service: Service) => void;
};

export default function ServiceSelector({
  services,
  search,
  setSearch,
  addService,
}: Props) {
  return (
    <section
      className="
rounded-3xl
border border-[#D8B98A]/30
bg-white
p-5
"
    >
      <div
        className="
flex
items-center
gap-3
rounded-xl
border
p-3
"
      >
        <Search size={18} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une prestation..."
          className="w-full outline-none"
        />
      </div>

      <div
        className="
mt-5
grid
gap-4
md:grid-cols-2
"
      >
        {services.map((service) => (
          <motion.div
            key={service._id}
            whileHover={{ y: -4 }}
            className="
rounded-2xl
border
border-[#D8B98A]/20
p-5
"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">{service.name}</h3>

                <p className="text-sm text-gray-500">{service.duration} min</p>
              </div>

              <strong>{service.price} DA</strong>
            </div>

            <button
              type="button"
              onClick={() => addService(service)}
              className="
mt-5
flex
w-full
items-center
justify-center
gap-2
rounded-xl
bg-[#3E2C23]
py-3
text-[#FFF4D6]
"
            >
              <Plus size={17} />
              Ajouter
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
