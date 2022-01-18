import mongoose from 'mongoose';
import { v4 } from 'uuid';

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  emailDecoded: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  orders: {
    type: Array,
    order: {
      type: String,
      default: null,
    },
    default: [],
  },
  role: {
    type: String,
    required: true,
    default: 'user',
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
