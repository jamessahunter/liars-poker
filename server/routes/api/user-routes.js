const router = require('express').Router();
const { 
    getUser,
    getAllUser,
    addCard,
    createUser } = require('../../controllers/user-controller');
router.route('/:username').get(getUser);
router.route('/:username').put(addCard)
router.route('/').get(getAllUser);
router.route('/').post(createUser);
module.exports = router;