// src/pages/admin/EmployeeDetails.tsx

import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Scissors,
  CalendarDays,
  Wallet,
  TrendingUp,
  Clock,
  Award,
  Star,
} from "lucide-react";

const recentServices = [
  {
    client: "Emma Wilson",
    service: "Coloration cheveux",
    price: "120 DA",
    date: "Aujourd'hui • 10:30",
  },
  {
    client: "Julie Martin",
    service: "Coupe cheveux",
    price: "40 DA",
    date: "Aujourd'hui • 09:00",
  },
  {
    client: "Sarah Lopez",
    service: "Brushing",
    price: "25 DA",
    date: "Hier",
  },
  {
    client: "Nina Thomas",
    service: "Soin cheveux",
    price: "60 DA",
    date: "Hier",
  },
];

export default function EmployeeDetails() {
  return (
    <div className="w-full space-y-6">
      {/* PROFIL */}

      <section className="flex flex-col gap-8 rounded-3xl border border-(--border) bg-white p-6 lg:flex-row">
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/250?img=44"
            className="h-36 w-36 rounded-full object-cover ring-4 ring-(--cream)"
          />

          <span className="mt-5 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Active
          </span>
        </div>

        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.35em] text-(--brown)">
            Profil employé
          </p>

          <h1 className="mt-3 font-title text-4xl font-bold text-(--black)">
            Sarah Johnson
          </h1>

          <p className="mt-2 text-(--muted)">
            Coiffeuse professionnelle senior
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            <Info
              icon={<Phone size={18} />}
              label="Téléphone"
              value="+33 6 12 34 56 78"
            />

            <Info
              icon={<Mail size={18} />}
              label="Email"
              value="sarah@anfelk.com"
            />

            <Info
              icon={<Scissors size={18} />}
              label="Spécialité"
              value="Coiffure"
            />

            <Info
              icon={<CalendarDays size={18} />}
              label="Date arrivée"
              value="12 Mars 2024"
            />
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}

      <section className="flex flex-col gap-4 md:flex-row">
        <Card title="Chiffre généré" value="5 850 DA" icon={<Wallet />} />

        <Card title="Rendez-vous" value="145" icon={<CalendarDays />} />

        <Card title="Panier moyen" value="40 DA" icon={<TrendingUp />} />

        <Card title="Heures travaillées" value="168 h" icon={<Clock />} />
      </section>

      {/* PERFORMANCE */}

      <section className="flex flex-col gap-6 lg:flex-row">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex-1 rounded-3xl border border-(--border) bg-white p-6"
        >
          <h2 className="mb-6 text-xl font-semibold">Evolution mensuelle</h2>

          <div className="flex h-72 items-end gap-4 rounded-3xl bg-(--cream) p-6">
            {[42, 55, 63, 71, 58, 88, 95].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-full bg-(--brown)"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-90"
        >
          <h2 className="mb-5 text-xl font-semibold">Performance</h2>

          <div className="flex flex-col gap-4">
            <Stat icon={<Award />} title="Meilleure employée" value="2 fois" />

            <Stat icon={<Star />} title="Note clientes" value="4.9 / 5" />

            <Stat
              icon={<Scissors />}
              title="Service préféré"
              value="Coloration"
            />
          </div>
        </motion.div>
      </section>

      {/* HISTORIQUE */}

      <section className="rounded-3xl border border-(--border) bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold">Dernières prestations</h2>

        <div className="flex flex-col gap-4">
          {recentServices.map((service) => (
            <motion.div
              key={service.client}
              whileHover={{ x: 5 }}
              className="flex flex-col gap-3 rounded-2xl border border-(--border) bg-(--soft) p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold">{service.client}</h3>

                <p className="text-sm text-(--muted)">{service.service}</p>
              </div>

              <div className="sm:text-right">
                <p className="font-bold text-(--brown)">{service.price}</p>

                <p className="text-xs text-(--muted)">{service.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({
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
      whileHover={{ y: -5 }}
      className="flex-1 rounded-3xl border border-(--border) bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-(--muted)">{title}</p>

          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
        </div>

        <div className="rounded-full bg-(--cream) p-4 text-(--brown)">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-(--cream) p-3 text-(--brown)">{icon}</div>

      <div>
        <p className="text-sm text-(--muted)">{label}</p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Stat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-(--soft) p-4">
      <div className="rounded-xl bg-(--cream) p-3 text-(--brown)">{icon}</div>

      <div>
        <p className="text-sm text-(--muted)">{title}</p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
