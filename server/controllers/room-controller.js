const {Room, User} = require('../models');
const mongoose = require('mongoose');

module.exports = {
  async getUserTurn(req,res){
    console.log('turn')
    const room = await Room.findOne(
      {room: req.params.code},
    )
    // console.log(room)
    let userTurn=room.userTurn;
    res.status(200).json(userTurn);
  },
    async getRoomUser(req, res) {
      // console.log(req.params)
      // console.log('users')
      const allUser= await Room.findOne({room: req.params.code})
      // console.log(allUser.users)
      if (!allUser) {
        return res.status(400).json({ message: 'No Users found' });
      }
      return res.json(allUser.users)
    },
    async createRoom({body},res){
        console.log('room')
        // console.log(body)
        const room=await Room.create(body)
        if(!room){
          return res.status(400).json({ message: 'Unable make room' });
        }
        res.status(200).json(room);
      },
      async AnotherUser(req,res){
        console.log("another user")
        const room = await Room.findOneAndUpdate(
          { room: req.params.code },
          { $addToSet: { users: req.body.username } },
          { new: true }
        );
        res.status(200).json('another User added')
    },
      async addUser(req,res){
        // console.log(req.body)
        // console.log(req.params)
        console.log('adduser')
        const userId = req.body.username; // Replace with the actual user ID
        const roomId = req.params.code; // Replace with the actual room code
        console.log(userId)
        // const userObjectId = new mongoose.Types.ObjectId(userId); // Convert the user ID to an ObjectId
        
        const room = await Room.findOneAndUpdate(
          { room: roomId },
          { $set: { users: userId } }
        );
        res.status(200).json('User added')
    },

    async updateTurn(req,res){
      console.log("update Turn")
      const room = await Room.findOneAndUpdate(
        { room: req.params.code },
        { $set: { userTurn: req.body.userTurn } },
        { new: true }
      );
      res.status(200).json('updated turn')
  },


}