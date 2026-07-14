import { Request, Response } from "express";

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
export const createTicketController = async (req: Request, res: Response) => {
  try {
    const ticket = await createTicket({
      ...req.body,

      createdBy: (req as any).user._id,
    });

    res.status(201).json({
      success: true,

      ticket,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Liste tickets
 */
export const getTicketsController = async (req: Request, res: Response) => {
  try {
    const tickets = await getTickets(req.query);

    res.json({
      success: true,

      tickets,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Détail ticket
 */
export const getTicketByIdController = async (req: Request, res: Response) => {
  try {
    const ticket = await getTicketById(req.params.id as string);

    if (!ticket) {
      return res.status(404).json({
        success: false,

        message: "Ticket introuvable",
      });
    }

    res.json({
      success: true,

      ticket,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Annuler ticket
 */
export const cancelTicketController = async (req: Request, res: Response) => {
  try {
    const ticket = await cancelTicket(
      req.params.id as string,

      (req as any).user._id,
    );

    res.json({
      success: true,

      ticket,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};
/**
 * Terminer rendez-vous + créer ticket
 */
export const completeAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const ticket = await completeAppointmentFromTicket({
      ...req.body,

      appointment: req.params.id as string,

      createdBy: (req as any).user._id,
    });

    res.status(201).json({
      success: true,

      ticket,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};
