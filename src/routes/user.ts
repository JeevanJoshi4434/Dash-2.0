import { Router, Request, Response, NextFunction } from 'express';
import UserController from '../controllers/user';
import { globalErrorHandler } from '../utils/errorHandler';


const router = Router();
const userController = new UserController(); // Create an instance of the controller

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'User Route' });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  userController.create(req, res); // Use the instance method here
});

export default router;
