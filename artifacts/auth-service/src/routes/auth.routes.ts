import { Router } from 'express';
import { login, publicKey } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.get('/public-key', publicKey);

export default router;
