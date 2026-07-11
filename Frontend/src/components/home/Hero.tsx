import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white pt-28"
    >
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1800&q=80"
        alt="Luxury beauty salon"
        className="absolute inset-x-0 top-28 h-[42vh] w-full object-cover opacity-90 md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-1/2"
      />

      {/* Overlay */}
      <div className="absolute inset-x-0 top-28 h-[42vh] bg-black/10 md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-1/2" />

      {/* Content */}
      <div className="ak-container relative z-10 grid min-h-[calc(100vh-7rem)] items-center gap-10 py-10 md:grid-cols-2 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-[42vh] max-w-xl text-center md:mt-0 md:mx-0 md:text-left"
        >
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="ak-kicker mb-5"
        >
          Luxury Beauty Institute
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ak-logo text-5xl sm:text-6xl lg:text-7xl"
        >
          ANFAL K
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="ak-logo-subtitle mt-4 text-sm sm:text-base"
        >
          Institute
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="ak-muted mx-auto mt-8 max-w-xl text-base leading-8 md:mx-0"
        >
          A refined beauty destination for hair, makeup, nails, and personalized
          care. Designed with calm, precision, and an elevated salon experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col justify-center gap-3 sm:flex-row md:justify-start"
        >
          <button className="ak-button px-8 py-4">
            Explore Services
            <ArrowRight size={20} />
          </button>

          <button className="ak-button ak-button-light px-8 py-4">
            <Calendar size={18} />
            Book Now
          </button>
        </motion.div>
        </motion.div>

        <div className="hidden md:block" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#e8e2d8]" />
    </section>
  );
}
