import express from 'express';

// Utils
import { limiter, validator, authenticate, dataDecoder, dataEncoder } from '../../utils';

// Schemas
import { createUser } from '../../schemas';

import { get, post } from './route';
import { getUser, putUser, deleteUser, getUserRoles } from './user';

export const router = express.Router();

router.get('/', [limiter(15, 60 * 1000), authenticate], get);
router.post('/', [limiter(15, 60 * 1000), dataDecoder(), validator(createUser)], post);

router.get('/:id', getUser);
router.put('/:id', [limiter(15, 60 * 1000), authenticate, dataDecoder()], putUser);
router.delete('/:id', [authenticate], deleteUser);
router.get('/:id/roles', [limiter(15, 60 * 1000), authenticate], getUserRoles);

export { router as users };