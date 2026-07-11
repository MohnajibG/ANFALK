import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  {
    name: "Home",
    href: "#home",
  },
  {
    name: "About",
    href: "#about",
  },
  {
    name: "Services",
    href: "#services",
  },
  {
    name: "Gallery",
    href: "#gallery",
  },
  {
    name: "Contact",
    href: "#contact",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#e8e2d8] bg-white/92 py-4 backdrop-blur-xl"
          : "bg-white/80 py-5 backdrop-blur-sm"
      }`}
    >
      <div className="ak-container flex items-center justify-center gap-6 lg:justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="select-none flex flex-col items-center gap-0.5"
        >
          <h1 className="ak-logo text-2xl sm:text-3xl">ANFAL K</h1>

          <p className="ak-logo-subtitle mt-1 text-[0.56rem] sm:text-[0.64rem]">
            Institute
          </p>
        </a>

        {/* Desktop */}
        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.16em] text-[#6f6f6f] transition hover:text-[#0b0b0b]"
            >
              {item.name}
            </a>
          ))}

          <a href="/login" className="ak-button group px-6 py-3">
            Sign In
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </a>
        </nav>

        {/* Mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="ak-button ak-button-light px-3 py-3 lg:hidden"
        >
          {open ? (
            <X size={24} color="#302821" />
          ) : (
            <Menu size={24} color="#302821" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.25,
            }}
            className="ak-card mx-4 mt-2 lg:hidden"
          >
            <div className="flex flex-col items-center gap-6 px-8 py-8 text-center">
              {links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-bold uppercase tracking-[0.18em] text-[#0b0b0b]"
                >
                  {item.name}
                </a>
              ))}

              <a
                href="/login"
                className="ak-button mt-2 w-full py-4 text-center"
              >
                Sign In
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
