import mongoose from "mongoose";

import Ticket from "../models/Ticket";
import Client from "../models/Client";
import User from "../models/User";
import Service from "../models/Service";
import Appointment from "../models/Appointment";
import { getCurrentCashRegister } from "./cashRegister.service";

interface CreateTicketData {
  client: string;
  appointment?: string;
  items: {
    service: string;
    employee: string;
    finalPrice: number;
  }[];
  discount?: number;
  paymentMethod: "cash" | "card" | "transfer";
  notes?: string;
  createdBy: string;
}

const generateTicketNumber = async () => {
  const count = await Ticket.countDocuments();
  const number = (count + 1).toString().padStart(6, "0");
  const year = new Date().getFullYear();

  return `AK-${year}-${number}`;
};

export const createTicket = async (data: CreateTicketData) => {
  const cashRegister = await getCurrentCashRegister(data.createdBy);

  if (!cashRegister) {
    throw new Error(
      "Aucune caisse ouverte. Veuillez ouvrir votre caisse avant d'encaisser.",
    );
  }
  const client = await Client.findOne({
    _id: data.client,
    isDeleted: false,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client introuvable");
  }

  const employeeIds = data.items.map((item) => item.employee);

  const employees = await User.find({
    _id: {
      $in: employeeIds,
    },
    role: "employee",
    isActive: true,
  });

  if (employees.length !== employeeIds.length) {
    throw new Error("Employé invalide");
  }

  const serviceIds = data.items.map((item) => item.service);

  const services = await Service.find({
    _id: {
      $in: serviceIds,
    },
    isDeleted: false,
    isActive: true,
  });

  if (services.length !== serviceIds.length) {
    throw new Error("Service invalide");
  }

  const items = services.map((service) => {
    const custom = data.items.find(
      (item) => item.service.toString() === service._id.toString(),
    );

    return {
      service: service._id,

      employee: custom?.employee,

      name: service.name,

      originalPrice: service.price,

      finalPrice: custom?.finalPrice ?? service.price,

      duration: service.duration,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.finalPrice, 0);

  const discount = data.discount ?? 0;

  const total = Math.max(subtotal - discount, 0);

  const ticket = await Ticket.create({
    ticketNumber: await generateTicketNumber(),
    client: data.client,
    appointment: data.appointment,
    cashRegister: cashRegister._id,
    items,
    subtotal,
    discount,
    total,
    paymentMethod: data.paymentMethod,
    notes: data.notes,
    status: "paid",
    createdBy: data.createdBy,
  });

  await Client.findByIdAndUpdate(client._id, {
    $inc: {
      loyaltyPoints: Math.floor(total / 100),
      totalSpent: total,
      visitCount: 1,
    },
    lastVisit: new Date(),
  });

  return ticket;
};

export const getTickets = async (filter: any = {}) => {
  return Ticket.find(filter)

    .populate("client", "firstName lastName phone")

    .populate("items.employee", "firstName lastName speciality")

    .populate("items.service", "name price duration")

    .sort({
      createdAt: -1,
    });
};

export const getTicketById = async (id: string) => {
  return Ticket.findById(id)

    .populate("client")

    .populate("items.employee")

    .populate("items.service");
};

export const cancelTicket = async (id: string, userId: string) => {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new Error("Ticket introuvable");
  }

  if (ticket.status === "cancelled") {
    throw new Error("Ticket déjà annulé");
  }

  const client = await Client.findById(ticket.client);

  if (client) {
    await Client.findByIdAndUpdate(client._id, {
      $inc: {
        totalSpent: -ticket.total,
        visitCount: -1,
        loyaltyPoints: -Math.floor(ticket.total / 100),
      },
    });
  }

  ticket.status = "cancelled";

  ticket.cancelledBy = new mongoose.Types.ObjectId(userId);

  ticket.cancelledAt = new Date();

  await ticket.save();

  return ticket;
};

export const createTicketFromAppointment = async (
  data: CreateTicketData & {
    appointment: string;
  },
) => {
  const appointment = await Appointment.findById(data.appointment);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  if (appointment.status === "cancelled") {
    throw new Error("Impossible de facturer un rendez-vous annulé");
  }

  const ticket = await createTicket(data);

  appointment.status = "paid";

  await appointment.save();

  return ticket;
};
