import { validationHandler } from '../utils/validationHandler';
import { registerController, loginController } from '../controllers/authController';
import { Router } from 'express';
import { registerSchema, loginSchema } from './validation-schemas';
const router = Router();

router.post('/register', validationHandler(registerSchema), registerController)
router.post('/login', validationHandler(loginSchema), loginController)

export default router;