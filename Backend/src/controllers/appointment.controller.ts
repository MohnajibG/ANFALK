import { Response } from "express";

import { AuthRequest } from "../types/auth";
import User from "../models/User";

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
  payAppointment,
} from "../services/appointment.service";

import Appointment from "../models/Appointment";

/**
 * Création
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
 * Liste
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
 * Détail
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
 * Modification
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
 * Annulation
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
 * Fin prestation
 * Passage caisse
 */
export const completeAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await completeAppointment(
      req.params.id as string,
      req.user!.id,
    );

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
 * Liste POS attente paiement
 */
export const getWaitingPaymentAppointmentsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointments = await Appointment.find({
      status: "waiting_payment",
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

/**
 * Paiement POS
 */
export const payAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await payAppointment(
      req.params.id as string,
      req.user!.id,
    );

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
export const getMyEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await User.findById(req.user?.id).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employé introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("GET MY EMPLOYEE ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
