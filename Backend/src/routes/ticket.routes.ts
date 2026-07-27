import { Router } from "express";

import {
  createTicketController,
  getTicketsController,
  getTicketByIdController,
  cancelTicketController,
  completeAppointmentFromTicket,
} from "../controllers/ticket.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  createTicketController,
);

router.get(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  getTicketsController,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "cashier"),
  getTicketByIdController,
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("admin"),
  cancelTicketController,
);

router.post(
  "/appointment/:id/create-ticket",
  authenticate,
  authorize("admin", "cashier"),
  completeAppointmentFromTicket,
);

export default router;
