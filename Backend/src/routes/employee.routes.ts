import { Router } from "express";

import {
  createEmployeeController,
  getEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  updateEmployeeStatusController,
  deleteEmployeeController,
} from "../controllers/employee.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

/**
 * Toutes les routes nécessitent un JWT valide
 */
router.use(authenticate);

/**
 * POST /api/employees
 * Créer un employee ou cashier
 *
 * Admin uniquement
 */
router.post("/", authorize("admin"), createEmployeeController);

/**
 * GET /api/employees
 *
 * Utilisé par :
 * - Admin
 * - Caissier (POS)
 *
 * Exemple :
 * /api/employees?search=Sarah
 */
router.get("/", authorize("admin", "cashier"), getEmployeesController);

/**
 * GET /api/employees/:id
 *
 * Admin + Caissier
 */
router.get("/:id", authorize("admin", "cashier"), getEmployeeByIdController);

/**
 * PATCH /api/employees/:id
 *
 * Admin uniquement
 */
router.patch("/:id", authorize("admin"), updateEmployeeController);

/**
 * PATCH /api/employees/:id/status
 *
 * Admin uniquement
 */
router.patch("/:id/status", authorize("admin"), updateEmployeeStatusController);

/**
 * DELETE /api/employees/:id
 *
 * Admin uniquement
 */
router.delete("/:id", authorize("admin"), deleteEmployeeController);

export default router;
