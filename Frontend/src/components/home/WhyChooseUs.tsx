import { motion } from "framer-motion";
import { Award, HeartHandshake, Sparkles, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Expertise professionnelle",
    text: "Une équipe passionnée et expérimentée dédiée à sublimer votre beauté avec précision.",
  },
  {
    icon: Sparkles,
    title: "Produits premium",
    text: "Nous sélectionnons des produits de qualité pour garantir des résultats élégants et durables.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiène & sécurité",
    text: "Un environnement propre et rigoureux pour une expérience beauté en toute confiance.",
  },
  {
    icon: HeartHandshake,
    title: "Service personnalisé",
    text: "Chaque prestation est adaptée à vos envies, votre style et vos besoins.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fff4d6] px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b89b6a]">
              Pourquoi nous choisir
            </p>

            <h2 className="mt-5 font-[Cinzel] text-3xl font-bold leading-tight text-[#0b0b0b] sm:text-5xl">
              Une expérience beauté pensée dans les moindres détails
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-black/60 sm:text-base">
              Chez ANFEL K Institute, chaque détail compte. Notre objectif est
              de créer une expérience unique, élégante et personnalisée pour
              chaque cliente.
            </p>

            <div className="mt-8 h-px w-24 bg-[#d8c39d]" />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="rounded-3xl border border-black/10 bg-white/70 p-7 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d8c39d] bg-[#fff4d6] text-[#b89b6a]">
                    <Icon size={26} strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-6 font-[Cinzel] text-xl font-bold text-[#0b0b0b]">
                    {reason.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {reason.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
