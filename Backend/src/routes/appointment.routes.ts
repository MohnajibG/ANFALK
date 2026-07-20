import { Router } from "express";

import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  cancelAppointmentController,
  completeAppointmentController,
  getWaitingPaymentAppointmentsController,
} from "../controllers/appointment.controller";

import { authenticate } from "../middlewares/auth";

import { authorize } from "../middlewares/authorize";

const router = Router();

/*
=================================
Création rendez-vous
ADMIN + CASHIER
=================================
*/

router.post(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  createAppointmentController,
);

/*
=================================
Liste rendez-vous
ADMIN + CASHIER
=================================
*/

router.get(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  getAppointmentsController,
);

/*
=================================
Tickets prêts pour la caisse
POS
ADMIN + CASHIER
=================================
*/

router.get(
  "/waiting-payment",
  authenticate,
  authorize("admin", "cashier"),
  getWaitingPaymentAppointmentsController,
);

/*
=================================
Détail rendez-vous
ADMIN + CASHIER + EMPLOYEE
=================================
*/

router.get(
  "/:id",
  authenticate,
  authorize("admin", "cashier", "employee"),
  getAppointmentByIdController,
);

/*
=================================
Modification rendez-vous
ADMIN + CASHIER
=================================
*/

router.patch(
  "/:id",
  authenticate,
  authorize("admin", "cashier"),
  updateAppointmentController,
);

/*
=================================
Validation fin prestation
EMPLOYEE
=================================
*/

router.patch(
  "/:id/complete",
  authenticate,
  authorize("employee", "admin"),
  completeAppointmentController,
);

/*
=================================
Annulation
ADMIN + CASHIER
=================================
*/

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("admin", "cashier"),
  cancelAppointmentController,
);

export default router;
