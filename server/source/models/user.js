import { user } from '../odm';

export class User {
  constructor(data) {
    this.data = data;
  }

  async create() {
    const data = await user.create(this.data);

    return data;
  }

  async getUser(userData) {
    const data = await user.find(userData);

    return data;
  }

  async getUsers() {
    const data = await user.find({});

    return data;
  }

  async isUnique() {
    const { email } = this.data;
    const data = await user.findOne({ email });

    return !data;
  }

  async getUserRoles(userId) {
    const data = await user.findOne({ _id: userId }, { role: 1 });

    return data;
  }
}
