const { Schema, model } = require('mongoose');
// const userSchema = require('./User');

const roomSchema = new Schema({
  room: {
    type: String,
    required: true,
    unique: true,
  },
  cards_delt:{
    type: String,
  },
  users: [{
    type: String,
    ref: 'User',
  }],
  
});

const Room = model('Room', roomSchema);

module.exports = Room;
