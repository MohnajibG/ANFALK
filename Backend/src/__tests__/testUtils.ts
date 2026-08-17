import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import User from "../models/User";
import { hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

let mongod: MongoMemoryServer;

export const startTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
};

export const stopTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongod.stop();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
};

export const createUser = async (overrides: {
  role: "admin" | "cashier" | "employee";
  firstName?: string;
  lastName?: string;
  email?: string;
  speciality?: string;
  isActive?: boolean;
}) => {
  const password = await hashPassword("Test1234!");

  const user = await User.create({
    firstName: overrides.firstName ?? "Test",
    lastName: overrides.lastName ?? overrides.role,
    email: overrides.email ?? `${overrides.role}-${Date.now()}@test.com`,
    phone: "0000000000",
    password,
    role: overrides.role,
    speciality: overrides.speciality,
    isActive: overrides.isActive ?? true,
    mustChangePassword: false,
  });

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  return { user, token };
};
