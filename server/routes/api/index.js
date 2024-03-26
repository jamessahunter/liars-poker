const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const roomRoutes = require('./room-routes.js')


router.use('/user', userRoutes);
router.use('/room',roomRoutes);

module.exports = router;
