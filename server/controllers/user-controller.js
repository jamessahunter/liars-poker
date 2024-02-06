const { User } = require('../models');

module.exports = {
  async getAllUser(req, res) {
    const allUser= await User.find({});

    if (!allUser) {
      return res.status(400).json({ message: 'No Users found' });
    }
    res.status(200).json(allUser);
  },

  async addCard(req, res) {
    console.log("add card")
    console.log(req.body.card)
    const user = await User.findOneAndUpdate(
      {username: req.params.username},
      {$addToSet : {cards : req.body.card}},
      { new: true })
      
    res.status(200).json('another card added')
    },

  async getUser(req, res) {
    const user= await User.findOne({username: req.params.username});

    if (!user) {
      return res.status(400).json({ message: 'No User found' });
    }
    res.status(200).json(user);
  },

  async createUser({body},res){
    console.log('user')
    const user=await User.create(body)
    if(!user){
      return res.status(400).json({ message: 'Unable make user' });
    }

    res.status(200).json(user);
  }
};
