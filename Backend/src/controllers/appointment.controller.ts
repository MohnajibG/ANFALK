import { Request, Response } from "express";

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} from "../services/appointment.service";

/**
 * Créer un rendez-vous
 */
export const createAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointment = await createAppointment({
      ...req.body,

      createdBy: (req as any).user._id,
    });

    res.status(201).json({
      success: true,

      appointment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Liste rendez-vous
 */
export const getAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointments = await getAppointments(req.query);

    res.json({
      success: true,

      appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Récupérer un rendez-vous
 */
export const getAppointmentByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointment = await getAppointmentById(req.params.id as string);

    if (!appointment) {
      return res.status(404).json({
        success: false,

        message: "Rendez-vous introuvable",
      });
    }

    res.json({
      success: true,

      appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Modifier rendez-vous
 */
export const updateAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointment = await updateAppointment(
      req.params.id as string,

      {
        ...req.body,

        updatedBy: (req as any).user._id,
      },
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,

        message: "Rendez-vous introuvable",
      });
    }

    res.json({
      success: true,

      appointment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Annuler rendez-vous
 */
export const cancelAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointment = await cancelAppointment(
      req.params.id as string,

      (req as any).user._id,
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,

        message: "Rendez-vous introuvable",
      });
    }

    res.json({
      success: true,

      appointment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};
