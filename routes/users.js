const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de récupération des utilisateurs' });
  }
});

// Route pour créer un utilisateur
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de création de l\'utilisateur' });
  }
});

module.exports = router;
