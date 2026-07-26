import { Response } from "express";
import { AuthRequest } from "../types/auth";

import {
  createTicket,
  getTickets,
  getTicketById,
  cancelTicket,
  completeAppointmentFromTicket,
} from "../services/ticket.service";

/**
 * Créer un ticket
 */
export const createTicketController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await createTicket({
      ...req.body,
      createdBy: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Liste tickets
 */
export const getTicketsController = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await getTickets(req.query);

    return res.json({
      success: true,
      tickets,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Détail ticket
 */
export const getTicketByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await getTicketById(req.params.id as string);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket introuvable",
      });
    }

    return res.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Annuler ticket
 */
export const cancelTicketController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await cancelTicket(req.params.id as string, req.user!.id);

    return res.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Terminer rendez-vous + créer ticket
 */
export const completeAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await completeAppointmentFromTicket({
      ...req.body,
      appointment: req.params.id as string,
      createdBy: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
