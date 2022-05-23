import dg from 'debug';

import { User } from '../../controllers';
import { objectCropper, saltData } from '../../utils';

const debug = dg('router:user');

export const get = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const user = await new User();
    const data = await user.getUsers();

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
    const userData = req.body;
    const { email, firstName, surname, birthDate, city, password, passwordRepeat, role } = userData;

    if (password !== passwordRepeat) {
      throw new Error(JSON.stringify({ passwordRepeat: "Passwords didn't match" }));
    }

    userData.profileData = { firstName, surname, birthDate, city };
    userData.passwordDecoded = password;
    userData.emailDecoded = email;
    userData.password = await saltData(password);
    userData.email = await saltData(email);
    userData.accessToken = `${userData.email.split('').reverse().join('')}:${userData.password
      .split('')
      .reverse()
      .join('')}`;

    const user = await new User(userData);
    const isUnique = await user.isUnique();

    if (!isUnique) {
      throw new Error(JSON.stringify({ email: 'User with this email already exists' }));
    }

    const data = await user.create();
    const token = Buffer.from(data._id.toString()).toString('base64');

    res.setHeader('X-Token', token);
    req.session.user = { token: token, accessToken: userData.accessToken };

    res.status(200).json({ message: 'You have been sign up' });
    return;
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};
