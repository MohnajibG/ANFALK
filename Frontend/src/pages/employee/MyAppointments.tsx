import { motion } from "framer-motion";
import { CalendarDays, Clock, User, Scissors } from "lucide-react";

const appointments = [
  {
    time: "09:30",
    client: "Emma D.",
    service: "Coloration",
    duration: "1h30",
    status: "Confirmé",
  },
  {
    time: "11:30",
    client: "Sarah M.",
    service: "Brushing",
    duration: "45 min",
    status: "Confirmé",
  },
  {
    time: "14:00",
    client: "Lina K.",
    service: "Coupe",
    duration: "1h",
    status: "En attente",
  },
  {
    time: "16:30",
    client: "Sofia R.",
    service: "Soin capillaire",
    duration: "1h15",
    status: "Confirmé",
  },
];

export default function MyAppointments() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* HEADER */}

      <div
        className="
          rounded-3xl
          border border-(--border)
          bg-white
          p-6
          sm:p-8
        "
      >
        <p
          className="
          text-xs
          font-semibold
          uppercase
          tracking-[0.25em]
          text-(--champagne)
        "
        >
          Espace employé
        </p>

        <h1
          className="
            mt-3
            font-title
            text-3xl
            text-(--black)
          "
        >
          Mes rendez-vous
        </h1>

        <p
          className="
          mt-2
          text-sm
          text-stone-500
        "
        >
          Consultez votre planning et gérez vos prestations du jour.
        </p>
      </div>

      {/* STATISTIQUES */}

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
        "
      >
        <InfoCard
          title="Rendez-vous aujourd'hui"
          value="8"
          icon={<CalendarDays size={22} />}
        />

        <InfoCard
          title="Prochain rendez-vous"
          value="09:30"
          icon={<Clock size={22} />}
        />

        <InfoCard title="Clients du jour" value="8" icon={<User size={22} />} />
      </div>

      {/* LISTE */}

      <div
        className="
          rounded-3xl
          border border-(--border)
          bg-white
          p-5
          sm:p-6
        "
      >
        <h2
          className="
            mb-5
            font-semibold
            text-(--black)
          "
        >
          Planning du jour
        </h2>

        <div className="flex flex-col gap-4">
          {appointments.map((appointment, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -3,
              }}
              className="
                flex
                flex-col
                gap-5
                rounded-3xl
                border border-(--border)
                bg-(--cream)
                p-5
                transition
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              {/* HEURE */}

              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-(--black)
                    text-(--cream)
                  "
                >
                  <Clock size={20} />
                </div>

                <div>
                  <p
                    className="
                    font-bold
                    text-(--black)
                  "
                  >
                    {appointment.time}
                  </p>

                  <p
                    className="
                    text-xs
                    text-stone-500
                  "
                  >
                    {appointment.duration}
                  </p>
                </div>
              </div>

              {/* CLIENT */}

              <div className="flex items-center gap-3">
                <User size={20} className="text-(--champagne)" />

                <div>
                  <p className="font-semibold">{appointment.client}</p>

                  <p className="text-xs text-stone-500">Cliente</p>
                </div>
              </div>

              {/* SERVICE */}

              <div className="flex items-center gap-3">
                <Scissors size={20} className="text-(--champagne)" />

                <div>
                  <p className="font-semibold">{appointment.service}</p>

                  <p className="text-xs text-stone-500">Prestation</p>
                </div>
              </div>

              {/* STATUT */}

              <span
                className={`
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  ${
                    appointment.status === "Confirmé"
                      ? "bg-(--black) text-(--cream)"
                      : "bg-amber-100 text-amber-800"
                  }
                `}
              >
                {appointment.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="
        flex
        flex-1
        items-center
        justify-between
        rounded-3xl
        border border-(--border)
        bg-white
        p-6
      "
    >
      <div>
        <p
          className="
          text-sm
          text-stone-500
        "
        >
          {title}
        </p>

        <h3
          className="
            mt-2
            text-3xl
            font-bold
            text-(--black)
          "
        >
          {value}
        </h3>
      </div>

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-(--cream)
          text-(--black)
        "
      >
        {icon}
      </div>
    </motion.div>
  );
}
