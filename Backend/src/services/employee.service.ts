import mongoose from "mongoose";

import User, { UserRole, Speciality } from "../models/User";

import { hashPassword } from "../utils/hash";

interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  speciality?: Speciality;
}

interface UpdateEmployeeData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  speciality?: Speciality;
}

const allowedRoles = ["employee", "cashier"] as const;

const allowedSpecialities = [
  "Hair",
  "Nails",
  "Makeup",
  "Massage",
  "Reception",
] as const;

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-8) + "!";
};

const validateEmployeeRole = (role: string) => {
  if (!allowedRoles.includes(role as any)) {
    throw new Error("Invalid employee role");
  }
};

const validateSpeciality = (role: UserRole, speciality?: Speciality) => {
  // Employee obligatoire
  if (role === "employee" && !speciality) {
    throw new Error("La spécialité est obligatoire pour un employé");
  }

  // Cashier interdit
  if (role === "cashier" && speciality) {
    throw new Error("Un caissier ne peut pas avoir de spécialité");
  }

  if (speciality && !allowedSpecialities.includes(speciality as any)) {
    throw new Error("Invalid speciality");
  }
};

/**
 * Création employee/cashier
 */
export const createEmployee = async (
  data: CreateEmployeeData,
  adminId: string,
) => {
  const firstName = data.firstName.trim();

  const lastName = data.lastName.trim();

  const email = data.email.trim().toLowerCase();

  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  validateEmployeeRole(data.role);

  validateSpeciality(data.role, data.speciality);

  const existingUser = await User.findOne({
    email,
    isDeleted: false,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const temporaryPassword = generateTemporaryPassword();

  const hashedPassword = await hashPassword(temporaryPassword);

  const employee = await User.create({
    firstName,

    lastName,

    email,

    phone: data.phone?.trim() ?? "",

    password: hashedPassword,

    role: data.role,

    speciality: data.role === "employee" ? data.speciality : undefined,

    mustChangePassword: true,

    isActive: true,

    createdBy: adminId,
  });

  return {
    employee: {
      id: employee.id,

      firstName: employee.firstName,

      lastName: employee.lastName,

      email: employee.email,

      role: employee.role,

      speciality: employee.speciality,

      mustChangePassword: employee.mustChangePassword,
    },

    temporaryPassword,
  };
};

/**
 * Liste employés
 */
export const getEmployees = async () => {
  return User.find({
    role: {
      $in: ["employee", "cashier"],
    },

    isDeleted: false,
  })

    .select("-password")

    .sort({
      createdAt: -1,
    });
};

/**
 * Détail employé
 */
export const getEmployeeById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid employee id");
  }

  const employee = await User.findOne({
    _id: id,

    isDeleted: false,

    role: {
      $in: ["employee", "cashier"],
    },
  })

    .select("-password")

    .populate("createdBy", "firstName lastName email");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

/**
 * Modification employé
 */
export const updateEmployee = async (id: string, data: UpdateEmployeeData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid employee id");
  }

  const employee = await User.findOne({
    _id: id,

    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.role === "admin") {
    throw new Error("Cannot update admin");
  }

  const newRole = data.role ?? employee.role;

  const newSpeciality = data.speciality ?? employee.speciality;

  validateEmployeeRole(newRole);

  validateSpeciality(newRole, newSpeciality);

  if (data.firstName) {
    employee.firstName = data.firstName.trim();
  }

  if (data.lastName) {
    employee.lastName = data.lastName.trim();
  }

  if (data.phone !== undefined) {
    employee.phone = data.phone.trim();
  }

  employee.role = newRole;

  employee.speciality = newRole === "employee" ? newSpeciality : undefined;

  await employee.save();

  return employee;
};

/**
 * Activation / désactivation
 */
export const updateEmployeeStatus = async (id: string, isActive: boolean) => {
  const employee = await User.findOne({
    _id: id,

    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.role === "admin") {
    throw new Error("Cannot disable admin");
  }

  employee.isActive = isActive;

  await employee.save();

  return employee;
};

/**
 * Suppression logique
 */
export const deleteEmployee = async (id: string, adminId: string) => {
  const employee = await User.findOne({
    _id: id,

    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.role === "admin") {
    throw new Error("Cannot delete admin");
  }

  employee.isDeleted = true;

  employee.isActive = false;

  employee.deletedAt = new Date();

  employee.deletedBy = adminId as any;

  await employee.save();

  return employee;
};
