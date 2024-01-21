const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  cards: {
    type: String,
    required: true,
  },
  card_count: {
    type: Number,
    default: 2,
  },
});

const User = model('User', userSchema);

module.exports = User;
