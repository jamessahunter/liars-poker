const router = require('express').Router();
const { 
    getUser,
    getAllUser,
    addCard,
    addCount,
    createUser } = require('../../controllers/user-controller');
router.route('/:username').get(getUser);
router.route('/card/:username').put(addCard);
router.route('/count/:username').put(addCount);
router.route('/').get(getAllUser);
router.route('/').post(createUser);
module.exports = router;