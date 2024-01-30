const router = require('express').Router();
const matchupRoutes = require('./matchup-routes');
const userRoutes = require('./user-routes.js');
const roomRoutes = require('./room-routes.js')

router.use('/matchup', matchupRoutes);
router.use('/user', userRoutes);
router.use('/room',roomRoutes);

module.exports = router;
