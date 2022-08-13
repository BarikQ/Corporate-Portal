import bcrypt from 'bcrypt';
import { getAccessToken } from '../utils';

import { user } from '../odm';

export class Auth {
  constructor(data) {
    this.data = data;
  }

  async login() {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const header = this.data;
    const [, credentials] = header.split(' ');
    let [email, password] = Buffer.from(credentials, 'base64').toString().split(':');
    const emailDecoded = Buffer.from(email, 'base64').toString();
    const passwordDecoded = Buffer.from(password, 'base64').toString();

    const data = await user.findOne({ emailDecoded });

    if (data) {
      const match = await bcrypt.compare(passwordDecoded, data.password);

      if (match) {
        email = await bcrypt.hash(emailDecoded, salt);
        password = await bcrypt.hash(passwordDecoded, salt);

        const newAccessToken = getAccessToken(email, password);

        return await user.findOneAndUpdate(
          { emailDecoded: emailDecoded },
          { $set: { accessToken: newAccessToken } },
          { useFindAndModify: false, returnOriginal: false }
        );
      } else throw new Error('Auth credentials are not valid');
    } else throw new Error('Auth credentials are not valid');
  }
}
