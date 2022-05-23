import dg from 'debug';
import bcrypt from 'bcrypt';

import { User } from '../../controllers';

const debug = dg('router:user');

export const get = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const user = await new User();
    const data = await user.getUsers();

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const post = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const userData = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    if (userData.password !== userData.passwordRepeat) {
      throw new Error(JSON.stringify({ passwordRepeat: "Passwords didn't match" }));
    }

    userData.passwordDecoded = userData.password;
    userData.emailDecoded = userData.email;
    userData.password = await bcrypt.hash(userData.password, salt);
    userData.email = await bcrypt.hash(userData.email, salt);
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
