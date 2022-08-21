import dot from 'mongo-dot-notation';
import bcrypt from 'bcrypt';

import { user } from '../odm';
import { objectCropper, fileUploader } from '../utils';

const mainRoute = 'iTechArt/Portal';
const cloudFolder = 'Users';

function addMessageCb(error, user, targetUser, message) {
  const currentUserId = Buffer.from(user._id.toString()).toString('base64');

  if (!user.chats.get(targetUser)) {
    user.chats.set(targetUser, {
      users: [currentUserId, targetUser],
      name: `${user.profileData.firstName} ${user.profileData.surname}`,
      id: targetUser,
      messages: [message],
    });
  } else {
    const aaa = user.chats.get(targetUser);
    aaa.messages.push(message);
    user.chats.set(targetUser, aaa);
  }

  user.save((err, res) => {
    if (err) throw new Error('Failed to send message');
  });

  return user;
}
export class User {
  constructor(data) {
    this.data = data;
  }

  async create() {
    return await user.create(this.data);
  }

  async getUser(userId) {
    const { _id, profileData, friends } = await user.findOne(userId, {
      profileData: 1,
      friends: 1,
    });
    const decodedFriends = friends.map((friend) => Buffer.from(friend, 'base64').toString());
    const friendsDocs = await user.find({ _id: decodedFriends }, { profileData: 1 }).limit(6);
    const sortedFriends = friendsDocs.map(({ profileData, _id }) => {
      return {
        profileData: objectCropper(profileData, 'friends'),
        _id: Buffer.from(_id.toString()).toString('base64'),
      };
    });

    return { _id, profileData, friends: sortedFriends };
  }

  async updateUser(userId, userData) {
    return await user.updateOne({ _id: userId }, dot.flatten(userData), {
      useFindAndModify: false,
      returnOriginal: false,
    });
  }

  async compareUserPasswords(userId, enteredPassword, isAdminPage) {
    const { password, email } = await user.findOne({ _id: userId }, { password: 1, email: 1 });

    return isAdminPage ? { email } : (await bcrypt.compare(enteredPassword, password)) ? { email } : false;
  }

  async deleteUser(userId) {
    return await user.deleteOne({ _id: userId });
  }

  async updateHash(userId, hash) {
    return await user.find(userId);
  }

  async getUsers(isAdminRequest) {
    try {
      const data = isAdminRequest
        ? await user.find({}, { _id: 1, profileData: 1, emailDecoded: 1, passwordDecoded: 1, created: 1, role: 1 })
        : await user.find({}, { _id: 1, profileData: 1 });

      return isAdminRequest
        ? data.map((kekUser) => ({
            _id: Buffer.from(kekUser._id.toString()).toString('base64'),
            profileData: objectCropper(kekUser.profileData, 'friends'),
            emailDecoded: kekUser.emailDecoded,
            passwordDecoded: kekUser.passwordDecoded,
            created: kekUser.created,
            role: kekUser.role,
          }))
        : data.map((kekUser) => ({
            _id: Buffer.from(kekUser._id.toString()).toString('base64'),
            profileData: objectCropper(kekUser.profileData, 'friends'),
          }));
    } catch (error) {
      console.log(error);
      const customError = new Error(error);
      customError.status = 500;
      customError.message = 'Failed to get users';
      throw customError;
    }
  }

  async isUnique() {
    const { email } = this.data;
    const data = await user.findOne({ email });

    return !data;
  }

  async getUserRoles(userId) {
    return await user.findOne({ _id: userId }, { role: 1 });
  }

  async getUserChats(userId) {
    try {
      const { chats } = await user.findOne({ _id: Buffer.from(userId, 'base64').toString() }, { chats: 1 });

      if (chats) {
        const data = await Promise.all(
          Array.from(chats).map(async ([key, value]) => {
            const { users, messages, id, name } = value;

            let usersData = await user.find(
              {
                _id: {
                  $in: users.map((id) => Buffer.from(id, 'base64').toString()),
                },
              },
              {
                'profileData.profileImage': 1,
                'profileData.firstName': 1,
                'profileData.surname': 1,
              }
            );

            usersData = usersData.reduce((accum, current) => {
              accum[Buffer.from(current._id.toString()).toString('base64')] = current.profileData;
              return accum;
            }, {});

            return {
              lastMessage: messages[messages.length - 1],
              users: usersData,
              id,
              name,
            };
          })
        );

        return data;
      }
    } catch (error) {
      throw new Error('Failed to get user chats');
    }
  }

