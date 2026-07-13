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

// Toutes les routes employees nécessitent un admin connecté
router.use(authenticate);
router.use(authorize("admin"));

/**
 * POST /employees
 * Créer un employee ou cashier
 */
router.post("/", createEmployeeController);

/**
 * GET /employees
 * Liste des employés
 */
router.get("/", getEmployeesController);

/**
 * GET /employees/:id
 */
router.get("/:id", getEmployeeByIdController);

/**
 * PATCH /employees/:id
 * Modifier un employé
 */
router.patch("/:id", updateEmployeeController);

/**
 * PATCH /employees/:id/status
 * Activer / désactiver
 */
router.patch("/:id/status", updateEmployeeStatusController);

/**
 * DELETE /employees/:id
 */
router.delete("/:id", deleteEmployeeController);

export default router;
