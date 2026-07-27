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

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Création rendez-vous
 */
export const createAppointment = async (data: CreateAppointmentData) => {
  const client = await Client.findOne({
    _id: data.client,
    isDeleted: false,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client introuvable ou désactivé");
  }

  const serviceIds = data.services.map((item) => item.service);

  const services = await Service.find({
    _id: {
      $in: serviceIds,
    },
    isDeleted: false,
    isActive: true,
  });

  if (services.length !== data.services.length) {
    throw new Error("Service invalide");
  }

  const employeeIds = data.services.map((item) => item.employee);

  const employees = await User.find({
    _id: {
      $in: employeeIds,
    },
    role: "employee",
    isActive: true,
  });

  if (employees.length !== new Set(employeeIds).size) {
    throw new Error("Employé invalide");
  }

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

  const totalDuration = serviceSnapshot.reduce(
    (total, item) => total + item.duration,
    0,
  );

  const estimatedPrice = serviceSnapshot.reduce(
    (total, item) => total + item.price,
    0,
  );

  const endTime = minutesToTime(timeToMinutes(data.startTime) + totalDuration);

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
      throw new Error("Employé déjà occupé sur ce créneau");
    }
  }

  return Appointment.create({
    client: data.client,

    services: serviceSnapshot,

    date: data.date,

    startTime: data.startTime,

    endTime,

    totalDuration,

    estimatedPrice,

    status: "pending",

    source: data.source ?? "admin",

    notes: data.notes,

    createdBy: data.createdBy,
  });
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
 * Détail rendez-vous
 */
export const getAppointmentById = async (id: string) => {
  return Appointment.findById(id)
    .populate("client")
    .populate("services.employee");
};

/**
 * Modification
 */
export const updateAppointment = async (id: string, data: any) => {
  return Appointment.findByIdAndUpdate(id, data, {
    new: true,
  });
};

/**
 * Annulation
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

/**
 * Fin prestation
 */
export const completeAppointment = async (id: string, userId: string) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  appointment.status = "waiting_payment";

  appointment.updatedBy = userId as any;

  await appointment.save();

  return appointment;
};

/**
 * Paiement
 */
export const payAppointment = async (id: string, userId: string) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  if (appointment.status !== "waiting_payment") {
    throw new Error("Rendez-vous non disponible pour paiement");
  }

  appointment.status = "paid";

  appointment.updatedBy = userId as any;

  await appointment.save();

  return appointment;
};
