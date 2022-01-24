import { User as UserModel } from '../models';

export class User {
  constructor(data) {
    this.models = {
      user: new UserModel(data),
    };
  }

  async create() {
    const data = await this.models.user.create();

    return data;
  }

  async getUser(userData) {
    const data = await this.models.user.getUser(userData);

    return data;
  }

  async updateUser(userId, userData) {
    const data = await this.models.user.updateUser(userId, userData);

    return data;
  }

  async updateHash(userId, hash) {
    const data = await this.models.user.updateHash(userId, hash);

    return data;
  }

  async getUsers() {
    const data = await this.models.user.getUsers();

    return data;
  }

  async isUnique() {
    const data = await this.models.user.isUnique();

    return data;
  }

  async getUserRoles(userId) {
    const data = await this.models.user.getUserRoles(userId);

    return data;
  }
}
