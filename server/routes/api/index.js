const router = require('express').Router();
const matchupRoutes = require('./matchup-routes');
const userRoutes = require('./user-routes.js');

router.use('/matchup', matchupRoutes);
router.use('/user', userRoutes);

module.exports = router;
