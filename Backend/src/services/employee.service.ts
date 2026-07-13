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

/**
 * Créer un employee/cashier
 */
export const createEmployee = async (
  data: CreateEmployeeData,
  adminId: string,
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
 * Récupérer tous les employees/cashiers
 */

export const getEmployees = async () => {
  return await User.find({
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
 * Récupérer un employee/cashier par son ID
 */

export const getEmployeeById = async (id: string) => {
  const employee = await User.findOne({
    _id: id,
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
interface UpdateEmployeeData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  speciality?: Speciality;
}

/**
 * Mettre à jour un employee/cashier
 */

export const updateEmployee = async (id: string, data: UpdateEmployeeData) => {
  const employee = await User.findById(id);

  if (!employee) {
    throw new Error("Employee not found");
  }

  // Protection : on ne modifie pas un admin
  if (employee.role === "admin") {
    throw new Error("Cannot update admin account");
  }

  // Champs autorisés uniquement
  if (data.firstName !== undefined) {
    employee.firstName = data.firstName;
  }

  if (data.lastName !== undefined) {
    employee.lastName = data.lastName;
  }

  if (data.phone !== undefined) {
    employee.phone = data.phone;
  }

  if (data.role !== undefined) {
    employee.role = data.role;
  }

  if (data.speciality !== undefined) {
    employee.speciality = data.speciality;
  }

  await employee.save();

  return employee;
};

/**
 * Activer/Désactiver un employee/cashier
 */

export const updateEmployeeStatus = async (id: string, isActive: boolean) => {
  const employee = await User.findById(id);

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.role === "admin") {
    throw new Error("Cannot disable admin account");
  }

  employee.isActive = isActive;

  await employee.save();

  return employee;
};

/** * Supprimer un employee/cashier */

export const deleteEmployee = async (id: string, adminId: string) => {
  const employee = await User.findById(id);

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.role === "admin") {
    throw new Error("Cannot delete admin account");
  }

  employee.isDeleted = true;

  employee.isActive = false;

  employee.deletedAt = new Date();

  employee.deletedBy = adminId as any;

  await employee.save();

  return employee;
};
