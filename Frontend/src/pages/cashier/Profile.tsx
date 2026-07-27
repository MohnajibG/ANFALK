import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, UserRound, Briefcase } from "lucide-react";

import { authApi } from "../../api/auth.api";

import type { AuthUser } from "../../types/auth";

const Profile = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await authApi.me();

        setUser(response.user);
      } catch (error) {
        console.error("[Profile]", error);
        setError("Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Chargement du profil...
      </div>
    );

  if (error || !user)
    return (
      <div className="rounded-3xl bg-red-50 p-6 text-red-600">
        {error || "Utilisateur introuvable"}
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <section className="ak-card flex flex-col gap-5 bg-[#151515] p-6 text-[#FFF4D6] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#D8B98A]">
            Compte
          </p>

          <h1 className="mt-3 font-[Cinzel] text-3xl font-bold">Mon Profil</h1>

          <p className="mt-2 text-sm text-white/60">
            Gestion de vos informations personnelles
          </p>
        </div>

        <div className="rounded-xl bg-white/10 px-5 py-3 text-sm uppercase tracking-widest">
          {user.role}
        </div>
      </section>

      <div className="flex flex-wrap gap-6">
        <motion.section
          whileHover={{ y: -5 }}
          className="ak-card flex w-full flex-col items-center justify-center p-6 text-center lg:w-[32%]"
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#151515] font-[Cinzel] text-4xl font-bold text-[#D8B98A]">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>

          <p className="mt-3 rounded-full bg-[#D8B98A]/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#8B6A3D]">
            {user.role}
          </p>
        </motion.section>

        <section className="ak-card flex-1 p-6">
          <h2 className="mb-5 text-xl font-bold">Informations personnelles</h2>

          <div className="flex flex-wrap gap-4">
            <InfoCard
              icon={UserRound}
              label="Nom complet"
              value={`${user.firstName} ${user.lastName}`}
            />

            <InfoCard icon={Mail} label="Email" value={user.email} />

            <InfoCard
              icon={Briefcase}
              label="Spécialité"
              value={user.speciality || "Non renseignée"}
            />

            <InfoCard
              icon={ShieldCheck}
              label="Statut"
              value={user.isActive ? "Actif" : "Inactif"}
            />
          </div>
        </section>
      </div>

      <section className="ak-card p-6">
        <h2 className="text-xl font-bold">Sécurité</h2>

        <p className="ak-muted mt-2">Gestion du mot de passe du compte.</p>

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
}) => (
  <div className="flex min-w-60 flex-1 items-center gap-4 rounded-2xl bg-[#F7F2EA] p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#151515] text-[#D8B98A]">
      <Icon size={20} />
    </div>

    <div>
      <p className="text-xs text-gray-500">{label}</p>

      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default Profile;
