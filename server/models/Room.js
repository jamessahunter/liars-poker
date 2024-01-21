const { Schema, model } = require('mongoose');
const User = require('./User');

const roomSchema = new Schema({
  room: {
    type: String,
    required: true,
    unique: true,
  },
  cards_delt:{
    type: String,
  },
  users: [User]
  
});

const Room = model('Room', roomSchema);

module.exports = Room;
