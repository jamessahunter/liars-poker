const router = require('express').Router();
const { 
    getUser,
    getAllUser,
    addCard,
    addCount,
    resetCardsPlayer,
    createUser } = require('../../controllers/user-controller');
router.route('/:username').get(getUser);
router.route('/card/:username').put(addCard);
router.route('/count/:username').put(addCount);
router.route('/').get(getAllUser);
router.route('/').post(createUser);
router.route('/resetCards/:username').put(resetCardsPlayer);
module.exports = router;