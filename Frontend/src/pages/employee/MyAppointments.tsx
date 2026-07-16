import { motion } from "framer-motion";
import { CalendarDays, Clock, User, Scissors } from "lucide-react";

const appointments = [
  {
    time: "09:30 AM",
    client: "Emma D.",
    service: "Hair Coloring",
    duration: "1h30",
    status: "Confirmed",
  },
  {
    time: "11:30 AM",
    client: "Sarah M.",
    service: "Brushing",
    duration: "45 min",
    status: "Confirmed",
  },
  {
    time: "02:00 PM",
    client: "Lina K.",
    service: "Hair Cut",
    duration: "1h",
    status: "Pending",
  },
  {
    time: "04:30 PM",
    client: "Sofia R.",
    service: "Hair Treatment",
    duration: "1h15",
    status: "Confirmed",
  },
];

export default function MyAppointments() {
  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="ak-card px-5 py-7 text-center sm:px-8 lg:text-left">
        <p className="ak-kicker">Employee Space</p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold text-[#0b0b0b]">
          My Appointments
        </h1>

        <p className="ak-muted mt-2">
          Manage your upcoming appointments and daily schedule.
        </p>
      </div>

      {/* TODAY SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard
          title="Today's Appointments"
          value="8"
          icon={<CalendarDays size={22} />}
        />

        <InfoCard
          title="Next Appointment"
          value="09:30 AM"
          icon={<Clock size={22} />}
        />

        <InfoCard title="Customers Today" value="8" icon={<User size={22} />} />
      </div>

      {/* APPOINTMENT LIST */}

      <div className="ak-card p-5 sm:p-6">
        <h2 className="mb-6 font-semibold text-[#0b0b0b]">Today's Schedule</h2>

        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="flex flex-col gap-4 rounded-2xl border border-[#e8e2d8] bg-[#f7f4ee] p-5 md:flex-row md:items-center md:justify-between"
            >
              {/* TIME */}

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#3E2C23] p-3 text-[#FFF4D6]">
                  <Clock size={20} />
                </div>

                <div>
                  <p className="font-bold text-[#3E2C23]">{appointment.time}</p>

                  <p className="text-xs text-gray-500">
                    {appointment.duration}
                  </p>
                </div>
              </div>

              {/* CLIENT */}

              <div className="flex items-center gap-3">
                <User size={20} className="text-[#3E2C23]" />

                <div>
                  <p className="font-semibold">{appointment.client}</p>

                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>

              {/* SERVICE */}

              <div className="flex items-center gap-3">
                <Scissors size={20} className="text-[#3E2C23]" />

                <div>
                  <p className="font-semibold">{appointment.service}</p>

                  <p className="text-sm text-gray-500">Service</p>
                </div>
              </div>

              {/* STATUS */}

              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  appointment.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
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
      whileHover={{ y: -4 }}
      className="ak-card flex items-center justify-between p-6"
    >
      <div>
        <p className="ak-muted text-sm">{title}</p>

        <h3 className="mt-2 text-2xl font-bold">{value}</h3>
      </div>

      <div className="rounded-full bg-[#FFF4D6] p-4 text-[#3E2C23]">{icon}</div>
    </motion.div>
  );
}
