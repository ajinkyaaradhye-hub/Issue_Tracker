import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../../prisma/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { registerSchema, loginSchema } from '../../schemas/auth.schema';
import { sendErrorResponse } from '../../utils/errorResponse';
import { findUserByEmail } from '../../utils/prismaHelpers';
import { MessagesEnum } from '../../utils/messages.enum';
import { AuthUser } from '../../types/auth.types';
import { UserRole } from '../../types/role.enum';

export const register = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return sendErrorResponse(res, 400, result);
    }

    const { name, email, password, role } = result.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return sendErrorResponse(res, 400, new Error(MessagesEnum.USER_ALREADY_EXISTS));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    return res.status(201).json({
      message: MessagesEnum.USER_REGISTERED_SUCCESS,
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(MessagesEnum.REGISTER_ERROR, error);
    return sendErrorResponse(res, 500, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }

    const { email, password } = result.data;
    const user = await findUserByEmail(email);

    if (!user) {
      return sendErrorResponse(res, 400, new Error(MessagesEnum.USER_NOT_FOUND));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 400, new Error(MessagesEnum.INVALID_CREDENTIALS));
    }

    const payload: AuthUser = {
      id: String(user.id),
      email: user.email,
      role: UserRole[user.role.toUpperCase() as keyof typeof UserRole],
    };
    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.json({
      message: MessagesEnum.LOGIN_SUCCESS,
      token,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  } catch (error) {
    console.error(MessagesEnum.LOGIN_ERROR, error);
    return sendErrorResponse(res, 500, error);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendErrorResponse(res, 401, new Error('Refresh token missing'));
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      console.error(err);
      return sendErrorResponse(res, 403, new Error('Invalid or expired refresh token'));
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
    });

    if (!user) {
      return sendErrorResponse(res, 404, new Error('User not found'));
    }

    const payload: AuthUser = {
      id: String(user.id),
      email: user.email,
      role: UserRole[user.role.toUpperCase() as keyof typeof UserRole],
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    return res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('🔴 REFRESH ERROR:', error);
    return sendErrorResponse(res, 500, error);
  }
};
