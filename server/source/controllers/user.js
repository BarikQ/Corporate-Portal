import { User as UserModel } from '../models';

export class User {
  constructor(data) {
    this.models = {
      user: new UserModel(data),
    };
  }

  async create() {
    return await this.models.user.create();
  }

  async getUser(userId) {
    return await this.models.user.getUser(userId);
  }

  async updateUser(userId, userData) {
    return await this.models.user.updateUser(userId, userData);
  }

  async compareUserPasswords(userId, enteredPassword, isAdminPage) {
    return await this.models.user.compareUserPasswords(userId, enteredPassword, isAdminPage);
  }

  async deleteUser(userId) {
    return await this.models.user.deleteUser(userId);
  }

  async updateHash(userId, hash) {
    return await this.models.user.updateHash(userId, hash);
  }

  async getUsers(isAdminRequest) {
    return await this.models.user.getUsers(isAdminRequest);
  }

  async isUnique() {
    return await this.models.user.isUnique();
  }

  async getUserRoles(userId) {
    return await this.models.user.getUserRoles(userId);
  }

  async getUserChats(userId) {
    return await this.models.user.getUserChats(userId);
  }

  async getChatMessages(userId, chatId) {
    return await this.models.user.getChatMessages(userId, chatId);
  }

  async putChatMessage(senderId, receiverId, message) {
    return await this.models.user.putChatMessage(senderId, receiverId, message);
  }

  async postUserFriend(userId, friendId) {
    return await this.models.user.postUserFriend(userId, friendId);
  }

  async deleteUserFriend(userId, friendId) {
    return await this.models.user.deleteUserFriend(userId, friendId);
  }
}
