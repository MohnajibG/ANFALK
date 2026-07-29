// import { useCallback, useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import type { LucideIcon } from "lucide-react";
// import {
//   HandCoins,
//   Receipt,
//   Users,
//   UserCog,
//   TrendingUp,
//   TrendingDown,
//   Scissors,
//   CreditCard,
//   Layers,
//   XCircle,
//   CalendarCheck,
//   CalendarX,
//   UserPlus,
//   Repeat,
//   ShoppingBag,
// } from "lucide-react";

// import {
//   getAdminDashboard,
//   type DashboardData,
//   type DashboardPeriod,
// } from "../../api/dashboard.api";

// const periodOptions: { value: DashboardPeriod; label: string }[] = [
//   { value: "day", label: "Jour" },
//   { value: "week", label: "Semaine" },
//   { value: "month", label: "Mois" },
//   { value: "year", label: "Année" },
//   { value: "custom", label: "Personnalisé" },
// ];

// const money = (value: number) => `${value.toLocaleString("fr-FR")} DA`;

// export default function Dashboard() {
//   const [period, setPeriod] = useState<DashboardPeriod>("month");
//   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
//   const [startDate, setStartDate] = useState(() =>
//     new Date().toISOString().slice(0, 10),
//   );
//   const [endDate, setEndDate] = useState(() =>
//     new Date().toISOString().slice(0, 10),
//   );

//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadDashboard = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const result = await getAdminDashboard(
//         period === "custom" ? { period, startDate, endDate } : { period, date },
//       );

//       setData(result);
//     } catch (err) {
//       console.error("[Dashboard] load:", err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Impossible de charger le dashboard",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [period, date, startDate, endDate]);

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     loadDashboard();
//   }, [loadDashboard]);

//   const maxEvolutionRevenue = useMemo(() => {
//     if (!data?.evolution?.length) return 0;

//     return Math.max(...data.evolution.map((item) => item.revenue));
//   }, [data]);

//   const maxCategoryRevenue = useMemo(() => {
//     if (!data?.categoryBreakdown.length) return 0;

//     return Math.max(...data.categoryBreakdown.map((item) => item.revenue));
//   }, [data]);

//   const maxPaymentRevenue = useMemo(() => {
//     if (!data?.paymentBreakdown?.length) return 0;

//     return Math.max(...data.paymentBreakdown.map((item) => item.revenue));
//   }, [data]);

//   if (error) {
//     return (
//       <div className="rounded-2xl bg-red-50 p-5 text-red-600">{error}</div>
//     );
//   }

//   return (
//     <div className="w-full space-y-6">
//       <section className="rounded-3xl border border-[#eadfce] bg-white p-6">
//         <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
//           ADMIN
//         </p>

//         <h1 className="mt-3 font-serif text-3xl font-bold">Dashboard</h1>

//         <p className="mt-2 text-sm text-gray-500">
//           Vue globale de gestion ANFEL K Institute
//         </p>

//         {/* FILTRES */}
//         <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
//           <div className="flex flex-wrap gap-2">
//             {periodOptions.map((option) => (
//               <button
//                 key={option.value}
//                 onClick={() => setPeriod(option.value)}
//                 className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
//                   period === option.value
//                     ? "bg-[#3E2C23] text-[#FFF4D6]"
//                     : "bg-[#f7f4ee] text-gray-600 hover:bg-[#eadfce]"
//                 }`}
//               >
//                 {option.label}
//               </button>
//             ))}
//           </div>

//           {period !== "custom" ? (
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="rounded-xl border border-[#eadfce] px-4 py-2 text-sm"
//             />
//           ) : (
//             <div className="flex items-center gap-2">
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="rounded-xl border border-[#eadfce] px-4 py-2 text-sm"
//               />

//               <span className="text-sm text-gray-400">→</span>

//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="rounded-xl border border-[#eadfce] px-4 py-2 text-sm"
//               />
//             </div>
//           )}
//         </div>
//       </section>

