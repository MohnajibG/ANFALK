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
 * Protection globale
 * Toutes les routes employees :
 * - nécessitent un JWT valide
 * - nécessitent le rôle ADMIN
 */
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
 * @desc    Liste des employees et cashiers actifs
 * @access  Admin
 */
router.get("/", getEmployeesController);

/**
 * @route   GET /api/employees/:id
 * @desc    Récupérer un employee/cashier par ID
 * @access  Admin
 */
router.get("/:id", getEmployeeByIdController);

/**
 * @route   PATCH /api/employees/:id
 * @desc    Modifier un employee/cashier
 * @access  Admin
 */
router.patch("/:id", updateEmployeeController);

/**
 * @route   PATCH /api/employees/:id/status
 * @desc    Activer ou désactiver un employee/cashier
 * @access  Admin
 */
router.patch("/:id/status", updateEmployeeStatusController);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Suppression logique employee/cashier
 * @access  Admin
 */
router.delete("/:id", deleteEmployeeController);

export default router;
