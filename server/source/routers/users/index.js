import express from 'express';

// Utils
import { limiter, validator, authenticate, dataDecoder, dataEncoder } from '../../utils';

// Schemas
import { createUser } from '../../schemas';

import { get, post } from './route.js';
import {
  getUser,
  putUser,
  deleteUser,
  getUserRoles,
  getUserChats,
  getChatMessages,
  postUserFriend,
  deleteUserFriend,
  postUserPost,
  putUserPost,
  deleteUserPost,
  postPostComment,
  putPostComment,
  deletePostComment,
} from './user';

export const router = express.Router();

router.get('/', [limiter(15, 60 * 1000), authenticate], get);
router.post('/', [limiter(15, 60 * 1000), dataDecoder(), validator(createUser)], post);

router.get('/:id', [limiter(15, 60 * 1000), authenticate], getUser);
router.put('/:id', [limiter(15, 60 * 1000), authenticate, dataDecoder()], putUser);
router.delete('/:id', [limiter(15, 60 * 1000), authenticate], deleteUser);

router.get('/:id/roles', [limiter(15, 60 * 1000), authenticate], getUserRoles);

router.get('/:id/chats', [limiter(15, 60 * 1000), authenticate], getUserChats);
router.get('/:id/chats/:chatId', [limiter(15, 60 * 1000), authenticate], getChatMessages);

router.post('/:id/friends', [limiter(15, 60 * 1000), authenticate], postUserFriend);
router.delete('/:id/friends', [limiter(15, 60 * 1000), authenticate], deleteUserFriend);

router.post('/:id/posts', [limiter(15, 60 * 1000), authenticate], postUserPost);
router.put('/:id/posts/:postId', [limiter(15, 60 * 1000), authenticate], putUserPost);
router.delete('/:id/posts/:postId', [limiter(15, 60 * 1000), authenticate], deleteUserPost);

router.post('/:id/posts/:postId/comments', [limiter(15, 60 * 1000), authenticate], postPostComment);
router.put('/:id/posts/:postId/comments/:commentId', [limiter(15, 60 * 1000), authenticate], putPostComment);
router.delete('/:id/posts/:postId/comments/:commentId', [limiter(15, 60 * 1000), authenticate], deletePostComment);

export { router as users };