//       {loading || !data ? (
//         <div className="flex min-h-100 items-center justify-center text-gray-500">
//           Chargement du dashboard...
//         </div>
//       ) : (
//         <>
//           {/* KPI PRINCIPAUX */}
//           <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             <KpiCard
//               icon={HandCoins}
//               title="Chiffre d'affaires"
//               value={money(data.sales.current.revenue)}
//               change={data.sales.change.revenue}
//             />

//             <KpiCard
//               icon={Receipt}
//               title="Tickets"
//               value={String(data.sales.current.tickets)}
//               change={data.sales.change.tickets}
//             />

//             <KpiCard
//               icon={ShoppingBag}
//               title="Panier moyen"
//               value={money(data.averageBasket)}
//             />

//             <KpiCard
//               icon={XCircle}
//               title="Taux d'annulation"
//               value={`${data.cancellation.rate}%`}
//               danger={data.cancellation.rate > 10}
//             />
//           </section>

//           {/* CLIENTS / EMPLOYES / RDV */}
//           <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             <KpiCard
//               icon={Users}
//               title="Clients actifs"
//               value={String(data.clients.total)}
//             />
//             <KpiCard
//               icon={UserPlus}
//               title="Nouveaux clients"
//               value={String(data.clients.new)}
//             />
//             <KpiCard
//               icon={Repeat}
//               title="Clients fidèles"
//               value={String(data.clients.returning)}
//             />
//             <KpiCard
//               icon={UserCog}
//               title="Employés"
//               value={String(data.employees.total)}
//             />
//           </section>

//           {/* EVOLUTION */}
//           <motion.div
//             whileHover={{ scale: 1.005 }}
//             className="rounded-3xl border border-[#eadfce] bg-white p-6"
//           >
//             <div className="flex items-center justify-between">
//               <h2 className="font-semibold">Évolution du chiffre d'affaires</h2>
//               <TrendingUp size={20} />
//             </div>

//             {data.evolution.length === 0 ? (
//               <p className="mt-6 text-sm text-gray-500">
//                 Aucune vente sur cette période
//               </p>
//             ) : (
//               <div className="mt-6 flex h-56 items-end gap-2 overflow-x-auto rounded-2xl bg-[#f7f4ee] p-4">
//                 {data.evolution.map((item) => (
//                   <div
//                     key={item._id}
//                     className="flex min-w-10 flex-1 flex-col items-center justify-end gap-2"
//                     title={`${item._id} · ${money(item.revenue)} · ${item.tickets} tickets`}
//                   >
//                     <div
//                       className="w-full rounded-full bg-[#3E2C23]"
//                       style={{
//                         height: `${
//                           maxEvolutionRevenue > 0
//                             ? Math.max(
//                                 (item.revenue / maxEvolutionRevenue) * 100,
//                                 4,
//                               )
//                             : 4
//                         }%`,
//                       }}
//                     />
//                     <span className="text-[10px] text-gray-400">
//                       {item._id.slice(5)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </motion.div>

//           {/* PAIEMENT + CATEGORIES */}
//           <section className="grid gap-6 lg:grid-cols-2">
//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="rounded-3xl border border-[#eadfce] bg-white p-6"
//             >
//               <div className="mb-5 flex items-center gap-2">
//                 <CreditCard size={20} />
//                 <h2 className="font-semibold">Répartition par paiement</h2>
//               </div>

//               {data.paymentBreakdown?.length === 0 ? (
//                 <p className="text-sm text-gray-500">Aucune donnée</p>
//               ) : (
//                 <div className="space-y-4">
//                   {data.paymentBreakdown.map((item) => (
//                     <div key={item._id}>
//                       <div className="flex justify-between text-sm">
//                         <span className="capitalize">{item._id}</span>
//                         <strong>{money(item.revenue)}</strong>
//                       </div>

