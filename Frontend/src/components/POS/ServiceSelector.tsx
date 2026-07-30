import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

import type { Service } from "../../types/service";

type Props = {
  services: Service[];
  search: string;
  setSearch: (value: string) => void;
  addService: (service: Service) => void;
};

const ServiceSelector = ({
  services,
  search,
  setSearch,
  addService,
}: Props) => {
  return (
    <section className="rounded-3xl border border-(--border) bg-white p-5">
      <div className="flex items-center gap-3 rounded-xl border border-(--border) p-3">
        <Search size={18} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une prestation..."
          className="w-full outline-none"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        {services.map((service) => (
          <motion.div
            key={service._id}
            whileHover={{ y: -4 }}
            className="w-full rounded-2xl border border-(--border) p-5 md:w-[calc(50%-8px)]"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">{service.name}</h3>

                <p className="text-sm text-(--muted)">
                  {service.duration} min
                </p>
              </div>

              <strong>{service.price} DA</strong>
            </div>

            <button
              type="button"
              onClick={() => addService(service)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-(--black) py-3 text-(--cream) transition hover:bg-(--brown-dark)"
            >
              <Plus size={17} />
              Ajouter
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSelector;
