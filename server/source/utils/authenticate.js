import { sessionOptions } from '.';
import { User } from '../controllers';

export const authenticate = async (req, res, next) => {
  if (!req.session.user) {
    req.session.destroy(function () {
      req.session = null;
      res.clearCookie('user', sessionOptions).status(401).json({ message: 'You are logged out' });
    });

    return;
  }

  try {
    const _id = req.session.user.token;
    const { accessToken, role } = req.session.user;
    const user = await new User();
    const data = await user.getUser({ accessToken });

    req.role = data.role;

    if (data) {
      next();
      return;
    } else {
      res.status(401).json({ message: 'Authentication credentials are not valid' });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
    return;
  }
};
