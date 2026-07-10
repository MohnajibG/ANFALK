import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Scissors,
  CalendarDays,
  Award,
  CheckCircle,
} from "lucide-react";

export default function Profile() {
  const employee = {
    name: "Sarah Martin",
    role: "Hair Stylist",
    speciality: "Coiffure",
    phone: "06 12 34 56 78",
    email: "sarah@anfalk.com",
    joined: "January 2025",
    status: "Active",
    experience: "5 years",
  };

  const stats = [
    {
      title: "Services Completed",
      value: "315",
    },
    {
      title: "Monthly Revenue",
      value: "5,100 €",
    },
    {
      title: "Clients Served",
      value: "248",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER PROFILE */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="ak-card p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* AVATAR */}

          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#3E2C23] text-[#FFF4D6]">
            <User size={55} />
          </div>

          {/* INFO */}

          <div>
            <p className="ak-kicker">Employee Profile</p>

            <h1 className="mt-2 font-[Cinzel] text-3xl font-bold">
              {employee.name}
            </h1>

            <p className="ak-muted mt-2">
              {employee.role} · {employee.speciality}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <CheckCircle size={16} />

              {employee.status}
            </div>
          </div>
        </div>
      </motion.div>

      {/* QUICK STATS */}

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            whileHover={{
              y: -4,
            }}
            className="ak-card p-6"
          >
            <p className="ak-muted text-sm">{stat.title}</p>

            <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* PERSONAL INFORMATION */}

      <div className="grid gap-5 lg:grid-cols-2">
        <motion.div
          className="ak-card p-6"
          whileHover={{
            scale: 1.01,
          }}
        >
          <h2 className="mb-5 text-lg font-bold">Personal Information</h2>

          <div className="space-y-4 text-sm">
            <Info
              icon={<Mail size={18} />}
              label="Email"
              value={employee.email}
            />

            <Info
              icon={<Phone size={18} />}
              label="Phone"
              value={employee.phone}
            />

            <Info
              icon={<CalendarDays size={18} />}
              label="Joined"
              value={employee.joined}
            />
          </div>
        </motion.div>

        {/* PROFESSIONAL INFO */}

        <motion.div
          className="ak-card p-6"
          whileHover={{
            scale: 1.01,
          }}
        >
          <h2 className="mb-5 text-lg font-bold">Professional Information</h2>

          <div className="space-y-4 text-sm">
            <Info
              icon={<Scissors size={18} />}
              label="Speciality"
              value={employee.speciality}
            />

            <Info
              icon={<Award size={18} />}
              label="Experience"
              value={employee.experience}
            />

            <Info
              icon={<CheckCircle size={18} />}
              label="Account Status"
              value={employee.status}
            />
          </div>
        </motion.div>
      </div>

      {/* ACTION */}

      <div className="ak-card p-6">
        <button className="rounded-xl bg-[#3E2C23] px-6 py-3 font-semibold text-[#FFF4D6] transition hover:scale-105">
          Edit Profile
        </button>
      </div>
    </div>
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
    <div className="flex items-center gap-4">
      <div className="rounded-xl bg-[#FFF4D6] p-3 text-[#3E2C23]">{icon}</div>

      <div>
        <p className="ak-muted text-xs">{label}</p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
