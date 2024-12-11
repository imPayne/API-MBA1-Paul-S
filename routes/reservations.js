const express = require('express');
const router = express.Router();
const { Reservation } = require('../models');

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
  const { user_id, terrain_id, reservation_date, reservation_time, duration } = req.body;
  
  try {
    const newReservation = await Reservation.create({ user_id, terrain_id, reservation_date, reservation_time, duration });
    res.status(201).json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de création de la réservation' });
  }
});

module.exports = router;
