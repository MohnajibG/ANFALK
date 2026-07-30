import type { Speciality } from "./employee";

export const SPECIALITIES: Speciality[] = [
  "Hair",
  "Nails",
  "Makeup",
  "Massage",
  "Reception",
];

export const SPECIALITY_LABELS: Record<Speciality, string> = {
  Hair: "Coiffure",
  Nails: "Onglerie",
  Makeup: "Maquillage",
  Massage: "Massage",
  Reception: "Accueil",
};
