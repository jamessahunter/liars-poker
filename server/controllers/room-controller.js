const {Room, User} = require('../models');
const mongoose = require('mongoose');

module.exports = {

  async getIn(req, res) {
    console.log('test')
    // console.log(req.params)
    console.log('get players in')
    const allUser= await Room.findOne({room: req.params.code})
    console.log(allUser.playersIn)
    if (!allUser) {
      return res.status(400).json({ message: 'No Users found' });
    }
    return res.json(allUser.playersIn)
  },

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

  async addDealt(req, res) {
    // console.log("add dealt")
    // console.log(req.body.cards_dealt)
    const room = await Room.findOneAndUpdate(
      {room: req.params.code},
      {$addToSet : {cards_dealt : req.body.cards_dealt}},
      { new: true })
      
    res.status(200).json('another card added')
    },

    async getDealt(req, res) {
      // console.log(req.params)
      // console.log('users')
      const allUser= await Room.findOne({room: req.params.code})
      // console.log(allUser.users)
      if (!allUser) {
        return res.status(400).json({ message: 'No Users found' });
      }
      return res.json(allUser.cards_dealt)
    },

    async addHand(req, res) {
      // console.log("add dealt")
      // console.log(req.body)
      const room = await Room.findOneAndUpdate(
        {room: req.params.code},
        {$set : {hand : req.body}},
        { new: true })
        
      res.status(200).json('hand added')
      },
    async getHand(req,res) {
      const room= await Room.findOne({room: req.params.code})
      console.log(room.hand)
      return res.json(room.hand)
    },

    async resetCardsDealt(req,res) {
      const room = await Room.findOneAndUpdate(
        {room: req.params.code},
        {$set : {cards_dealt : [], hand : []}},
        { new: true })
        
      res.status(200).json('reset cards')
      },

      async setPlayersIn(req, res) {
        console.log("set playersin")
        console.log(req.body)
        console.log(req.params.code)
        const room = await Room.findOneAndUpdate(
          {room: req.params.code},
          {$set : {playersIn : req.body}},
          { new: true })
        // const allUser= await Room.findOne({room: req.params.code})
        // console.log(allUser.playersIn)
        // console.log(room)
        // console.log(room2)
        res.status(200).json('players in set')
        },

        async setRoomStarted(req,res){
          console.log(req.body)
          const room = await Room.findOneAndUpdate(
            {room: req.params.code},
            {$set: {started: true}},
            {new: true})
            res.status(200).json('room started')
        },

        async getRoomStarted(req,res) {
          const room= await Room.findOne({room: req.params.code})
          // console.log(room.started)
          if (!room) {
            return res.status(400).json({ message: 'No room found' });
          }
          // console.log(room)
          return res.status(200).json(room.started)
        },
}