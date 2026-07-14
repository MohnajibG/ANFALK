import { Router } from "express";

import {
  createServiceController,
  getServicesController,
  getServiceByIdController,
  updateServiceController,
  updateServiceStatusController,
  deleteServiceController,
} from "../controllers/service.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

/**
 * Toutes les routes Services
 * nécessitent un administrateur connecté
 */
router.use(authenticate);
router.use(authorize("admin"));

/**
 * POST /api/services
 * Créer un service
 */
router.post("/", createServiceController);

/**
 * GET /api/services
 * Liste des services
 * Filtres disponibles :
 * ?category=
 * ?isActive=true
 * ?search=
 */
router.get("/", getServicesController);

/**
 * GET /api/services/:id
 * Détails d'un service
 */
router.get("/:id", getServiceByIdController);

/**
 * PATCH /api/services/:id
 * Modifier un service
 */
router.patch("/:id", updateServiceController);

/**
 * PATCH /api/services/:id/status
 * Activer / Désactiver un service
 */
router.patch("/:id/status", updateServiceStatusController);

/**
 * DELETE /api/services/:id
 * Suppression logique
 */
router.delete("/:id", deleteServiceController);

export default router;
