import { sessionOptions } from '.';
import { User } from '../controllers';

export const authenticate = async (req, res, next) => {
  if (!req.session.user) {
    req.session.destroy(function () {
      req.session = null;
      res.clearCookie('user', sessionOptions).sendStatus(205);
    });

    return;
  }

  try {
    const _id = req.session.user.token;
    const user = await new User();
    const data = await user.getUser({ _id });
    req.role = data.role;

    if (data) {
      next();
    } else {
      res.status(401).json({ message: 'Authentication credentials are not valid' });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
    return;
  }
};
