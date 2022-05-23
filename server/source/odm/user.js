import mongoose from 'mongoose';
import { v4 } from 'uuid';

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
      default: null,
    },
    secondName: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    technologies: {
      type: Array,
      default: [],

      technologie: {
        type: String,
        defaukt: null,
      },
    },
    birthDate: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    friends: {
      type: Array,
      default: [],

      friend: {
        type: String,
        default: null,
      },
    },
  },
  created: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  id: {
    type: String,
    required: true,
    default: () => v4(),
  },
});

export const user = mongoose.model('user', schema);
