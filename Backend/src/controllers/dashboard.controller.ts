import { Request, Response } from "express";

import {
  getAdminDashboard,
  getCashierDashboard,
  getEmployeeDashboard,
} from "../services/dashboard.service";

/**
 * Dashboard selon le rôle utilisateur
 */
export const getDashboardController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Utilisateur non authentifié",
      });
    }

    let dashboard;

    switch (user.role) {
      /*
==============================
ADMIN
==============================
*/

      case "admin":
        dashboard = await getAdminDashboard();

        break;

      /*
==============================
CASHIER
==============================
*/

      case "cashier":
        dashboard = await getCashierDashboard(user._id);

        break;

      /*
==============================
EMPLOYEE
==============================
*/

      case "employee":
        dashboard = await getEmployeeDashboard(user._id);

        break;

      default:
        return res.status(403).json({
          success: false,

          message: "Rôle non autorisé",
        });
    }

    res.json({
      success: true,

      dashboard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
