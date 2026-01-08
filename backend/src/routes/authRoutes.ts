import { Router } from 'express';
import {
   register,
   login,
   getCurrentUser,
} from '../controllers/authController.js';
import {
   registerValidator,
   loginValidator,
} from '../validators/authValidator.js';
import { validate } from '../middlewares/validate.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', auth, getCurrentUser);

export default router;
