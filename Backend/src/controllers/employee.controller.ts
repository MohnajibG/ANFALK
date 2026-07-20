import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  getAdminDashboard,
  getCashierDashboard,
  getEmployeeDashboard,
} from "../services/dashboard.service";

/**
 * Dashboard selon le rôle utilisateur
 */
export const getDashboardController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
    }

    let dashboard;

    switch (user.role) {
      case "admin":
        dashboard = await getAdminDashboard();

        break;

      case "cashier":
        dashboard = await getCashierDashboard(user.id);

        break;

      case "employee":
        dashboard = await getEmployeeDashboard(user.id);

        break;

      default:
        return res.status(403).json({
          success: false,
          message: "Rôle non autorisé",
        });
    }

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Erreur serveur",
    });
  }
};
