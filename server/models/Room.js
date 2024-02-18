const { Schema, model } = require('mongoose');
// const userSchema = require('./User');

const roomSchema = new Schema({
  room: {
    type: String,
    required: true,
    unique: true,
  },
  cards_dealt:[{
    type: String,
  }],
  users: {
    type: [String],
    ref: 'User',
  },
  userTurn:{
    type: Number,
    default: 0,
  },
  hand:[{
    type: String,
  }],
  playersIn:[{
    type: String
  }],
  started: {
    type: Boolean
  }
  
});

const Room = model('Room', roomSchema);

module.exports = Room;
