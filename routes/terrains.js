const express = require('express');
const router = express.Router();
const { Reservation, Terrain, User } = require('../models');

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

router.patch('/:id', async (req, res) => {
  const { username, password, is_available } = req.body;
  const { id } = req.params; // ID du terrain à modifier

  try {
    const adminUser = await User.findOne({ where: { username, password, is_admin: true } });
    if (!adminUser) {
      return res.status(403).json({ message: "Accès interdit. Seuls les administrateurs peuvent effectuer cette action." });
    }

    const terrain = await Terrain.findByPk(id);
    if (!terrain) {
      return res.status(404).json({ message: "Terrain introuvable." });
    }

    if (is_available === terrain.is_available) {
      return res.status(400).json({ message: "La disponibilité du terrain n'a pas changé." });
    }

    terrain.is_available = is_available;
    await terrain.save();

    res.status(200).json({ message: `La disponibilité du terrain ${terrain.name} a été mise à jour avec succès.`, terrain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité du terrain." });
  }
});

module.exports = router;
