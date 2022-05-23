import dot from 'mongo-dot-notation';

import { user } from '../odm';
import { objectIterator } from '../utils';

export class User {
  constructor(data) {
    this.data = data;
  }

  async create() {
    const data = await user.create(this.data);

    return data;
  }

  async getUser(userData) {
    const data = await user.findOne(userData);
    // console.log(userData, data);
    return data;
  }

  async updateUser(userId, userData) {
    const data = await user.findOneAndUpdate({ _id: userId }, dot.flatten(userData), {
      useFindAndModify: false,
      returnOriginal: false,
    });
    console.log('i[pd', userId);
    return data;
  }

  async updateHash(userId, hash) {
    const data = await user.find(userId);

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
