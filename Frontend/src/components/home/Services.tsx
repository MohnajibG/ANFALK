import { motion } from "framer-motion";
import { Scissors, Sparkles, Brush } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Hair Studio",
    desc: "Coiffure, brushing, coloration et créations personnalisées pour révéler votre style.",
  },
  {
    icon: Sparkles,
    title: "Nail Bar",
    desc: "Manucure élégante, soins premium et créations raffinées adaptées à votre personnalité.",
  },
  {
    icon: Brush,
    title: "Makeup",
    desc: "Maquillage naturel, soirée et mariage avec des finitions professionnelles.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative w-full overflow-hidden bg-[#fff4d6] px-6 py-24 sm:px-10 lg:px-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b89b6a]"
        >
          Nos prestations
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-5 font-[Cinzel] text-3xl font-bold text-[#0b0b0b] sm:text-5xl"
        >
          Des soins pensés pour révéler votre beauté
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-black/60 sm:text-base"
        >
          Une expérience beauté premium combinant expertise, élégance et
          attention personnalisée.
        </motion.p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group rounded-3xl border border-black/10 bg-white/60 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-md transition"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d8c39d] bg-[#fff4d6] text-[#b89b6a] transition group-hover:bg-[#d8c39d] group-hover:text-black">
                  <Icon size={30} strokeWidth={1.5} />
                </div>

                <h3 className="mt-7 font-[Cinzel] text-2xl font-bold text-[#0b0b0b]">
                  {service.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-black/60">
                  {service.desc}
                </p>

                <button className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-[#b89b6a] transition group-hover:text-black">
                  Découvrir
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
