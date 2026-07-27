import { Router } from "express";

import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  cancelAppointmentController,
  completeAppointmentController,
  getWaitingPaymentAppointmentsController,
  payAppointmentController,
} from "../controllers/appointment.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

/**
 * Création rendez-vous
 */
router.post(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  createAppointmentController,
);

/**
 * Liste rendez-vous
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  getAppointmentsController,
);

/**
 * Rendez-vous en attente paiement POS
 */
router.get(
  "/waiting-payment",
  authenticate,
  authorize("admin", "cashier"),
  getWaitingPaymentAppointmentsController,
);

/**
 * Paiement rendez-vous POS
 */
router.patch(
  "/:id/pay",
  authenticate,
  authorize("admin", "cashier"),
  payAppointmentController,
);

/**
 * Fin prestation employé
 */
router.patch(
  "/:id/complete",
  authenticate,
  authorize("employee", "admin"),
  completeAppointmentController,
);

/**
 * Annulation
 */
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("admin", "cashier"),
  cancelAppointmentController,
);

/**
 * Modification
 */
router.patch(
  "/:id",
  authenticate,
  authorize("admin", "cashier"),
  updateAppointmentController,
);

/**
 * Détail rendez-vous
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin", "cashier", "employee"),
  getAppointmentByIdController,
);

export default router;
