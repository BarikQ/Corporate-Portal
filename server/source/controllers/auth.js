import { Auth as AuthModel } from '../models';

export class Auth {
  constructor(data) {
    this.models = {
      auth: new AuthModel(data),
    };
  }

  async login() {
    const data = await this.models.auth.login();

    return data;
  }
}
