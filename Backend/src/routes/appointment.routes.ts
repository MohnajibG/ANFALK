import { Router } from "express";

import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  cancelAppointmentController,
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
Modification
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
