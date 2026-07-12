import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/hash";

/**
 * GET /employees
 */
export const getEmployees = async (_req: Request, res: Response) => {
  try {
    const employees = await User.find({
      role: { $in: ["employee", "cashier"] },
    }).select("-password");

    return res.json(employees);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * GET /employees/:id
 */
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.json(employee);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * POST /employees
 * Admin creates employee/cashier
 */
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, role, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const employee = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      mustChangePassword: true,
    });

    return res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * PUT /employees/:id
 */
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.json({
      message: "Employee updated",
      employee,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * PATCH /employees/:id/status
 */
export const toggleEmployeeStatus = async (req: Request, res: Response) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.isActive = !employee.isActive;

    await employee.save();

    return res.json({
      message: "Status updated",
      employee,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * PATCH /employees/:id/reset-password
 */
export const resetEmployeePassword = async (req: Request, res: Response) => {
  try {
    const { temporaryPassword } = req.body;

    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.password = await hashPassword(temporaryPassword);

    employee.mustChangePassword = true;

    await employee.save();

    return res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
