import dg from 'debug';

import { User } from '../../controllers';
import { getAccessToken, objectCropper, saltData } from '../../utils';
import { dataRequests } from '../../constants';

const debug = dg('router:user');

export const get = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const isAdminRequest = req.query.requested === dataRequests.admin;
    const user = await new User();
    const data = await user.getUsers(isAdminRequest);

    res.status(200).json(data);
    return;
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
    return;
  }
};

export const post = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { isAdminPage } = req.query;
    const userData = req.body;
    const { email, firstName, surname, birthDate, city, profileImage, technologies, password, passwordRepeat, role } = userData;

    if (password !== passwordRepeat) {
      throw new Error(JSON.stringify({ passwordRepeat: "Passwords didn't match" }));
    }

    userData.profileData = { firstName, surname, birthDate, city, profileImage, technologies };
    userData.passwordDecoded = password;
    userData.emailDecoded = email;
    userData.password = await saltData(password);
    userData.email = await saltData(email);
    userData.accessToken = getAccessToken(userData.email, userData.password);

    const user = await new User(userData);
    const isUnique = await user.isUnique();

    if (!isUnique) {
      throw new Error(JSON.stringify({ email: 'User with this email already exists' }));
    }

    const data = await user.create();

    if (!isAdminPage) {
      const token = Buffer.from(data._id.toString()).toString('base64');
  
      res.setHeader('X-Token', token);
      req.session.user = { token: token, accessToken: userData.accessToken };
      return res.status(200).json({ message: 'You have been sign up' })
    } else {
      const { _id, profileData, emailDecoded, passwordDecoded, created, role } = data;
      return res.status(200).json({ id: _id, profileData, emailDecoded, passwordDecoded, created, role });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
