const express = require('express');
const router = express.Router();
const { Reservation, Terrain, User } = require('../models');

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Récupère toutes les réservations
 *     description: Retourne une liste de toutes les réservations existantes.
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   terrain_id:
 *                     type: integer
 *                   reservation_date:
 *                     type: string
 *                     format: date
 *                   reservation_time:
 *                     type: string
 *                     format: time
 *                   duration:
 *                     type: integer
 *       500:
 *         description: Erreur lors de la récupération des réservations.
 */
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll();

    const reservationsWithLinks = reservations.map(reservation => ({
      ...reservation.dataValues,
      _links: {
        self: { href: `/reservations/${reservation.id}` },
        user: { href: `/users/${reservation.user_id}` },
        terrain: { href: `/terrains/${reservation.terrain_id}` },
      },
    }));

    res.status(200).json({
      _links: {
        self: { href: '/reservations' },
      },
      _embedded: {
        reservations: reservationsWithLinks,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de récupération des réservations' });
  }
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     description: Permet de créer une nouvelle réservation pour un utilisateur sur un terrain spécifique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - terrain_name
 *               - reservation_date
 *               - reservation_time
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur effectuant la réservation.
 *               terrain_name:
 *                 type: string
 *                 description: Le nom du terrain à réserver.
 *               reservation_date:
 *                 type: string
 *                 format: date
 *                 description: La date de la réservation (format AAAA-MM-JJ).
 *               reservation_time:
 *                 type: string
 *                 format: time
 *                 description: L'heure de la réservation (format HH:mm:ss).
 *               duration:
 *                 type: integer
 *                 default: 45
 *                 description: La durée de la réservation en minutes.
 *     responses:
 *       201:
 *         description: Réservation créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 terrain_id:
 *                   type: integer
 *                 reservation_date:
 *                   type: string
 *                   format: date
 *                 reservation_time:
 *                   type: string
 *                   format: time
 *                 duration:
 *                   type: integer
 *       400:
 *         description: Problème avec les données fournies pour la réservation.
 *       500:
 *         description: Erreur lors de la création de la réservation.
 */
router.post('/', async (req, res) => {
  const { username, terrain_name, reservation_date, reservation_time, duration = 45 } = req.body;

  try {
    const getUser = await User.findOne({ where: { username } });
    if (!getUser) {
      return res.status(400).json({ message: `L'utilisateur ${username} n'existe pas!` });
    }

    const reservationHour = parseInt(reservation_time.split(':')[0], 10);
    const getTerrain = await Terrain.findOne({ where: { name: terrain_name } });

    if (getTerrain.is_available === false) {
      return res.status(400).json({ message: `Le terrain ${getTerrain.name} n'est pas disponible!` });
    }

    if (reservationHour < 10 || reservationHour > 22) {
      return res.status(400).json({ message: 'Les réservations sont possibles uniquement entre 10h et 22h' });
    }

    const newReservation = await Reservation.create({
      user_id: getUser.dataValues.id,
      terrain_id: getTerrain.dataValues.id,
      reservation_date,
      reservation_time,
      duration,
    });

    res.status(201).json({
      ...newReservation.dataValues,
      _links: {
        self: { href: `/reservations/${newReservation.id}` },
        user: { href: `/users/${newReservation.user_id}` },
        terrain: { href: `/terrains/${newReservation.terrain_id}` },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de création de la réservation' });
  }
});

module.exports = router;
