import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
} from "../services/employee.service";

/**
 * POST /api/employees
 * Créer un employee ou cashier
 */
export const createEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await createEmployee(req.body, adminId);

    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/employees
 */
export const getEmployeesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employees = await getEmployees();

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/employees/:id
 */
export const getEmployeeByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await getEmployeeById(req.params.id as string);

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /api/employees/:id
 */
export const updateEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await updateEmployee(req.params.id as string, req.body);

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /api/employees/:id/status
 */
export const updateEmployeeStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be boolean",
      });
    }

    const employee = await updateEmployeeStatus(
      req.params.id as string,
      isActive,
    );

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * DELETE /api/employees/:id
 */
export const deleteEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const employee = await deleteEmployee(req.params.id as string, adminId);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      employee,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
