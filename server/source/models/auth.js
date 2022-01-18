import { user } from '../odm';

export class Auth {
  constructor(data) {
    this.data = data;
  }

  async login() {
    const header = this.data;
    const [, credentials] = header.split(' ');
    let [email, password] = Buffer.from(credentials, 'base64').toString().split(':');

    const data = await user.findOne({ email, password });

    if (!data) {
      throw new Error('Auth credentials are not valid');
    }

    const { _id, role } = data;

    return { _id, role };
  }
}
