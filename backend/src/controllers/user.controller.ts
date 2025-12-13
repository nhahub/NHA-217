import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../middlewares/error.middleware';

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({
      status: 'success',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Prevent admin from deleting themselves
    const currentUser = (req as any).user;
    if (req.params.id === currentUser.id && req.body.role && req.body.role !== currentUser.role) {
      return next(new AppError('You cannot change your own role', 400));
    }
    
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Prevent admin from deleting themselves
    const currentUser = (req as any).user;
    if (req.params.id === currentUser.id) {
      return next(new AppError('You cannot delete your own account', 400));
    }
    
    await userService.deleteUser(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

