import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Scissors,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Award,
  Star,
} from "lucide-react";

const recentServices = [
  {
    customer: "Emma Wilson",
    service: "Hair Coloring",
    price: "120 €",
    date: "Today • 10:30",
  },
  {
    customer: "Julie Martin",
    service: "Hair Cut",
    price: "40 €",
    date: "Today • 09:00",
  },
  {
    customer: "Sarah Lopez",
    service: "Brushing",
    price: "25 €",
    date: "Yesterday",
  },
  {
    customer: "Nina Thomas",
    service: "Hair Treatment",
    price: "60 €",
    date: "Yesterday",
  },
];

export default function EmployeeDetails() {
  return (
    <div className="w-full space-y-6">
      {/* PROFILE */}

      <div className="ak-card flex flex-col gap-8 p-8 lg:flex-row">
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/250?img=44"
            className="h-40 w-40 rounded-full object-cover"
          />

          <div className="mt-5 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Active
          </div>
        </div>

        <div className="flex-1">
          <p className="ak-kicker">Employee Profile</p>

          <h1 className="mt-2 font-[Cinzel] text-4xl">Sarah Johnson</h1>

          <p className="mt-2 text-[#7A7A7A]">Senior Hair Stylist</p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Info
              icon={<Phone size={18} />}
              label="Phone"
              value="+33 6 12 34 56 78"
            />

            <Info
              icon={<Mail size={18} />}
              label="Email"
              value="sarah@anfelk.com"
            />

            <Info
              icon={<Scissors size={18} />}
              label="Speciality"
              value="Hairdresser"
            />

            <Info
              icon={<Calendar size={18} />}
              label="Joined"
              value="12 March 2024"
            />
          </div>
        </div>
      </div>

      {/* KPI */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Revenue" value="5 850 €" icon={<DollarSign />} />

        <Card title="Appointments" value="145" icon={<Calendar />} />

        <Card title="Average Ticket" value="40 €" icon={<TrendingUp />} />

        <Card title="Working Hours" value="168 h" icon={<Clock />} />
      </div>

      {/* PERFORMANCE */}

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-6 lg:col-span-2"
        >
          <h2 className="mb-6 text-xl font-semibold">Monthly Revenue</h2>

          <div className="flex h-72 items-end gap-4 rounded-3xl bg-[#f8f5ef] p-6">
            {[42, 55, 63, 71, 58, 88, 95].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-[#3E2C23]"
                style={{
                  height: `${v}%`,
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="ak-card p-6">
          <h2 className="mb-5 text-xl font-semibold">Performance</h2>

          <div className="space-y-5">
            <Stat icon={<Award />} title="Top Employee" value="2 Times" />

            <Stat icon={<Star />} title="Customer Rating" value="4.9 / 5" />

            <Stat
              icon={<Scissors />}
              title="Most Requested"
              value="Hair Coloring"
            />
          </div>
        </motion.div>
      </div>

      {/* RECENT SERVICES */}

      <div className="ak-card p-6">
        <h2 className="mb-6 text-xl font-semibold">Recent Services</h2>

        <div className="space-y-4">
          {recentServices.map((service) => (
            <motion.div
              key={service.customer}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between rounded-2xl border border-[#ece6db] p-5"
            >
              <div>
                <h3 className="font-semibold">{service.customer}</h3>

                <p className="text-sm text-gray-500">{service.service}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#3E2C23]">{service.price}</p>

                <p className="text-xs text-gray-500">{service.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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
    <motion.div whileHover={{ y: -5 }} className="ak-card p-6">
      <div className="flex justify-between">
        <div>
          <p className="ak-muted text-sm">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="rounded-full bg-[#FFF4D6] p-4">{icon}</div>
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
      <div className="rounded-xl bg-[#FFF4D6] p-3">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
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
    <div className="flex items-center gap-4 rounded-2xl bg-[#faf7f1] p-4">
      <div className="rounded-xl bg-[#FFF4D6] p-3">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="font-semibold">{value}</h3>
      </div>
    </div>
  );
}
