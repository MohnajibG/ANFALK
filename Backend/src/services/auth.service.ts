import User from "../models/User";
import { hashPassword } from "../utils/hash";
import { Types } from "mongoose";

import type { UserRole, Speciality } from "../models/User";

interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  role: "employee" | "cashier";

  speciality?: Speciality;
}

interface UpdateEmployeeData {
  firstName?: string;
  lastName?: string;
  phone?: string;

  role?: UserRole;

  speciality?: Speciality;
}

/**
 * Créer un employé ou caissier
 */
export const createEmployee = async (
  adminId: string,
  data: CreateEmployeeData,
) => {
  const existingUser = await User.findOne({
    email: data.email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Mot de passe temporaire
  const temporaryPassword = "Temp1234!";

  const hashedPassword = await hashPassword(temporaryPassword);

  const employee = await User.create({
    firstName: data.firstName,

    lastName: data.lastName,

    email: data.email.toLowerCase(),

    phone: data.phone ?? "",

    password: hashedPassword,

    role: data.role,

    speciality: data.speciality,

    mustChangePassword: true,

    isActive: true,

    createdBy: new Types.ObjectId(adminId),
  });

  return {
    employee: {
      id: employee.id,

      firstName: employee.firstName,

      lastName: employee.lastName,

      email: employee.email,

      phone: employee.phone,

      role: employee.role,

      speciality: employee.speciality,

      mustChangePassword: employee.mustChangePassword,
    },

    temporaryPassword,
  };
};

/**
 * Liste des employés
 */
export const getEmployees = async () => {
  return await User.find({
    role: {
      $in: ["employee", "cashier"],
    },
  })
    .select("-password")
    .populate("createdBy", "firstName lastName email");
};

/**
 * Récupérer un employé
 */
export const getEmployeeById = async (id: string) => {
  const employee = await User.findOne({
    _id: id,

    role: {
      $in: ["employee", "cashier"],
    },
  })
    .select("-password")
    .populate("createdBy", "firstName lastName");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

/**
 * Modifier un employé
 */
export const updateEmployee = async (id: string, data: UpdateEmployeeData) => {
  const employee = await User.findOneAndUpdate(
    {
      _id: id,

      role: {
        $in: ["employee", "cashier"],
      },
    },

    {
      $set: data,
    },

    {
      new: true,
    },
  ).select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

/**
 * Activer / désactiver un employé
 */
export const updateEmployeeStatus = async (id: string, isActive: boolean) => {
  const employee = await User.findOneAndUpdate(
    {
      _id: id,
    },

    {
      isActive,
    },

    {
      new: true,
    },
  ).select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

/**
 * Suppression logique
 */
export const deleteEmployee = async (id: string) => {
  const employee = await User.findByIdAndUpdate(
    id,

    {
      isActive: false,
    },

    {
      new: true,
    },
  ).select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};
