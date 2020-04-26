//to interact with db, create models

//bring in mongoose
const mongoose = require('mongoose');

//create schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//exports variable, takes in model name and the schema
module.exports = User = mongoose.model('user', UserSchema);
