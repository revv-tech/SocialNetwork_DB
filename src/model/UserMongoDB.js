const { contentType } = require('express/lib/response');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    isPrivate: false
  },
  email: {
    type: String,
    isPrivate: false
  },
  password: {
    type: String,
    isPrivate: true
  },
  description: {
    type: String,
    isPrivate: true
  },
  date: {
    type: Date,
    isPrivate: false
  },
  image: {
    type: Buffer,
    isPrivate: true,
    contentType: String
  },
  interests: {
    type: [String],
    isPrivate: false
  },
  hoobies: {
    type: [String],
    isPrivate: false
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;