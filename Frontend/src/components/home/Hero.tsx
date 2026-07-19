import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=2000&q=90",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=2000&q=90",
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-svh w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[current]}
          src={images[current]}
          alt="ANFEL K Institute"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay luxe */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />

      <div className="relative z-10 flex w-full items-center px-6 pt-24 sm:px-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-4xl text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#d8c39d] sm:text-sm">
              <Sparkles size={17} />
              Institut de beauté premium
            </p>

            <h1 className="font-[Cinzel] text-6xl font-bold tracking-[0.15em] sm:text-7xl lg:text-9xl">
              ANFEL K
            </h1>

            <p className="mt-4 text-xs uppercase tracking-[0.65em] text-[#d8c39d] sm:text-sm">
              Institute
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 max-w-2xl rounded-3xl border border-white/20 bg-black/20 p-6 backdrop-blur-md sm:p-10"
          >
            <h2 className="font-[Cinzel] text-3xl leading-tight sm:text-5xl">
              Révélez votre beauté naturelle
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Une expérience beauté haut de gamme dédiée à la coiffure, au
              maquillage, aux soins et au bien-être dans un environnement
              élégant et personnalisé.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="flex items-center justify-center gap-3 rounded-xl bg-[#d8c39d] px-8 py-4 font-semibold text-black transition hover:bg-[#ead8b5]">
                Découvrir nos prestations
                <ArrowRight size={18} />
              </button>

              <button className="flex items-center justify-center gap-3 rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10">
                <CalendarDays size={18} />
                Réserver
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3 ">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              current === index ? "w-12 bg-[#d8c39d]" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-white/20" />
    </section>
  );
};

export default Hero;
