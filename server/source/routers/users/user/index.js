import cloudinary from 'cloudinary';
import mongoose from 'mongoose';

import { fileUploader, getAccessToken, saltData, sessionOptions } from '../../../utils';
import { User } from '../../../controllers';
import { mainRoute } from '../../../constants';

const cloudinaryRoute = 'iTechArt/Portal/Users';

export const getUser = async (req, res) => {
  try {
    const _id = Buffer.from(req.params.id, 'base64').toString();
    const user = await new User();
    const data = await user.getUser({ _id });

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: 'User not found' });
  }
};

export const putUser = async (req, res) => {
  try {
    const userData = req.body;
    const { token, role, accessToken } = req.session.user;
    const _id = req.params.id;
    const { isAdminPage } = req.query;
    let { profileImage, password, newPassword, newPasswordRepeat } = userData.profileData;
    const user = new User();
    const userTargetId = Buffer.from(_id || token, 'base64').toString();

    if (isAdminPage && (newPassword || newPasswordRepeat)) password = true;

    try {
      if (profileImage) {
        const cloudinaryResult = await cloudinary.v2.uploader.upload(
          profileImage,
          { public_id: `${cloudinaryRoute}/${userTargetId}/${userTargetId}-pic` },
          (error, result) => {
            if (error) {
              res.status(400).json({ message: error.message });
              return;
            }

            return result;
          }
        );

        userData.profileData.profileImage = cloudinaryResult.url;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Image upload failed' });
      return;
    }

    try {
      if (password && newPassword && newPasswordRepeat) {
        if (newPassword !== newPasswordRepeat) throw new Error('Passwords mismatch');
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}/.test(newPassword))
          throw new Error('Must contain at least one number and one uppercase and lowercase letter, and at 6-32 characters');

        const { email } = await user.compareUserPasswords(userTargetId, password, isAdminPage);
        if (!email) throw new Error('The current password is entered incorrectly');

        userData.passwordDecoded = newPassword;
        userData.password = await saltData(newPassword);

        userData.accessToken = getAccessToken(email, userData.password);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }

    console.log(await user.updateUser(userTargetId, userData));
    if (!isAdminPage) {
      res.setHeader('X-Token', token);
      req.session.user = { token, accessToken: userData.accessToken };
    }

    res.sendStatus(200);
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
    return;
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { token } = req.session.user;
    const _id = req.params.id;
    const userTargetId = Buffer.from(_id || token, 'base64').toString();
    const user = new User();

    user.deleteUser(userTargetId);

    if (userTargetId === token) {
      req.session.destroy(function () {
        req.session = null;
      });

      res.clearCookie('user', sessionOptions).sendStatus(204);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserRoles = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await new User();
    const data = await user.getUserRoles(userId);

    res.status(200).json(data);
    return;
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await new User();
    const chats = await user.getUserChats(userId);

    return res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const userId = req.params.id;
    const chatId = req.params.chatId;
    const user = await new User();
    const data = await user.getChatMessages(userId, chatId);

    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const postUserFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await new User();
    let { currentUser, friend } = await user.postUserFriend(userId, friendId);
    currentUser = JSON.parse(JSON.stringify(currentUser));
    friend = JSON.parse(JSON.stringify(friend));
    currentUser._id = userId;
    friend._id = friendId;

    res.status(200).json({ currentUser, friend });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: 'Failed to add friend' });
  }
};

export const deleteUserFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await new User();
    const data = await user.deleteUserFriend(userId, friendId);

    res.sendStatus(204);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: 'Failed to remove friend' });
  }
};

export const postUserPost = async (req, res) => {
  try {
    const _id = Buffer.from(req.params.id, 'base64').toString();
    const { text, attachments, authorId } = req.body;
    const newPostId = mongoose.Types.ObjectId();

    const data = {
      text,
      attachments: await Promise.all(
        await attachments.map(async ({ value, name, type }, index) => {
          const { resource_type, url } = await fileUploader(value, {
            folder: `${mainRoute}/Users/${_id}/posts/${newPostId}`,
            use_filename: true,
            unique_filename: false,
          });

          return { type: type || resource_type, url, name };
        })
      ),
    };

    const user = await new User();
    const post = await user.postUserPost(_id, authorId, newPostId, data);
    res.status(200).json({ post });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: 'Failed to create post' });
  }
};

