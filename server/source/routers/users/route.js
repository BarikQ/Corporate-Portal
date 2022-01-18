import dg from 'debug';

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
    req.body.emailDecoded = Buffer.from(req.body.email, 'base64').toString();
    req.body.role = Buffer.from(req.body.role, 'base64').toString();

    const user = await new User(req.body);
    const isUnique = await user.isUnique();

    if (!isUnique) {
      throw new Error(JSON.stringify({ email: 'User with this email already exists' }));
    }

    const data = await user.create();
    const token = data._id;

    res.setHeader('X-Token', token);
    req.session.user = { token: token };

    res.status(200).json({ message: 'You have been sign up' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
