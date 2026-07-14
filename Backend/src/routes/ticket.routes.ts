import { Router } from "express";

import {
  createTicketController,
  getTicketsController,
  getTicketByIdController,
  cancelTicketController,
  completeAppointmentController,
} from "../controllers/ticket.controller";

import { authenticate } from "../middlewares/auth";

import { authorize } from "../middlewares/authorize";

const router = Router();

/*
=================================
Créer ticket
ADMIN + CASHIER
=================================
*/

router.post(
  "/",

  authenticate,

  authorize("admin", "cashier"),

  createTicketController,
);

/*
=================================
Historique tickets
ADMIN + CASHIER
=================================
*/

router.get(
  "/",

  authenticate,

  authorize("admin", "cashier"),

  getTicketsController,
);

/*
=================================
Détail ticket
ADMIN + CASHIER
=================================
*/

router.get(
  "/:id",

  authenticate,

  authorize("admin", "cashier"),

  getTicketByIdController,
);

/*
=================================
Annulation
ADMIN uniquement
=================================
*/

router.patch(
  "/:id/cancel",

  authenticate,

  authorize("admin"),

  cancelTicketController,
);
/*
=================================
Clôturer rendez-vous depuis ticket
ADMIN + CASHIER
=================================
*/
router.post(
  "/appointment/:id/complete",

  authenticate,

  authorize("admin", "cashier"),

  completeAppointmentController,
);
export default router;
