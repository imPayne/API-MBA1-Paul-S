const express = require('express');
const router = express.Router();
const { Reservation, Terrain, User } = require('../models');

router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de récupération des réservations' });
  }
});

// Route pour créer une réservation
router.post('/', async (req, res) => {
  const { username, terrain_name, reservation_date, reservation_time, duration = 45 } = req.body;
  
  try {
    const getUser = await User.findOne({ where: { username } });

    if (!getUser) {
      res.status(400).json({ message: `L'utilisateur ${username} n'existe pas!` });
    }

    const reservationHour = parseInt(reservation_time.split(':')[0], 10);

    const getTerrain = await Terrain.findOne({ where: { name: terrain_name } });

    if (getTerrain.is_available === false) {
      res.status(400).json({ message: `Le terrain ${getTerrain.name} n'est pas disponible!` });
    }

    if (reservationHour < 10 || reservationHour > 22) {
      res.status(400).json({ message: 'Les réservations sont possibles uniquement entre 10h et 22h' });
    }

    const newReservation = await Reservation.create({ user_id: getUser.dataValues.id, terrain_id: getTerrain.dataValues.id, reservation_date, reservation_time, duration });
    res.status(201).json(newReservation);
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de création de la réservation' });
  }
});

module.exports = router;
