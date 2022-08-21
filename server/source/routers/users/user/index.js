import cloudinary from 'cloudinary';

import { getAccessToken, saltData, sessionOptions } from '../../../utils';
import { User } from '../../../controllers';

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

    console.log(userData);
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
    console.log(req.params);
    const { token } = req.session.user;
    const _id = req.params.id;
    const userTargetId = Buffer.from(_id || token, 'base64').toString();
    const user = new User();
    // throw new Error('zalipa');

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
