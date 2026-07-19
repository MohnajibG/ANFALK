import { useMemo } from "react";
import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="w-full space-y-6">
      <section className="rounded-3xl border border-[#D8B98A]/30 bg-[#151515] p-6 text-[#FFF4D6]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#D8B98A]">
          Compte
        </p>

        <h1 className="mt-3 font-[Cinzel] text-3xl tracking-widest">
          Mon Profil
        </h1>

        <p className="mt-2 text-sm text-white/60">
          Gestion de vos informations personnelles.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.section
          whileHover={{ y: -4 }}
          className="rounded-3xl border border-[#D8B98A]/30 bg-white p-6"
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#151515] text-[#D8B98A]">
              <UserRound size={48} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#151515]">
              {user.firstName || "Utilisateur"} {user.lastName || ""}
            </h2>

            <p className="mt-2 rounded-full bg-[#D8B98A]/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#8B6A3D]">
              {user.role || "cashier"}
            </p>
          </div>
        </motion.section>

        <section className="space-y-4 rounded-3xl border border-[#D8B98A]/30 bg-white p-6 lg:col-span-2">
          <h2 className="text-xl font-bold">Informations personnelles</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={UserRound}
              label="Nom complet"
              value={`${user.firstName || "-"} ${user.lastName || ""}`}
            />

            <InfoCard icon={Mail} label="Email" value={user.email || "-"} />

            <InfoCard
              icon={Phone}
              label="Téléphone"
              value={user.phone || "-"}
            />

            <InfoCard
              icon={ShieldCheck}
              label="Statut"
              value={user.isActive ? "Actif" : "Inactif"}
            />
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-[#D8B98A]/30 bg-white p-6">
        <h2 className="text-xl font-bold">Sécurité</h2>

        <p className="mt-2 text-sm text-gray-500">
          Vous pourrez modifier votre mot de passe depuis cet espace.
        </p>

        <button className="mt-5 rounded-xl bg-[#151515] px-5 py-3 text-[#FFF4D6] transition hover:bg-[#3E2C23]">
          Modifier le mot de passe
        </button>
      </section>
    </div>
  );
};

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#F7F2EA] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#151515] text-[#D8B98A]">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-xs text-gray-500">{label}</p>

        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

export default Profile;
