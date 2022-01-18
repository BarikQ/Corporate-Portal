import mongoose from 'mongoose';
import { v4 } from 'uuid';

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Movie title',
  },
  description: {
    type: String,
    required: true,
    default: 'No description provided',
  },
  date: {
    type: Date,
    required: true,
    default: '',
  },
  genres: {
    type: Array,
    required: true,
    default: ['No genre present'],
  },
  posterURL: {
    type: String,
    required: true,
    default: '',
  },
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
  created: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => v4(),
  },
});

export const film = mongoose.model('film', schema);
