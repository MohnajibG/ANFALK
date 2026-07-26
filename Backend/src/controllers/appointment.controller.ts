import { Response } from "express";
import { AuthRequest } from "../types/auth";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} from "../services/appointment.service";
import Appointment from "../models/Appointment";

/**
 * Créer un rendez-vous
 */
export const createAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await createAppointment({
      ...req.body,
      createdBy: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Liste des rendez-vous
 */
export const getAppointmentsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointments = await getAppointments(req.query);

    return res.json({
      success: true,
      appointments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Récupérer un rendez-vous
 */
export const getAppointmentByIdController = async (
  req: AuthRequest,
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

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Modifier un rendez-vous
 */
export const updateAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await updateAppointment(req.params.id as string, {
      ...req.body,
      updatedBy: req.user!.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous introuvable",
      });
    }

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Annuler un rendez-vous
 */
export const cancelAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await cancelAppointment(
      req.params.id as string,
      req.user!.id,
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous introuvable",
      });
    }

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Terminer un rendez-vous
 */
export const completeAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous introuvable",
      });
    }

    appointment.status = "completed";
    appointment.updatedBy = req.user!.id as any;

    await appointment.save();

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Rendez-vous en attente de paiement
 */
export const getWaitingPaymentAppointmentsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointments = await Appointment.find({
      status: "completed",
    })
      .populate("client", "firstName lastName phone")
      .populate("services.employee", "firstName lastName speciality")
      .sort({
        date: 1,
        startTime: 1,
      });

    return res.json({
      success: true,
      appointments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
