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

  async allowAccess(accessToken) {
    return await this.models.user.allowAccess(accessToken);
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

  async postUserPost(pageId, authorId, postId, data) {
    return await this.models.user.postUserPost(pageId, authorId, postId, data);
  }

  async putUserPost(pageId, userId, postId, updates) {
    return await this.models.user.putUserPost(pageId, userId, postId, updates);
  }

  async deleteUserPost(pageId, userId, postId) {
    return await this.models.user.deleteUserPost(pageId, userId, postId);
  }

  async postPostComment(pageId, authorId, postId, commentId, data) {
    return await this.models.user.postPostComment(pageId, authorId, postId, commentId, data);
  }

  async putPostComment(pageId, userId, postId, commentId, updates) {
    return await this.models.user.putPostComment(pageId, userId, postId, commentId, updates);
  }

  async deletePostComment(pageId, userId, postId, commentId) {
    return await this.models.user.deletePostComment(pageId, userId, postId, commentId);
  }
}
