const { contentType } = require('express/lib/response');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
  },
  emailPrivate: {
    type: Boolean,
    default: true
  },
  password: {
    type: String
  },
  description: {
    type: String
  },
  descriptionPrivate: {
    type: Boolean,
    default: true
  },
  date: {
    type: String
  },
  datePrivate: {
    type: Boolean,
    default: true
  },
  imagePrivate: {
    type: Boolean,
    default: true
  },
  interests: {
    type: [String]
  },
  interestsPrivate: {
    type: Boolean,
    default: true
  },
  hoobies: {
    type: [String]
  },
  hoobiesPrivate: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;