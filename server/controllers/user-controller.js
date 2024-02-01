const { User } = require('../models');

module.exports = {
  async getAllUser(req, res) {
    const allUser= await User.find({});

    if (!allUser) {
      return res.status(400).json({ message: 'No Users found' });
    }
    res.status(200).json(allUser);
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
