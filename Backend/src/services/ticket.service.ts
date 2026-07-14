import mongoose from "mongoose";

import Ticket from "../models/Ticket";
import Client from "../models/Client";
import User from "../models/User";
import Service from "../models/Service";

import Appointment from "../models/Appointment";

interface CreateTicketData {
  client: string;

  employee: string;

  appointment?: string;

  services: {
    service: string;
    finalPrice: number;
  }[];

  discount?: number;

  paymentMethod: "cash" | "card" | "transfer";

  notes?: string;

  createdBy: string;
}

/**
 * Génération numéro ticket
 */
const generateTicketNumber = async () => {
  const count = await Ticket.countDocuments();

  const number = (count + 1).toString().padStart(6, "0");

  const year = new Date().getFullYear();

  return `AK-${year}-${number}`;
};

/**
 * Création ticket caisse
 */
export const createTicket = async (data: CreateTicketData) => {
  /*
==============================
Vérification client
==============================
*/

  const client = await Client.findOne({
    _id: data.client,

    isDeleted: false,

    isActive: true,
  });

  if (!client) {
    throw new Error("Client introuvable");
  }

  /*
==============================
Vérification employee
==============================
*/

  const employee = await User.findOne({
    _id: data.employee,

    role: "employee",

    isActive: true,
  });

  if (!employee) {
    throw new Error("Employé introuvable");
  }

  /*
==============================
Services snapshot
==============================
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
    throw new Error("Service invalide");
  }

  const items = services.map((service) => {
    const custom = data.services.find(
      (item) => item.service.toString() === service._id.toString(),
    );

    return {
      service: service._id,

      name: service.name,

      originalPrice: service.price,

      finalPrice: custom?.finalPrice ?? service.price,

      duration: service.duration,
    };
  });

  /*
==============================
Calcul montant
==============================
*/

  const subtotal = items.reduce(
    (total, item) => total + item.finalPrice,

    0,
  );

  const discount = data.discount || 0;

  const total = Math.max(subtotal - discount, 0);

  /*
==============================
Créer ticket
==============================
*/

  const ticketNumber = await generateTicketNumber();

  const ticket = await Ticket.create({
    ticketNumber,

    client: data.client,

    employee: data.employee,

    appointment: data.appointment,

    items,

    subtotal,

    discount,

    total,

    paymentMethod: data.paymentMethod,

    notes: data.notes,

    status: "paid",

    createdBy: data.createdBy,
  });

  /*
==============================
Mise à jour fidélité client
==============================
*/

  const points = Math.floor(total / 100);

  await Client.findByIdAndUpdate(
    client._id,

    {
      $inc: {
        loyaltyPoints: points,

        totalSpent: total,

        visitCount: 1,
      },

      lastVisit: new Date(),
    },
  );

  return ticket;
};

/**
 * Liste tickets
 */
export const getTickets = async (filter: any = {}) => {
  return Ticket.find(filter)

    .populate("client", "firstName lastName phone")

    .populate("employee", "firstName lastName")

    .sort({
      createdAt: -1,
    });
};

/**
 * Ticket par ID
 */
export const getTicketById = async (id: string) => {
  return Ticket.findById(id)

    .populate("client")

    .populate("employee")

    .populate("items.service");
};

/**
 * Annuler ticket
 */
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
    await Client.findByIdAndUpdate(
      client._id,

      {
        $inc: {
          totalSpent: -ticket.total,

          visitCount: -1,

          loyaltyPoints: -Math.floor(ticket.total / 100),
        },
      },
    );
  }

  ticket.status = "cancelled";

  ticket.cancelledBy = new mongoose.Types.ObjectId(userId);
  ticket.cancelledAt = new Date();

  await ticket.save();

  return ticket;
};

/**
 * Créer un ticket depuis un rendez-vous terminé
 */
export const completeAppointmentFromTicket = async (
  data: CreateTicketData & {
    appointment: string;
  },
) => {
  /*
==============================
Vérifier appointment
==============================
*/

  const appointment = await Appointment.findById(data.appointment);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  if (appointment.status === "cancelled") {
    throw new Error("Impossible de facturer un rendez-vous annulé");
  }

  /*
==============================
Créer ticket
==============================
*/

  const ticket = await createTicket(data);

  /*
==============================
Mettre appointment terminé
==============================
*/

  appointment.status = "completed";

  await appointment.save();

  return ticket;
};
