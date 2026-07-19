import { motion } from "framer-motion";
import { Camera, MapPin, Phone, ArrowRight } from "lucide-react";

const details = [
  {
    icon: MapPin,
    title: "Adresse",
    text: "Boumerdes, Algerie",
  },
  {
    icon: Phone,
    title: "Téléphone",
    text: "+213 24 00 00 00 00",
  },
  {
    icon: Camera,
    title: "Instagram",
    text: "@anfelk_institute",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-[#fff4d6] px-6 py-24 sm:px-10 lg:px-20"
    >
      <div className="mx-auto flex max-w-7xl flex-col">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center overflow-hidden rounded-[40px] border border-[#d8c39d] bg-white/70 px-6 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:px-12"
        >
          {/* DECORATION */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d8c39d]/30 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b89b6a]">
              Contact
            </p>

            <h2 className="mt-5 font-[Cinzel] text-3xl font-bold text-[#0b0b0b] sm:text-5xl">
              Visitez ANFEL K Institute
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-black/60 sm:text-base">
              Découvrez une expérience beauté raffinée dans un environnement
              élégant pensé pour votre confort et votre confiance.
            </p>

            {/* INFORMATIONS FLEX */}
            <div className="mt-12 flex w-full flex-col gap-5 sm:flex-row">
              {details.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ y: -8 }}
                    className="flex-1 rounded-3xl border border-[#eadfce] bg-white p-6 text-left shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4d6] text-[#b89b6a]">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7560]">
                      {item.title}
                    </p>

                    <p className="mt-3 font-semibold text-[#171717]">
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="group mt-12 flex items-center gap-3 rounded-full bg-[#3e2c23] px-10 py-4 font-semibold text-[#fff4d6] transition hover:bg-[#5a3a1e]"
            >
              Réserver une prestation
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
