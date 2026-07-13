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
 * POST /employees
 */
export const createEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const employee = await createEmployee(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
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
 * GET /employees
 */
export const getEmployeesController = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    const employees = await getEmployees();

    return res.status(200).json({
      success: true,
      data: employees,
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
 * GET /employees/:id
 */
export const getEmployeeByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await getEmployeeById(req.params.id as string);

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /employees/:id
 */
export const updateEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await updateEmployee(req.params.id as string, req.body);

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /employees/:id/status
 */
export const updateEmployeeStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { isActive } = req.body;

    const employee = await updateEmployeeStatus(
      req.params.id as string,
      isActive,
    );

    return res.status(200).json({
      success: true,
      message: "Employee status updated",
      data: employee,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /employees/:id
 */
export const deleteEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    await deleteEmployee(req.params.id as string);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
