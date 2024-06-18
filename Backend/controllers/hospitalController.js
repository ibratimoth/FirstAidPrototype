const Hospital = require('../models/hospitalModel');

const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const addHospital = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
  
    try {
      const newHospital = new Hospital({
        name,
        address,
        latitude,
        longitude,
      });
  
      const hospital = await newHospital.save();
      res.json(hospital);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  };
  
module.exports = {
  getHospitals,
  addHospital
};
