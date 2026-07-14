import Service from "../models/Service";
import User from "../models/User";
import Appointment from "../models/Appointment";
import Client from "../models/Client";

interface CreateOnlineAppointmentData {
  client: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };

  employee: string;

  services: string[];

  date: Date;

  startTime: string;
}

/**
 * Services disponibles publiquement
 */
export const getPublicServices = async () => {
  return Service.find({
    isActive: true,

    isDeleted: false,

    isBookable: true,
  })

    .select("name description price duration")

    .sort({
      name: 1,
    });
};

/**
 * Employés disponibles
 */
export const getPublicEmployees = async () => {
  return User.find({
    role: "employee",

    isActive: true,
  })

    .select("firstName lastName speciality")

    .sort({
      firstName: 1,
    });
};

/**
 * Conversion heure -> minutes
 */
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

/**
 * Conversion minutes -> heure
 */
const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);

  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Disponibilité employé
 */
export const getAvailability = async (employeeId: string, date: Date) => {
  const appointments = await Appointment.find({
    employee: employeeId,

    date,

    status: {
      $in: ["pending", "confirmed"],
    },
  });

  const workingSlots: string[] = [];

  /*
Horaire institut :

09:00 -> 18:00

Créneau 30 minutes
*/

  for (let minutes = 540; minutes <= 1080; minutes += 30) {
    const time = minutesToTime(minutes);

    const occupied = appointments.some((appointment) => {
      const start = timeToMinutes(appointment.startTime);

      const end = timeToMinutes(appointment.endTime);

      const current = timeToMinutes(time);

      return current >= start && current < end;
    });

    if (!occupied) {
      workingSlots.push(time);
    }
  }

  return workingSlots;
};

/**
 * Création réservation online
 */
export const createOnlineAppointment = async (
  data: CreateOnlineAppointmentData,
) => {
  /*
================================
Créer ou retrouver client
================================
*/

  let client = await Client.findOne({
    phone: data.client.phone,

    isDeleted: false,
  });

  if (!client) {
    client = await Client.create({
      firstName: data.client.firstName,

      lastName: data.client.lastName,

      phone: data.client.phone,

      email: data.client.email,

      isActive: true,

      isDeleted: false,

      createdBy: process.env.SYSTEM_USER_ID,
    });
  }

  /*
================================
Vérifier employé
================================
*/

  const employee = await User.findOne({
    _id: data.employee,

    role: "employee",

    isActive: true,
  });

  if (!employee) {
    throw new Error("Employé indisponible");
  }

  /*
================================
Services
================================
*/

  const services = await Service.find({
    _id: {
      $in: data.services,
    },

    isActive: true,

    isDeleted: false,
  });

  if (services.length !== data.services.length) {
    throw new Error("Service invalide");
  }

  /*
================================
Calcul durée
================================
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
================================
Calcul heure fin
================================
*/

  const endMinutes = timeToMinutes(data.startTime) + totalDuration;

  const endTime = minutesToTime(endMinutes);

  /*
================================
Création appointment
================================
*/

  const appointment = await Appointment.create({
    client: client._id,

    employee: data.employee,

    services: services.map((service) => ({
      service: service._id,

      name: service.name,

      price: service.price,

      duration: service.duration,
    })),

    date: data.date,

    startTime: data.startTime,

    endTime,

    totalDuration,

    estimatedPrice,

    status: "pending",

    source: "online",
  });

  return appointment;
};
