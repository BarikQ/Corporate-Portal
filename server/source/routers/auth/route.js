import dg from 'debug';
import cloudinary from 'cloudinary';

import { Auth } from '../../controllers';
import { sessionOptions } from '../../utils';

const debug = dg('router:auth');
const cloud = cloudinary.v2;

const generateSignature = async (data) => {
  const timestamp = Math.round((new Date).getTime() / 1000);

  const signature = cloudinary.v2.utils.api_sign_request({
    timestamp: timestamp,
    source: 'uw',
    folder: 'iTechArt'
  }, process.env.API_SECRET);
  
  return { timestamp, signature }
};

export const login = async (req, res) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization)
    if (!authorization) return res.status(401).json({ message: 'no auth header' });

    const auth = await new Auth(authorization);
    const data = await auth.login();
    const token = Buffer.from(data._id.toString()).toString('base64');
    const role = Buffer.from(data.role).toString('base64');
    const { accessToken } = data;
    console.log(token);

    res.setHeader('X-Token', token);
    req.session.user = { token, role, accessToken };

    if (data.role !== 'user') {
      res.status(200).json({ message: 'You have logged in', redirect: true, signature: await generateSignature() });
      return;
    } else {
      res.status(200).json({ message: 'You have logged in' });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

export const logout = (req, res) => {
  try {
    req.session.destroy(function () {
      req.session = null;
      res.clearCookie('user', sessionOptions).sendStatus(205);
    });
    return;
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

export const signature = (req, res) => {
  try {
    console.log(req);
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

export const auth = (req, res) => {
  try {
    res.sendStatus(204);
    return;
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};
