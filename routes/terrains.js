const express = require('express');
const router = express.Router();
const { Terrain } = require('../models');

router.get('/', async (req, res) => {
  try {
    const terrains = await Terrain.findAll();
    res.status(200).json(terrains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de récupération des terrains' });
  }
});

// Route pour créer un terrain
router.post('/', async (req, res) => {
  const { name, is_available } = req.body;
  
  try {
    const newTerrain = await Terrain.create({ name, is_available });
    res.status(201).json(newTerrain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de création du terrain' });
  }
});

module.exports = router;
