import { MapPin, Phone, ArrowUpRight } from "lucide-react";

import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e2d8] bg-[#0b0b0b] text-white">
      <div className="ak-container py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* IDENTITÉ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[Cinzel] text-3xl font-bold tracking-[0.15em] text-[#d8c39d]">
              ANFEL K
            </h2>

            <p className="mt-2 text-xs uppercase tracking-[0.5em] text-white/50">
              Institut de beauté
            </p>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/60">
              Un espace dédié à la beauté, au bien-être et à l'élégance, où
              chaque prestation est pensée pour révéler votre personnalité.
            </p>
          </motion.div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-5 text-sm uppercase tracking-[0.3em] text-[#d8c39d]">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-white/70">
              <p className="flex items-center gap-3">
                <MapPin size={17} />
                Boumerdes, Algerie
              </p>

              <p className="flex items-center gap-3">
                <Phone size={17} />
                +213 24 00 00 00 00
              </p>

              <p className="flex items-center gap-3">
                <FaInstagram className="h-5 w-5" />
                @anfelk_institute
              </p>
            </div>
          </div>

          {/* LIENS */}
          <div>
            <h3 className="mb-5 text-sm uppercase tracking-[0.3em] text-[#d8c39d]">
              Navigation
            </h3>

            <div className="space-y-3 text-sm text-white/70">
              {["À propos", "Prestations", "Galerie", "Contact"].map((item) => (
                <button
                  key={item}
                  className="
                    group flex items-center gap-2
                    transition
                    hover:text-[#d8c39d]
                  "
                >
                  {item}

                  <ArrowUpRight
                    size={14}
                    className="
                      opacity-0
                      transition
                      group-hover:opacity-100
                    "
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-14 border-t border-white/10 pt-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
            © 2026 ANFEL K Institut — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
