import Appointment from "../models/Appointment";
import Client from "../models/Client";
import User from "../models/User";
import Service from "../models/Service";

interface CreateAppointmentData {
  client: string;

  services: {
    service: string;
    employee: string;
  }[];

  date: Date;

  startTime: string;

  source?: "admin" | "cashier" | "online";

  notes?: string;

  createdBy: string;
}

/**
 * Convertir HH:mm en minutes
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
  Récupération services + employés
  ============================
  */

  const serviceIds = data.services.map((item) => item.service);

  const services = await Service.find({
    _id: {
      $in: serviceIds,
    },

    isDeleted: false,

    isActive: true,
  });

  if (services.length !== data.services.length) {
    throw new Error("Un ou plusieurs services sont invalides");
  }

  /*
  ============================
  Vérification employés
  ============================
  */

  const employeeIds = data.services.map((item) => item.employee);

  const employees = await User.find({
    _id: {
      $in: employeeIds,
    },

    role: "employee",

    isActive: true,
  });

  if (employees.length !== new Set(employeeIds).size) {
    throw new Error("Un ou plusieurs employés sont invalides");
  }

  /*
  ============================
  Création snapshot
  ============================
  */

  const serviceSnapshot = data.services.map((item) => {
    const service = services.find((s) => s._id.toString() === item.service);

    if (!service) {
      throw new Error("Service introuvable");
    }

    return {
      service: service._id,

      employee: item.employee,

      name: service.name,

      price: service.price,

      duration: service.duration,
    };
  });

  /*
  ============================
  Calcul durée/prix
  ============================
  */

  const totalDuration = serviceSnapshot.reduce(
    (total, item) => total + item.duration,
    0,
  );

  const estimatedPrice = serviceSnapshot.reduce(
    (total, item) => total + item.price,
    0,
  );

  /*
  ============================
  Heure fin
  ============================
  */

  const startMinutes = timeToMinutes(data.startTime);

  const endTime = minutesToTime(startMinutes + totalDuration);

  /*
  ============================
  Vérification conflits employés
  ============================
  */

  for (const item of serviceSnapshot) {
    const conflict = await Appointment.findOne({
      "services.employee": item.employee,

      date: data.date,

      status: {
        $in: ["pending", "confirmed", "in_progress"],
      },

      startTime: {
        $lt: endTime,
      },

      endTime: {
        $gt: data.startTime,
      },
    });

    if (conflict) {
      throw new Error("Un employé possède déjà un rendez-vous sur ce créneau");
    }
  }

  /*
  ============================
  Création RDV
  ============================
  */

  const appointment = await Appointment.create({
    client: data.client,

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
 * Liste rendez-vous
 */
export const getAppointments = async (filter: any = {}) => {
  return Appointment.find(filter)

    .populate("client", "firstName lastName phone")

    .populate("services.employee", "firstName lastName speciality")

    .sort({
      date: 1,
      startTime: 1,
    });
};

/**
 * Trouver un rendez-vous
 */
export const getAppointmentById = async (id: string) => {
  return Appointment.findById(id)

    .populate("client")

    .populate("services.employee");
};

/**
 * Modifier rendez-vous
 */
export const updateAppointment = async (id: string, data: any) => {
  return Appointment.findByIdAndUpdate(id, data, {
    new: true,
  });
};

/**
 * Annuler rendez-vous
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