//                       <div className="mt-2 h-2 w-full rounded-full bg-[#f7f4ee]">
//                         <div
//                           className="h-2 rounded-full bg-[#3E2C23]"
//                           style={{
//                             width: `${
//                               maxPaymentRevenue > 0
//                                 ? (item.revenue / maxPaymentRevenue) * 100
//                                 : 0
//                             }%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </motion.div>

//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="rounded-3xl border border-[#eadfce] bg-white p-6"
//             >
//               <div className="mb-5 flex items-center gap-2">
//                 <Layers size={20} />
//                 <h2 className="font-semibold">Répartition par catégorie</h2>
//               </div>

//               {data.categoryBreakdown?.length === 0 ? (
//                 <p className="text-sm text-gray-500">Aucune donnée</p>
//               ) : (
//                 <div className="space-y-4">
//                   {data.categoryBreakdown.map((item) => (
//                     <div key={item._id}>
//                       <div className="flex justify-between text-sm">
//                         <span>{item.name}</span>
//                         <strong>{money(item.revenue)}</strong>
//                       </div>

//                       <div className="mt-2 h-2 w-full rounded-full bg-[#f7f4ee]">
//                         <div
//                           className="h-2 rounded-full bg-[#D8B98A]"
//                           style={{
//                             width: `${
//                               maxCategoryRevenue > 0
//                                 ? (item.revenue / maxCategoryRevenue) * 100
//                                 : 0
//                             }%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </motion.div>
//           </section>

//           {/* SERVICES POPULAIRES */}
//           <motion.div
//             whileHover={{ scale: 1.01 }}
//             className="rounded-3xl border border-[#eadfce] bg-white p-6"
//           >
//             <div className="mb-5 flex items-center gap-2">
//               <Scissors size={20} />
//               <h2 className="font-semibold">Services populaires</h2>
//             </div>

//             <div className="space-y-3">
//               {data.popularServices?.length ? (
//                 data.popularServices.map((service) => (
//                   <div
//                     key={service._id}
//                     className="flex justify-between border-b py-2 text-sm"
//                   >
//                     <span>{service._id}</span>
//                     <span className="flex gap-4">
//                       <span className="text-gray-500">
//                         {service.sales} ventes
//                       </span>
//                       <strong>{money(service.revenue)}</strong>
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-gray-500">Aucun service vendu</p>
//               )}
//             </div>
//           </motion.div>

//           {/* TOP EMPLOYES + CAISSIERS */}
//           <section className="grid gap-6 lg:grid-cols-2">
//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="rounded-3xl border border-[#eadfce] bg-white p-6"
//             >
//               <h2 className="mb-5 font-semibold">Performance employés</h2>

//               <div className="space-y-3">
//                 {data.topEmployees?.length ? (
//                   data.topEmployees.map((employee) => (
//                     <div
//                       key={employee.employeeId}
//                       className="flex items-center justify-between rounded-2xl bg-[#f7f4ee] p-4"
//                     >
//                       <span className="font-semibold">{employee.name}</span>
//                       <span className="text-right text-sm">
//                         <p className="font-bold">{money(employee.revenue)}</p>
//                         <p className="text-gray-500">
//                           {employee.tickets} tickets
//                         </p>
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">
//                     Aucun employé disponible
//                   </p>
//                 )}
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="rounded-3xl border border-[#eadfce] bg-white p-6"
//             >
//               <h2 className="mb-5 font-semibold">
//                 Meilleurs vendeurs (caisse)
//               </h2>

//               <div className="space-y-3">
//                 {data.topCashiers?.length ? (
//                   data.topCashiers.map((cashier) => (
//                     <div
//                       key={cashier.userId}
//                       className="flex items-center justify-between rounded-2xl bg-[#f7f4ee] p-4"
//                     >
//                       <span className="font-semibold">{cashier.name}</span>
//                       <span className="text-right text-sm">
//                         <p className="font-bold">{money(cashier.revenue)}</p>
//                         <p className="text-gray-500">
//                           {cashier.tickets} tickets
//                         </p>
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">Aucune donnée</p>
//                 )}
//               </div>
//             </motion.div>
//           </section>

