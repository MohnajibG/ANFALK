import { Router } from "express";

import {
  createEmployeeController,
  getEmployeesController,
  getMyEmployeeController,
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
 *
 * Créer un employee ou cashier
 *
 * Admin uniquement
 */
router.post("/", authorize("admin"), createEmployeeController);

/**
 * GET /api/employees
 *
 * Liste des employés
 *
 * Accessible :
 * - Admin
 * - Cashier
 */
router.get("/", authorize("admin", "cashier"), getEmployeesController);

/**
 * GET /api/employees/me
 *
 * Profil utilisateur employé connecté
 *
 * Employee uniquement
 */
router.get("/me", authorize("employee"), getMyEmployeeController);

/**
 * GET /api/employees/:id
 *
 * Détail employé
 *
 * Accessible :
 * - Admin
 * - Cashier
 */
router.get("/:id", authorize("admin", "cashier"), getEmployeeByIdController);

/**
 * PATCH /api/employees/:id
 *
 * Modifier un employé
 *
 * Admin uniquement
 */
router.patch("/:id", authorize("admin"), updateEmployeeController);

/**
 * PATCH /api/employees/:id/status
 *
 * Activer / désactiver un employé
 *
 * Admin uniquement
 */
router.patch("/:id/status", authorize("admin"), updateEmployeeStatusController);

/**
 * DELETE /api/employees/:id
 *
 * Supprimer un employé
 *
 * Admin uniquement
 */
router.delete("/:id", authorize("admin"), deleteEmployeeController);

export default router;
