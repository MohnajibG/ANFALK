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

// Protection globale
// Toutes les routes employees nécessitent un admin connecté
router.use(authenticate);
router.use(authorize("admin"));

/**
 * @route   POST /api/employees
 * @desc    Créer un employee ou cashier
 * @access  Admin
 */
router.post("/", createEmployeeController);

/**
 * @route   GET /api/employees
 * @desc    Récupérer tous les employees/cashiers
 * @access  Admin
 */
router.get("/", getEmployeesController);

/**
 * @route   GET /api/employees/:id
 * @desc    Récupérer un employee par ID
 * @access  Admin
 */
router.get("/:id", getEmployeeByIdController);

/**
 * @route   PATCH /api/employees/:id
 * @desc    Modifier un employee
 * @access  Admin
 */
router.patch("/:id", updateEmployeeController);

/**
 * @route   PATCH /api/employees/:id/status
 * @desc    Activer / désactiver un employee
 * @access  Admin
 */
router.patch("/:id/status", updateEmployeeStatusController);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Supprimer un employee
 * @access  Admin
 */
router.delete("/:id", deleteEmployeeController);

export default router;