export const putUserPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const pageIdDecoded = Buffer.from(req.params.id, 'base64').toString();
    const { updates, userId } = req.body;

    const user = await new User();
    const { posts } = await user.getUser({ _id: pageIdDecoded });

    if (updates.content && posts.get(postId).author.id !== userId) return res.status(400).json({ message: "You don't have access to edit this post" });

    if (updates.content)
      updates.content.attachments = await Promise.all(
        await updates.content.attachments.map(async ({ value, name, type, url }, index) => {
          if (url) return { type, url, name };
          const uploadedData = await fileUploader(value, {
            folder: `${mainRoute}/Users/${pageIdDecoded}/posts/${postId}`,
            use_filename: true,
            unique_filename: false,
          });

          return { type: type || uploadedData.resource_type, url: uploadedData.url, name };
        })
      );

    const updatedUser = await user.putUserPost(pageIdDecoded, userId, postId, updates);

    res.status(200).json({ post: updatedUser.posts.get(postId) });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message || 'Failed to update post' });
  }
};

export const deleteUserPost = async (req, res) => {
  try {
    const { id, postId } = req.params;
    const { userId } = req.body;
    const userIdDecoded = Buffer.from(userId, 'base64').toString();
    const pageIdDecoded = Buffer.from(id, 'base64').toString();

    const user = await new User();
    await user.deleteUserPost(pageIdDecoded, userIdDecoded, postId);

    res.sendStatus(204);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: 'Failed to delete post' });
  }
};

export const postPostComment = async (req, res) => {
  try {
    const { id, postId } = req.params;
    const pageIdDecoded = Buffer.from(id, 'base64').toString();

    const { text, attachments, authorId } = req.body;
    const newCommentId = mongoose.Types.ObjectId();

    const data = {
      text,
      attachments: await Promise.all(
        await attachments.map(async ({ value, name, type }, index) => {
          const { resource_type, url } = await fileUploader(value, {
            folder: `${mainRoute}/Users/${pageIdDecoded}/posts/${postId}/comments/${newCommentId}`,
            use_filename: true,
            unique_filename: false,
          });

          return { type: type || resource_type, url, name };
        })
      ),
    };

    const user = await new User();
    const comments = await user.postPostComment(pageIdDecoded, authorId, postId, newCommentId, data);
    res.status(200).json({ comments });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: 'Failed to create post' });
  }
};

export const putPostComment = async (req, res) => {
  try {
    const { id, postId, commentId } = req.params;
    const { updates, userId } = req.body;
    const userIdDecoded = Buffer.from(userId, 'base64').toString();
    const pageIdDecoded = Buffer.from(id, 'base64').toString();

    const user = await new User();
    const { posts } = await user.getUser({ _id: pageIdDecoded });
    if (posts.get(postId)) {
      if (updates.content && posts.get(postId).author.id !== userId) return res.status(400).json({ message: "You don't have access to edit this post" });
    } else throw new Error('Post not found');

    if (updates.content)
      updates.content.attachments = await Promise.all(
        await updates.content.attachments.map(async ({ value, name, type, url }, index) => {
          if (url) return { type, url, name };
          const uploadedData = await fileUploader(value, {
            folder: `${mainRoute}/Users/${pageIdDecoded}/posts/${postId}/comments/${commentId}`,
            use_filename: true,
            unique_filename: false,
          });

          return { type: type || uploadedData.resource_type, url: uploadedData.url, name };
        })
      );

    const updatedUser = await user.putPostComment(pageIdDecoded, userIdDecoded, postId, commentId, updates);

    res.status(200).json({ comment: updatedUser.posts.get(postId).comments.get(commentId) });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message || 'Failed to update post' });
  }
};

export const deletePostComment = async (req, res) => {
  try {
    const { id, postId, commentId } = req.params;
    const { userId } = req.body;
    const userIdDecoded = Buffer.from(userId, 'base64').toString();
    const pageIdDecoded = Buffer.from(id, 'base64').toString();

    const user = await new User();
    await user.deletePostComment(pageIdDecoded, userIdDecoded, postId, commentId);

    res.sendStatus(204);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: 'Failed to delete post' });
  }
};
