import Waitlist from "../models/Waitlist";
import Client from "../models/Client";
import Service from "../models/Service";
import { createAppointment } from "./appointment.service";

interface CreateWaitlistEntryData {
  client: string;
  services: string[];
  employee?: string;
  desiredDateFrom: Date;
  desiredDateTo?: Date;
  notes?: string;
  createdBy: string;
}

export const createWaitlistEntry = async (data: CreateWaitlistEntryData) => {
  const client = await Client.findOne({
    _id: data.client,
    isDeleted: false,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client introuvable ou désactivé");
  }

  const services = await Service.find({
    _id: { $in: data.services },
    isDeleted: false,
    isActive: true,
  });

  if (services.length !== data.services.length) {
    throw new Error("Service invalide");
  }

  return Waitlist.create({
    client: data.client,
    services: data.services,
    employee: data.employee,
    desiredDateFrom: data.desiredDateFrom,
    desiredDateTo: data.desiredDateTo,
    notes: data.notes,
    status: "waiting",
    createdBy: data.createdBy,
  });
};

export const getWaitlist = async (filter: { status?: string } = {}) => {
  const query: Record<string, unknown> = {};

  if (filter.status) query.status = filter.status;

  return Waitlist.find(query)
    .populate("client", "firstName lastName phone")
    .populate("services", "name price duration")
    .populate("employee", "firstName lastName speciality")
    .sort({ createdAt: 1 });
};

interface FindMatchesParams {
  employeeId?: string;
  date: Date;
  serviceIds: string[];
}

export const findMatchesForSlot = async ({
  employeeId,
  date,
  serviceIds,
}: FindMatchesParams) => {
  const entries = await Waitlist.find({
    status: "waiting",
    services: { $in: serviceIds },
    desiredDateFrom: { $lte: date },
    $or: [
      { desiredDateTo: { $exists: false } },
      { desiredDateTo: { $gte: date } },
    ],
    ...(employeeId && {
      $and: [{ $or: [{ employee: { $exists: false } }, { employee: employeeId }] }],
    }),
  })
    .populate("client", "firstName lastName phone")
    .populate("services", "name price duration")
    .sort({ createdAt: 1 });

  return entries;
};

interface ConvertWaitlistData {
  services: { service: string; employee: string }[];
  date: Date;
  startTime: string;
  source?: "admin" | "cashier" | "online";
  notes?: string;
  createdBy: string;
}

export const convertWaitlistEntry = async (
  waitlistId: string,
  appointmentData: ConvertWaitlistData,
) => {
  const entry = await Waitlist.findById(waitlistId);

  if (!entry) {
    throw new Error("Entrée de liste d'attente introuvable");
  }

  if (entry.status !== "waiting") {
    throw new Error("Cette entrée n'est plus en attente");
  }

  const appointment = await createAppointment({
    client: entry.client.toString(),
    services: appointmentData.services,
    date: appointmentData.date,
    startTime: appointmentData.startTime,
    source: appointmentData.source,
    notes: appointmentData.notes,
    createdBy: appointmentData.createdBy,
  });

  entry.status = "matched";
  entry.matchedAppointment = appointment._id as any;

  await entry.save();

  return appointment;
};

export const cancelWaitlistEntry = async (id: string) => {
  const entry = await Waitlist.findById(id);

  if (!entry) {
    throw new Error("Entrée de liste d'attente introuvable");
  }

  entry.status = "cancelled";

  await entry.save();

  return entry;
};
