const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  cards: [{
    type: String,
  }],
  card_count: {
    type: Number,
    default: 2,
  },
  stillIn: {
    type: Boolean,
    default: true,
  },
  room: {
    type: String,
  }
});

const User = model('User', userSchema);

module.exports = User;