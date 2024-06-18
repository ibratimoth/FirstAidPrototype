const express = require('express');
const { getHospitals, addHospital } = require('../controllers/hospitalController');

const router = express.Router();

router.get('/hospitals', getHospitals);

router.post('/createhospitals', addHospital);

module.exports = router;