//           {/* RENDEZ-VOUS */}
//           <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             <KpiCard
//               icon={CalendarCheck}
//               title="Rendez-vous"
//               value={String(data.appointments.total)}
//             />
//             <KpiCard
//               icon={TrendingUp}
//               title="Taux de conversion"
//               value={`${data.appointments.conversionRate}%`}
//             />
//             <KpiCard
//               icon={CalendarX}
//               title="Taux de no-show"
//               value={`${data.appointments.noShowRate}%`}
//               danger={data.appointments.noShowRate > 10}
//             />
//             <KpiCard
//               icon={XCircle}
//               title="Annulés"
//               value={String(data.appointments.cancelled)}
//             />
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

// const KpiCard = ({
//   icon: Icon,
//   title,
//   value,
//   change,
//   danger,
// }: {
//   icon: LucideIcon;
//   title: string;
//   value: string;
//   change?: number;
//   danger?: boolean;
// }) => (
//   <motion.div
//     whileHover={{ y: -5 }}
//     className="rounded-3xl border border-[#eadfce] bg-white p-6"
//   >
//     <div className="flex items-center justify-between">
//       <p className="text-sm text-gray-500">{title}</p>
//       <Icon size={22} className={danger ? "text-red-500" : undefined} />
//     </div>

//     <h3 className={`mt-4 text-3xl font-bold ${danger ? "text-red-600" : ""}`}>
//       {value}
//     </h3>

//     {typeof change === "number" && (
//       <div
//         className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
//           change >= 0 ? "text-green-600" : "text-red-600"
//         }`}
//       >
//         {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
//         {change >= 0 ? "+" : ""}
//         {change}% vs période précédente
//       </div>
//     )}
//   </motion.div>
// );
import DashboardFilters from "../../components/dashboard/DashboardFilters";
import DashboardKpis from "../../components/dashboard/DashboardKpis";
import EvolutionChart from "../../components/dashboard/EvolutionChart";
import PaymentBreakdown from "../../components/dashboard/PaymentBreakdown";
import CategoryBreakdown from "../../components/dashboard/CategoryBreakdown";
import PopularServices from "../../components/dashboard/PopularServices";
import TopEmployees from "../../components/dashboard/TopEmployees";
import TopCashiers from "../../components/dashboard/TopCashiers";
import AppointmentStats from "../../components/dashboard/AppointmentStats";
import LoadingDashboard from "../../components/dashboard/LoadingDashboard";
import ErrorDashboard from "../../components/dashboard/ErrorDashboard";

import useDashboard from "../../hooks/useDashboard";

export default function Dashboard() {
  const {
    data,
    loading,
    error,

    period,
    setPeriod,

    date,
    setDate,

    startDate,
    setStartDate,

    endDate,
    setEndDate,
  } = useDashboard();

  if (error) {
    return <ErrorDashboard error={error} />;
  }

  return (
    <div className="w-full space-y-6">
      <DashboardFilters
        period={period}
        setPeriod={setPeriod}
        date={date}
        setDate={setDate}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {loading || !data ? (
        <LoadingDashboard />
      ) : (
        <>
          <DashboardKpis data={data} />

          <EvolutionChart data={data} />

          <section className="grid gap-6 lg:grid-cols-2">
            <PaymentBreakdown data={data} />

            <CategoryBreakdown data={data} />
          </section>

          <PopularServices data={data} />

          <section className="grid gap-6 lg:grid-cols-2">
            <TopEmployees data={data} />

            <TopCashiers data={data} />
          </section>

          <AppointmentStats data={data} />
        </>
      )}
    </div>
  );
}
