import { motion } from "framer-motion";
import { CalendarDays, Clock, User, Scissors } from "lucide-react";
import { useEffect, useState } from "react";

import { getMyEmployeeProfile } from "../../api/employee.api";
import type { Employee } from "../../types/employee";

interface EmployeeAppointment {
  _id: string;
  time: string;
  client: string;
  service: string;
  duration: string;
  status: string;
}

export default function MyAppointments() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [appointments, setAppointments] = useState<EmployeeAppointment[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getMyEmployeeProfile();

        setEmployee(profile);

        // FUTUR API :
        // const data = await getMyEmployeeAppointments();
        // setAppointments(data);

        setAppointments([]);
      } catch (error) {
        console.error("Erreur chargement rendez-vous", error);
      }
    };

    load();
  }, []);

  if (!employee) {
    return (
      <div className="rounded-[var(--radius-md)] border border-(--border) bg-white p-6 shadow-(--shadow-sm) p-6">
        Chargement...
      </div>
    );
  }

  const todayAppointments = appointments.length;

  const nextAppointment = appointments.length > 0 ? appointments[0].time : "-";

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-md border border-(--border) bg-white p-6 shadow-(--shadow-sm) sm:p-8">
        <p className="ak-kicker">Espace employé</p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">
          Mes rendez-vous
        </h1>

        <p className="ak-muted mt-2">
          Consultez votre planning et vos prestations.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <InfoCard
          title="Rendez-vous aujourd'hui"
          value={String(todayAppointments)}
          icon={<CalendarDays size={22} />}
        />

        <InfoCard
          title="Prochain rendez-vous"
          value={nextAppointment}
          icon={<Clock size={22} />}
        />

        <InfoCard
          title="Clients du jour"
          value={String(todayAppointments)}
          icon={<User size={22} />}
        />
      </div>

      <div className="rounded-[var(--radius-md)] border border-(--border) bg-white p-6 shadow-[var(--shadow-sm)] p-5 sm:p-6">
        <h2 className="mb-5 font-semibold">Planning du jour</h2>

        {appointments.length === 0 ? (
          <div className="text-center text-sm text-stone-500">
            Aucun rendez-vous disponible
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment._id}
                whileHover={{ y: -3 }}
                className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-(--cream) p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--black) text-(--cream)">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="font-bold">{appointment.time}</p>

                    <p className="text-xs text-stone-500">
                      {appointment.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User size={20} className="text-(--champagne)" />

                  <div>
                    <p className="font-semibold">{appointment.client}</p>

                    <p className="text-xs text-stone-500">Client</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Scissors size={20} className="text-(--champagne)" />

                  <div>
                    <p className="font-semibold">{appointment.service}</p>

                    <p className="text-xs text-stone-500">Prestation</p>
                  </div>
                </div>

                <span className="rounded-full bg-(--black) px-4 py-2 text-xs font-semibold text-(--cream)">
                  {appointment.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
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
      whileHover={{ y: -4 }}
      className="flex flex-1 items-center justify-between rounded-3xl border border-(--border) bg-white p-6"
    >
      <div>
        <p className="text-sm text-stone-500">{title}</p>

        <h3 className="mt-2 text-3xl font-bold">{value}</h3>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--cream)">
        {icon}
      </div>
    </motion.div>
  );
}
