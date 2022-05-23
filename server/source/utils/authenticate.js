import { sessionOptions } from '.';
import { User } from '../controllers';

export const authenticate = async (req, res, next) => {
  if (!req.session.user) {
    return req.session.destroy(function () {
      req.session = null;
      res.clearCookie('user', sessionOptions).status(401).json({ message: 'You are logged out' });
    });
  }

  try {
    const _id = req.session.user.token;
    const { accessToken, role } = req.session.user;
    const user = await new User();
    const data = await user.getUser({ accessToken });

    req.role = data.role;

    if (data) {
      return next();
    } else {
      return res.status(401).json({ message: 'Authentication credentials are not valid' });
    }
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
