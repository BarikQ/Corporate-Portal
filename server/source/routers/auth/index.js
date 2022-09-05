import express from 'express';

import { login, logout, auth, signature } from './route.js';
import { limiter, authenticate } from '../../utils';

export const router = express.Router();

router.get('/', [limiter(100, 60 * 1000), authenticate], auth);
router.post('/login', [limiter(15, 60 * 1000)], login);
router.post('/logout', [limiter(15, 60 * 1000), authenticate], logout);
router.post('/signature', [limiter(15, 60 * 1000), authenticate], signature);

export { router as auth };
