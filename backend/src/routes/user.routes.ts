import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

