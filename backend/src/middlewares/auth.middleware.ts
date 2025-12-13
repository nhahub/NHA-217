import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../utils/prisma';

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('يجب تسجيل الدخول للوصول إلى هذه الصفحة', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!currentUser) {
      return next(new AppError('المستخدم غير موجود. يرجى تسجيل الدخول مرة أخرى', 401));
    }

    (req as any).user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('رمز الدخول غير صالح. يرجى تسجيل الدخول مرة أخرى', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return next(new AppError('ليس لديك صلاحية للوصول إلى هذه الصفحة', 403));
    }
    next();
  };
};
