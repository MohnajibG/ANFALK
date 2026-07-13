import { Request, Response } from "express";

import User from "../models/User";

import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

import { AuthRequest } from "../types/auth";

/**
 * Login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    const passwordIsValid = await comparePassword(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return res.status(200).json({
      success: true,

      token,

      user: {
        id: user.id,

        firstName: user.firstName,

        lastName: user.lastName,

        email: user.email,

        phone: user.phone,

        role: user.role,

        speciality: user.speciality,

        mustChangePassword: user.mustChangePassword,

        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * First password change
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordIsValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!passwordIsValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await hashPassword(newPassword);

    user.mustChangePassword = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Current connected user
 */
export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
