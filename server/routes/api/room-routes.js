const router = require('express').Router();
const {
    createRoom,
    addUser,
    AnotherUser,
    // getAllUser
} = require('../../controllers/room-controller')

router.route('/').post(createRoom);
router.route('/:code').put(AnotherUser);
router.route('/:code').put(addUser);
// router.route('/:code').get(getAllUser);
module.exports = router;