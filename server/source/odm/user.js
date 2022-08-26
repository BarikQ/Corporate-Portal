import moment from 'moment';
import mongoose from 'mongoose';
import { v4 } from 'uuid';

const attachmentSchema = new mongoose.Schema({
  type: Object,
  
  type: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})

const messageSchema = new mongoose.Schema({
  type: Object,
  default: {},

  senderId: {
    type: String,
    default: '',
  },
  content: {
    type: Object,
    default: {},

    text: {
      type: String,
      default: '',
    },
    attachments: {
      type: Array,
      of: attachmentSchema,
    },
  },
  date: {
    type: String,
    default: () => new Date(),
  },
});

const chatSchema = new mongoose.Schema({
  type: Object,
  default: {},

  users: {
    type: Array,
    default: [],

    id: {
      type: String,
      default: '',
    },
  },
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  messages: {
    type: Array,
    default: [],
    of: messageSchema,
  },
});

const commentSchema = new mongoose.Schema({
  type: Object,
  
  id: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,

    id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
  },
  content: {
    type: Object,
    default: {},
    required: true,

    text: {
      type: String,
    },
    attachments: {
      type: Array,
      of: attachmentSchema,
    },
  },
  likes: {
    type: Array,
    default: [],
  },
  date: {
    type: String,
    default: () => new Date(),
  }
}, { _id: false })

const postSchema = new mongoose.Schema({
  type: Object,

  id: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,

    id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
  },
  content: {
    type: Object,
    default: {},
    required: true,

    text: {
      type: String,
    },
    attachments: {
      type: Array,
      of: attachmentSchema,
    },
  },
  comments: {
    type: Map,
    default: new Map(),
    of: commentSchema,
  },
  likes: {
    type: Array,
    default: [],
  },
  date: {
    type: String,
    default: () => new Date(),
  },
}, { _id: false });

const friendSchena = new mongoose.Schema({
  type: Object,

  id: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
})

const schema = new mongoose.Schema({
  emailDecoded: {
    type: String,
  },
  passwordDecoded: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  profileData: {
    firstName: {
      type: String,
      required: true,
      default: 'No',
    },
    surname: {
      type: String,
      required: true,
      default: 'Name',
    },
    profileImage: {
      type: String,
      default: 'https://res.cloudinary.com/barik/image/upload/v1652965607/iTechArt/Portal/Default%20User/not-found_jnpi6u.jpg',
    },
    technologies: {
      type: Array,
      default: [],

      technologie: {
        type: String,
        default: null,
      },
    },
    birthDate: {
      type: String,
      required: true,
      default: moment().format('L'),
    },
    city: {
      type: String,
      default: '',
      required: true,
    },
  },
  posts: {
    type: Map,
    default: new Map(),
    of: postSchema,
  },
  chats: {
    type: Map,
    default: new Map(),
    of: chatSchema,
  },
  friends: {
    type: Array,
    default: [],

    friend: {
      type: String,
      default: null,
    },
  },
  notifications: {
    type: Object,
    default: {},

    messages: {
      type: Number,
      default: 0,
    },
    friends: {
      type: Number,
      default: 0,
    },
    posts: {
      type: Number,
      default: 0,
    },
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const user = mongoose.model('user', schema);
