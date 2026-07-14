import Appointment from "../models/Appointment";
import Client from "../models/Client";
import User from "../models/User";
import Service from "../models/Service";

interface CreateAppointmentData {
  client: string;
  employee: string;

  services: string[];

  date: Date;
  startTime: string;

  source?: "admin" | "cashier" | "online";

  notes?: string;

  createdBy: string;
}

/**
 * Convertir une heure HH:mm en minutes
 */
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

/**
 * Convertir minutes en HH:mm
 */
const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Créer un rendez-vous
 */
export const createAppointment = async (data: CreateAppointmentData) => {
  /*
  ============================
  Vérification Client
  ============================
  */

  const client = await Client.findOne({
    _id: data.client,
    isDeleted: false,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client introuvable ou désactivé");
  }

  /*
  ============================
  Vérification Employee
  ============================
  */

  const employee = await User.findOne({
    _id: data.employee,
    role: "employee",
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employé introuvable ou désactivé");
  }

  /*
  ============================
  Récupération services
  ============================
  */

  const services = await Service.find({
    _id: {
      $in: data.services,
    },
    isDeleted: false,
    isActive: true,
  });

  if (services.length !== data.services.length) {
    throw new Error("Un ou plusieurs services sont invalides");
  }

  /*
  ============================
  Snapshot services
  ============================
  */

  const serviceSnapshot = services.map((service) => ({
    service: service._id,

    name: service.name,

    price: service.price,

    duration: service.duration,
  }));

  /*
  ============================
  Calcul durée + prix
  ============================
  */

  const totalDuration = services.reduce(
    (total, service) => total + service.duration,
    0,
  );

  const estimatedPrice = services.reduce(
    (total, service) => total + service.price,
    0,
  );

  /*
  ============================
  Calcul heure fin
  ============================
  */

  const startMinutes = timeToMinutes(data.startTime);

  const endMinutes = startMinutes + totalDuration;

  const endTime = minutesToTime(endMinutes);

  /*
  ============================
  Vérification conflit
  ============================
  */

  const existingAppointment = await Appointment.findOne({
    employee: data.employee,

    date: data.date,

    status: {
      $in: ["pending", "confirmed"],
    },

    $or: [
      {
        startTime: {
          $lt: endTime,
        },

        endTime: {
          $gt: data.startTime,
        },
      },
    ],
  });

  if (existingAppointment) {
    throw new Error("Cet employé a déjà un rendez-vous sur ce créneau");
  }

  /*
  ============================
  Création RDV
  ============================
  */

  const appointment = await Appointment.create({
    client: data.client,

    employee: data.employee,

    services: serviceSnapshot,

    date: data.date,

    startTime: data.startTime,

    endTime,

    totalDuration,

    estimatedPrice,

    status: "pending",

    source: data.source || "admin",

    notes: data.notes,

    createdBy: data.createdBy,
  });

  return appointment;
};

/**
 * Liste des rendez-vous
 */
export const getAppointments = async (filter: any = {}) => {
  return Appointment.find(filter)
    .populate("client", "firstName lastName phone")
    .populate("employee", "firstName lastName speciality")
    .sort({
      date: 1,
      startTime: 1,
    });
};

/**
 * Trouver un rendez-vous
 */
export const getAppointmentById = async (id: string) => {
  return Appointment.findById(id).populate("client").populate("employee");
};

/**
 * Modifier un rendez-vous
 */
export const updateAppointment = async (id: string, data: any) => {
  return Appointment.findByIdAndUpdate(id, data, {
    new: true,
  });
};

/**
 * Annuler un rendez-vous
 */
export const cancelAppointment = async (id: string, userId: string) => {
  return Appointment.findByIdAndUpdate(
    id,

    {
      status: "cancelled",

      cancelledBy: userId,

      cancelledAt: new Date(),
    },

    {
      new: true,
    },
  );
};
