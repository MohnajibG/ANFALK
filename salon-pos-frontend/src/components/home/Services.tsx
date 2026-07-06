import { motion } from "framer-motion";
import { Scissors, Sparkles, Brush } from "lucide-react";

const services = [
  {
    icon: <Scissors size={32} />,
    title: "Hair Studio",
    desc: "Cuts, brushing, color, and polished styling for every occasion.",
  },
  {
    icon: <Sparkles size={32} />,
    title: "Nail Bar",
    desc: "Clean manicures, premium sets, refills, and elegant nail art.",
  },
  {
    icon: <Brush size={32} />,
    title: "Makeup",
    desc: "Soft glam, evening looks, bridal makeup, and event beauty.",
  },
];

export default function Services() {
  return (
    <section id="services" className="ak-section ak-section-soft">
      <div className="ak-container text-center">
        <p className="ak-kicker">Our Services</p>

        <h2 className="ak-heading mt-4">
          Beauty rituals made clean, calm, and precise
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="ak-arch-card flex min-h-[18rem] flex-col items-center justify-center px-7 py-10 text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#e8e2d8] bg-white text-[#0b0b0b]">
                {s.icon}
              </div>

              <h3 className="font-[Cinzel] text-xl font-bold text-[#0b0b0b]">
                {s.title}
              </h3>

              <p className="ak-muted mt-3">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
