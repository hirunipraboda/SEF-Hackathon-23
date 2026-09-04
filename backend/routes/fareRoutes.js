const express = require('express');
const router = express.Router();
const { getStations, calculateFare, compareFares } = require('../controllers/fareController');

router.get('/stations', getStations);
router.post('/calculate', calculateFare);
router.get('/compare', compareFares);

module.exports = router;
