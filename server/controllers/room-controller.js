const {Room, User} = require('../models');
const mongoose = require('mongoose');

module.exports = {
    async getAllUser(req, res) {
      console.log(req.params)
      const allUser= await Room.findOne({room: req.params.code})
      .populate('users');
      console.log(allUser.users)
      if (!allUser) {
        return res.status(400).json({ message: 'No Users found' });
      }
      res.status(200).json(allUser);
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
    }


}