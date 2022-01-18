import { getJwtKey } from '..';

const cookieExtractor = function (req) {
  if (req && req.session) {
    const { token } = req.session.user;

    return token;
  }

  return null;
};

export const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: getJwtKey(),
};
