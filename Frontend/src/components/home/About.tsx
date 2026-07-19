import { motion } from "framer-motion";
import { Sparkles, Users, Award } from "lucide-react";

const stats = [
  {
    value: "1500+",
    label: "Clientes satisfaites",
    icon: Users,
  },
  {
    value: "10+",
    label: "Experts beauté",
    icon: Sparkles,
  },
  {
    value: "5★",
    label: "Note moyenne",
    icon: Award,
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="w-full overflow-hidden bg-[#fff4d6] px-6 py-24 sm:px-10 lg:px-20"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 lg:flex-row lg:items-center">
        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full lg:w-1/2"
        >
          <div className="relative rounded-4xl border border-[#d8c39d] bg-white p-3 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80"
              alt="ANFEL K Institute"
              className="h-105 w-full rounded-[26px] object-cover sm:h-130"
            />

            <div className="absolute inset-3 rounded-[26px] bg-linear-to-t from-black/30 to-transparent" />
          </div>

          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-8 left-6 rounded-3xl border border-[#eadfce] bg-white px-8 py-5 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7560]">
              Expérience
            </p>

            <p className="mt-2 font-[Cinzel] text-xl font-bold text-[#0b0b0b]">
              Depuis 2024
            </p>
          </motion.div>
        </motion.div>

        {/* TEXTE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex w-full flex-col lg:w-1/2"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b89b6a]">
            À propos d'ANFEL K
          </p>

          <h2 className="mt-5 font-[Cinzel] text-3xl font-bold leading-tight text-[#0b0b0b] sm:text-5xl">
            Une beauté créée avec précision, élégance et passion
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-black/60">
            ANFEL K Institute est plus qu’un institut de beauté. C’est un espace
            raffiné où expertise, soins personnalisés et techniques modernes se
            rencontrent pour créer une expérience exceptionnelle.
          </p>

          {/* STATS FLEX */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -8 }}
                  className="flex-1 rounded-3xl border border-[#eadfce] bg-white p-5 shadow-sm transition"
                >
                  <Icon
                    size={22}
                    className="text-[#b89b6a]"
                    strokeWidth={1.5}
                  />

                  <h3 className="mt-4 font-[Cinzel] text-3xl font-bold text-[#0b0b0b]">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm text-black/60">{item.label}</p>
                </motion.div>
              );
            })}
          </div>

          <button className="mt-10 w-fit rounded-full bg-[#3e2c23] px-10 py-4 font-semibold text-[#fff4d6] transition hover:bg-[#5a3a1e]">
            Découvrir nos services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
