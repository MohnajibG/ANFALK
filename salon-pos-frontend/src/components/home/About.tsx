import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="ak-section ak-section-soft">
      <div className="ak-container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="ak-card relative p-2"
        >
          <img
            src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80"
            alt="About ANFAL K"
            className="h-[28rem] w-full rounded-[20px] object-cover"
          />

          <div className="absolute inset-2 rounded-[20px] bg-black/10" />
        </motion.div>

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="ak-kicker mb-4">About Us</p>

          <h2 className="font-[Cinzel] text-4xl font-bold leading-tight text-[#0b0b0b] md:text-5xl">
            A polished approach to everyday beauty
          </h2>

          <p className="ak-muted mt-6 text-lg leading-8">
            ANFAL K Institute brings together technique, care, and a serene
            studio experience for clients who want beauty services that feel
            refined from start to finish.
          </p>

          {/* STATS */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="ak-card px-4 py-5 text-center">
              <h3 className="text-3xl font-bold text-[#0b0b0b]">1500+</h3>
              <p className="ak-muted text-sm">Happy clients</p>
            </div>

            <div className="ak-card px-4 py-5 text-center">
              <h3 className="text-3xl font-bold text-[#0b0b0b]">10+</h3>
              <p className="ak-muted text-sm">Beauty experts</p>
            </div>

            <div className="ak-card px-4 py-5 text-center">
              <h3 className="text-3xl font-bold text-[#0b0b0b]">5★</h3>
              <p className="ak-muted text-sm">Client rating</p>
            </div>
          </div>

          {/* BUTTON */}
          <button className="ak-button mt-10 px-8 py-4">
            Discover Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
