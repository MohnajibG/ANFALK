import { Router } from "express";

import {
  openCashRegisterController,
  closeCashRegisterController,
  getCurrentCashRegisterController,
  getCashRegisterByIdController,
  getCashRegisterHistoryController,
} from "../controllers/cashRegister.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authenticate);

router.post("/open", authorize("admin", "cashier"), openCashRegisterController);
router.patch(
  "/close",
  authorize("admin", "cashier"),
  closeCashRegisterController,
);
router.get(
  "/current",
  authorize("admin", "cashier"),
  getCurrentCashRegisterController,
);
router.get("/history", authorize("admin"), getCashRegisterHistoryController);
router.get("/:id", authorize("admin"), getCashRegisterByIdController);

export default router;
