const {Room, User} = require('../models');
const mongoose = require('mongoose');

module.exports = {

  async getIn(req, res) {
    const allUser= await Room.findOne({room: req.params.code})

    if (!allUser) {
      return res.status(400).json({ message: 'No Users found' });
    }
    return res.json(allUser.playersIn)
  },

  async getUserTurn(req,res){

    const room = await Room.findOne(
      {room: req.params.code},
    )

    let userTurn=room.userTurn;
    res.status(200).json(userTurn);
  },
    async getRoomUser(req, res) {

      const allUser= await Room.findOne({room: req.params.code})

      if (!allUser) {
        return res.status(400).json({ message: 'No Users found' });
      }
      return res.json(allUser.users)
    },
    async createRoom({body},res){

        const room=await Room.create(body)
        if(!room){
          return res.status(400).json({ message: 'Unable make room' });
        }
        res.status(200).json(room);
      },
      async AnotherUser(req,res){

        const room = await Room.findOneAndUpdate(
          { room: req.params.code },
          { $addToSet: { users: req.body.username } },
          { new: true }
        );
        res.status(200).json('another User added')
    },
      async addUser(req,res){

        const userId = req.body.username; // Replace with the actual user ID
        const roomId = req.params.code; // Replace with the actual room code
        const room = await Room.findOneAndUpdate(
          { room: roomId },
          { $set: { users: userId } }
        );
        res.status(200).json('User added')
    },

    async updateTurn(req,res){

      const room = await Room.findOneAndUpdate(
        { room: req.params.code },
        { $set: { userTurn: req.body.userTurn } },
        { new: true }
      );
      res.status(200).json('updated turn')
  },

  async addDealt(req, res) {

    const room = await Room.findOneAndUpdate(
      {room: req.params.code},
      {$addToSet : {cards_dealt : req.body.cards_dealt}},
      { new: true })
      
    res.status(200).json('another card added')
    },

    async getDealt(req, res) {

      const allUser= await Room.findOne({room: req.params.code})

      if (!allUser) {
        return res.status(400).json({ message: 'No Users found' });
      }
      return res.json(allUser.cards_dealt)
    },

    async addHand(req, res) {

      const room = await Room.findOneAndUpdate(
        {room: req.params.code},
        {$set : {hand : req.body}},
        { new: true })
        
      res.status(200).json('hand added')
      },
    async getHand(req,res) {
      const room= await Room.findOne({room: req.params.code})

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

        const room = await Room.findOneAndUpdate(
          {room: req.params.code},
          {$set : {playersIn : req.body}},
          { new: true })

        res.status(200).json('players in set')
        },

        async setRoomStarted(req,res){
          const room = await Room.findOneAndUpdate(
            {room: req.params.code},
            {$set: {started: true}},
            {new: true})
            res.status(200).json('room started')
        },

        async getRoomStarted(req,res) {
          const room= await Room.findOne({room: req.params.code})
          if (!room) {
            return res.status(400).json({ message: 'No room found' });
          }
          return res.status(200).json(room.started)
        },
}