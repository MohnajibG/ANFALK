import { motion } from "framer-motion";

export default function EmployeeDashboard() {
  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="ak-card px-5 py-7 text-center sm:px-8 lg:text-left">
        <p className="ak-kicker">Employee Space</p>

        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold text-[#0b0b0b]">
          Welcome back, Sarah
        </h1>

        <p className="ak-muted mt-2">Hair Stylist · Coiffure</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Today's Revenue" value="320 €" />

        <KpiCard title="Services Completed" value="12" />

        <KpiCard title="Customers Served" value="10" />

        <KpiCard title="Monthly Revenue" value="4 250 €" />
      </div>

      {/* CONTENT GRID */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* PERFORMANCE */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-5 sm:p-6 lg:col-span-2"
        >
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">My Performance</h2>

          <div className="flex h-64 w-full items-end gap-3 rounded-3xl border border-[#e8e2d8] bg-[#f7f4ee] p-5">
            {[35, 50, 45, 70, 62, 85, 75].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-full bg-[#3E2C23]"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>

          <p className="ak-muted mt-4 text-sm">
            Revenue evolution during the last 7 days
          </p>
        </motion.div>

        {/* SPECIALITY */}
        <motion.div whileHover={{ scale: 1.01 }} className="ak-card p-5 sm:p-6">
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">My Speciality</h2>

          <div className="space-y-4">
            <div>
              <p className="ak-muted text-sm">Category</p>

              <p className="font-semibold">Hair Styling</p>
            </div>

            <div>
              <p className="ak-muted text-sm">Total Services</p>

              <p className="font-semibold">156 services</p>
            </div>

            <div>
              <p className="ak-muted text-sm">Average Rating</p>

              <p className="font-semibold">⭐ 4.9 / 5</p>
            </div>
          </div>
        </motion.div>

        {/* RECENT SERVICES */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-5 sm:p-6 lg:col-span-3"
        >
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">Recent Services</h2>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <ServiceItem
              client="Emma D."
              service="Hair Coloring"
              price="70 €"
            />

            <ServiceItem client="Sarah M." service="Brushing" price="25 €" />

            <ServiceItem client="Lina K." service="Hair Cut" price="40 €" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* KPI COMPONENT */

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="ak-card p-6 text-center sm:text-left"
    >
      <p className="ak-muted text-sm font-semibold">{title}</p>

      <h3 className="mt-2 text-2xl font-bold text-[#0b0b0b]">{value}</h3>
    </motion.div>
  );
}

/* SERVICE COMPONENT */

function ServiceItem({
  client,
  service,
  price,
}: {
  client: string;
  service: string;
  price: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8e2d8] bg-[#f7f4ee] p-4">
      <p className="font-semibold text-[#0b0b0b]">{client}</p>

      <p className="ak-muted">{service}</p>

      <p className="mt-2 font-bold text-[#3E2C23]">{price}</p>
    </div>
  );
}
