const router = require('express').Router();
const {
    createRoom,
    addUser,
    AnotherUser,
    getUserTurn,
    getRoomUser,
    updateTurn,
    addDealt,
    getDealt,
    addHand,
    getHand,
    resetCardsDealt

} = require('../../controllers/room-controller')

router.route('/').post(createRoom);
router.route('/another/:code').put(AnotherUser);
router.route('/add/:code').put(addUser);
router.route('/dealt/:code').put(addDealt);
router.route('/turn/:code').put(updateTurn);
router.route('/hand/:code').put(addHand);
router.route('/user/:code').get(getRoomUser);
router.route('/turn/:code').get(getUserTurn);
router.route('/dealt/:code').get(getDealt)
router.route('/hand/:code').get(getHand)
router.route('/reset/:code').put(resetCardsDealt)
module.exports = router;