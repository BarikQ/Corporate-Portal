import express from 'express';

// Utils
import { limiter, validator, authenticate, dataDecoder, dataEncoder } from '../../utils';

// Schemas
import { createUser } from '../../schemas';

import { get, post } from './route';
import {
  getUser,
  putUser,
  deleteUser,
  getUserRoles,
  getUserChats,
  getChatMessages,
  postUserFriend,
  deleteUserFriend,
} from './user';

export const router = express.Router();

router.get('/', [limiter(15, 60 * 1000), authenticate], get);
router.post('/', [limiter(15, 60 * 1000), dataDecoder(), validator(createUser)], post);

router.get('/:id', [limiter(15, 60 * 1000), authenticate], getUser);
router.put('/:id', [limiter(15, 60 * 1000), authenticate, dataDecoder()], putUser);
router.delete('/:id', [limiter(15, 60 * 1000), authenticate], deleteUser);

router.get('/:id/roles', [limiter(15, 60 * 1000), authenticate], getUserRoles);
router.get('/:id/chats', [limiter(15, 60 * 1000), authenticate], getUserChats);
router.post('/:id/friends', [limiter(15, 60 * 1000), authenticate], postUserFriend);
router.delete('/:id/friends', [limiter(15, 60 * 1000), authenticate], deleteUserFriend);

router.get('/:id/chats/:chatId', [limiter(15, 60 * 1000), authenticate], getChatMessages);

export { router as users };
