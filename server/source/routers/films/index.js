import express from 'express';

// Utils
import { limiter, authenticate } from '../../utils';

import { get, post, getAdmin } from './route';
import { getFilm, putFilm, deleteFilm } from './film';

export const router = express.Router();

router.get('/', [limiter(30, 1000 * 60)], get);
router.post('/', [limiter(30, 1000 * 60)], post);
router.get('/admin', [limiter(30, 1000 * 60), authenticate], getAdmin);

router.get('/:id', getFilm);
router.put('/:id', putFilm);
router.delete('/:id', deleteFilm);

export { router as films };
