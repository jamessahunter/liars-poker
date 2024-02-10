const router = require('express').Router();
const {
    createRoom,
    addUser,
    AnotherUser,
    getUserTurn,
    getRoomUser,
    updateTurn,

} = require('../../controllers/room-controller')

router.route('/').post(createRoom);
router.route('/another/:code').put(AnotherUser);
router.route('/add/:code').put(addUser);
router.route('/turn/:code').put(updateTurn);
router.route('/user/:code').get(getRoomUser);
router.route('/turn/:code').get(getUserTurn);

module.exports = router;