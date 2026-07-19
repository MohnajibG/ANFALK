import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  {
    name: "Accueil",
    href: "#home",
  },
  {
    name: "À propos",
    href: "#about",
  },
  {
    name: "Prestations",
    href: "#services",
  },
  {
    name: "Galerie",
    href: "#gallery",
  },
  {
    name: "Contact",
    href: "#contact",
  },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`
        fixed
        left-0
        top-0
        z-50
        w-full
        transition-all
        duration-500
        ${
          scrolled
            ? "border-b border-[#e8e2d8] bg-white/90 py-4 backdrop-blur-xl shadow-sm"
            : "bg-white/70 py-5 backdrop-blur-md"
        }
      `}
    >
      <div className="ak-container flex items-center justify-between">
        {/* LOGO */}

        <a
          href="#home"
          className="
            flex
            flex-col
            items-center
            select-none
          "
        >
          <h1
            className="
              ak-logo
              text-2xl
              sm:text-3xl
            "
          >
            ANFEL K
          </h1>

          <p
            className="
              ak-logo-subtitle
              mt-1
              text-[0.55rem]
              sm:text-[0.65rem]
            "
          >
            Institut de beauté
          </p>
        </a>

        {/* NAVIGATION DESKTOP */}

        <nav
          className="
            hidden
            items-center
            gap-9
            lg:flex
          "
        >
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="
                relative
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#6f6f6f]
                transition
                hover:text-[#0b0b0b]

                after:absolute
                after:-bottom-2
                after:left-0
                after:h-px
                after:w-0
                after:bg-[#d8c39d]
                after:transition-all

                hover:after:w-full
              "
            >
              {item.name}
            </a>
          ))}

          <a
            href="/login"
            className="
              ak-button
              group
              flex
              items-center
              gap-2
              px-6
              py-3
            "
          >
            Connexion
            <ArrowRight
              size={17}
              className="
                transition
                group-hover:translate-x-1
              "
            />
          </a>
        </nav>

        {/* MOBILE BUTTON */}

        <button
          onClick={() => setOpen(!open)}
          className="
            flex
            items-center
            justify-center
            rounded-xl
            border
            border-[#e8e2d8]
            bg-white
            p-3
            lg:hidden
          "
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* MENU MOBILE */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="
              mx-4
              mt-3
              overflow-hidden
              rounded-3xl
              border
              border-[#e8e2d8]
              bg-white
              shadow-xl
              lg:hidden
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                gap-6
                px-8
                py-10
              "
            >
              {links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#171717]
                  "
                >
                  {item.name}
                </a>
              ))}

              <a
                href="/login"
                className="
                  ak-button
                  mt-2
                  w-full
                  py-4
                  text-center
                "
              >
                Connexion
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
