const router = require('express').Router();
const {
    createRoom,
    addUser,
    AnotherUser,
    getRoomUser
} = require('../../controllers/room-controller')

router.route('/').post(createRoom);
router.route('/:code').put(AnotherUser);
router.route('/:code').put(addUser);
router.route('/:code').get(getRoomUser);
module.exports = router;