  async getChatMessages(userId, chatId) {
    const currentUser = await user.findOne({ _id: Buffer.from(userId, 'base64').toString() }, { profileData: 1, chats: 1 });

    if (!currentUser.chats || !currentUser.chats.get(chatId)) {
      const { _id, profileData } = await user.findOne({ _id: Buffer.from(chatId, 'base64').toString() }, { profileData: 1 });

      const data = {
        id: chatId,
        users: {},
        messages: [],
        name: profileData.firstName + ' ' + profileData.surname,
      };

      data.users[chatId] = {
        firstName: profileData.firstName,
        surname: profileData.surname,
        profileImage: profileData.profileImage,
      };

      data.users[userId] = {
        firstName: currentUser.profileData.firstName,
        surname: currentUser.profileData.surname,
        profileImage: currentUser.profileData.profileImage,
      };

      return data;
    } else {
      const chat = currentUser.chats.get(chatId);
      const { users, id, name, messages } = chat;
      const usersId = users.map((user, index) => Buffer.from(user, 'base64').toString());

      const chatUsersData = await user.find({ _id: { $in: usersId } }, { 'profileData.profileImage': 1, 'profileData.firstName': 1, 'profileData.surname': 1 });

      const sortedChatUsersData = chatUsersData.reduce((newObject, { _id, profileData: { firstName, surname, profileImage } }) => {
        newObject[Buffer.from(_id.toString()).toString('base64')] = {
          firstName: firstName,
          surname: surname,
          profileImage: profileImage,
        };

        return newObject;
      }, {});

      return {
        id: chatId,
        name,
        users: sortedChatUsersData,
        messages,
      };
    }
  }

  async putChatMessage(senderId, receiverId, { content, date }) {
    try {
      const senderDecodedId = Buffer.from(senderId, 'base64').toString();
      const receiverDecodedId = Buffer.from(receiverId, 'base64').toString();
      const message = {
        senderId: senderId,
        date: new Date(),
        content: {
          text: content.text,
          attachments: await Promise.all(
            await content.attachments.map(async ({ value, name }, index) => {
              const { resource_type, url } = await fileUploader(value, {
                folder: `${mainRoute}/Files/${senderDecodedId}/${receiverDecodedId}`,
                use_filename: true,
                unique_filename: false,
              });

              return { type: resource_type, url, name };
            })
          ),
        },
      };

      const sender = await user.findOne({ _id: senderDecodedId }, { profileData: 1, chats: 1 }, (error, user) => {
        user = addMessageCb(error, user, receiverId, message);
      });
      const receiver = await user.findOne({ _id: receiverDecodedId }, { profileData: 1, chats: 1 }, (error, user) => {
        user = addMessageCb(error, user, senderId, message);
      });

      const senderUpdatedChat = await user.findOne({ _id: senderDecodedId }, { chats: 1 });
      const receiverUpdatedChat = await user.findOne({ _id: receiverDecodedId }, { chats: 1 });

      return {
        senderMessage: senderUpdatedChat.chats.get(receiverId).messages[senderUpdatedChat.chats.get(receiverId).messages.length - 1],
        receiverMessage: receiverUpdatedChat.chats.get(senderId).messages[receiverUpdatedChat.chats.get(senderId).messages.length - 1],
      };
    } catch (error) {
      console.log(error);
    }
  }

  async postUserFriend(userId, friendId) {
    const userIdDecoded = Buffer.from(userId, 'base64').toString();
    const friendIdDecoded = Buffer.from(friendId, 'base64').toString();

    const currentUser = await user.findOneAndUpdate(
      { _id: userIdDecoded },
      { $addToSet: { friends: friendId } },
      {
        projection: { profileData: 1 },
      }
    );
    const friend = await user.findOneAndUpdate(
      { _id: friendIdDecoded },
      { $addToSet: { friends: userId } },
      {
        projection: { profileData: 1 },
      }
    );

    return { currentUser, friend };
  }

  async deleteUserFriend(userId, friendId) {
    const userIdDecoded = Buffer.from(userId, 'base64').toString();
    const friendIdDecoded = Buffer.from(friendId, 'base64').toString();

    const currentUser = await user.updateOne({ _id: userIdDecoded }, { $pull: { friends: friendId } });
    const friend = await user.updateOne({ _id: friendIdDecoded }, { $pull: { friends: userId } });
  }
}
