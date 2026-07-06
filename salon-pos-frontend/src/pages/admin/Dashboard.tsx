import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}
      <div className="ak-card px-5 py-7 text-center sm:px-8 lg:text-left">
        <p className="ak-kicker">Admin</p>
        <h1 className="mt-3 font-[Cinzel] text-3xl font-bold text-[#0b0b0b]">
          Admin Dashboard
        </h1>
        <p className="ak-muted mt-2">A clear overview of institute activity.</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Revenue" value="12 450 €" />
        <KpiCard title="Tickets" value="128" />
        <KpiCard title="Clients" value="89" />
        <KpiCard title="Average Basket" value="97 €" />
      </div>

      {/* CONTENT GRID */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* SALES CHART */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-5 sm:p-6 lg:col-span-2"
        >
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">Revenue Trend</h2>

          <div className="flex h-64 w-full items-end gap-3 rounded-3xl border border-[#e8e2d8] bg-[#f7f4ee] p-5">
            {[42, 58, 48, 72, 64, 86, 78].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-full bg-[#0b0b0b]"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* TOP SERVICES */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-5 sm:p-6"
        >
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">Top Services</h2>

          <ul className="ak-muted space-y-3 text-sm font-medium">
            <li>Brushing - 32 sales</li>
            <li>Full set - 28 sales</li>
            <li>Bridal makeup - 19 sales</li>
          </ul>
        </motion.div>

        {/* EMPLOYEES PERFORMANCE */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="ak-card p-5 sm:p-6 lg:col-span-3"
        >
          <h2 className="mb-4 font-semibold text-[#0b0b0b]">
            Employee Performance
          </h2>

          <ul className="grid gap-3 text-sm font-medium text-[#6f6f6f] sm:grid-cols-3">
            <li>Sarah - 3 200 €</li>
            <li>Lina - 2 850 €</li>
            <li>Sonia - 2 100 €</li>
          </ul>
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
