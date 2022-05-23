import cloudinary from 'cloudinary';

import { User } from '../../../controllers';

const cloudinaryRoute = 'iTechArt/Portal/Users';

export const getUser = async (req, res) => {
  try {
    const _id = Buffer.from(req.params.id, 'base64').toString();
    const user = await new User();
    const data = await user.getUser({ _id });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const putUser = async (req, res) => {
  try {
    const userData = req.body;
    const { token, role, accessToken } = req.session.user;
    const _id = Buffer.from(req.params.id, 'base64').toString();
    const { profileImage } = userData.profileData;
    const user = new User();

    console.log('USERPUT', _id);

    try {
      if (profileImage) {
        const cloudinaryResult = await cloudinary.v2.uploader.upload(
          profileImage,
          { public_id: `${cloudinaryRoute}/${_id}/${_id}-pic` },
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

      await user.updateUser(_id, userData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Image upload failed' });
      return;
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    res.sendStatus(204);
    console.log(`deleted by hash: ${req.params.user}`);
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
