const express = require('express');
const router = express.Router();
const { Reservation, Terrain, User } = require('../models');

/**
 * @swagger
 * /terrains:
 *   get:
 *     summary: Récupère tous les terrains
 *     description: Retourne une liste de tous les terrains disponibles.
 *     responses:
 *       200:
 *         description: Liste des terrains récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   is_available:
 *                     type: boolean
 *       500:
 *         description: Erreur lors de la récupération des terrains.
 */
router.get('/', async (req, res) => {
  try {
    const terrains = await Terrain.findAll();

    // Transformation des terrains en réponse HAL
    const halTerrains = terrains.map(terrain => ({
      id: terrain.dataValues.id,  // Accéder via dataValues
      name: terrain.dataValues.name,
      is_available: terrain.dataValues.is_available,
      _links: {
        self: { href: `/terrains/${terrain.dataValues.id}` },
      },
    }));

    res.status(200).json(halTerrains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de récupération des terrains' });
  }
});

/**
 * @swagger
 * /terrains:
 *   post:
 *     summary: Crée un nouveau terrain
 *     description: Permet de créer un terrain avec un nom et une disponibilité initiale.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - is_available
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du terrain.
 *               is_available:
 *                 type: boolean
 *                 description: La disponibilité initiale du terrain.
 *     responses:
 *       201:
 *         description: Terrain créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 is_available:
 *                   type: boolean
 *       500:
 *         description: Erreur lors de la création du terrain.
 */
router.post('/', async (req, res) => {
  const { name, is_available } = req.body;

  try {
    const newTerrain = await Terrain.create({ name, is_available });

    // Réponse avec liens HAL
    const halTerrain = {
      id: newTerrain.dataValues.id,  // Accéder via dataValues
      name: newTerrain.dataValues.name,
      is_available: newTerrain.dataValues.is_available,
      _links: {
        self: { href: `/terrains/${newTerrain.dataValues.id}` },
      },
    };

    res.status(201).json(halTerrain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de création du terrain' });
  }
});

/**
 * @swagger
 * /terrains/{id}:
 *   patch:
 *     summary: Modifie la disponibilité d'un terrain
 *     description: Permet à un administrateur de modifier la disponibilité d'un terrain spécifique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID du terrain à modifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - is_available
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur de l'administrateur.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'administrateur.
 *               is_available:
 *                 type: boolean
 *                 description: La nouvelle disponibilité du terrain.
 *     responses:
 *       200:
 *         description: Disponibilité du terrain mise à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 terrain:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     is_available:
 *                       type: boolean
 *       400:
 *         description: Erreur dans les données fournies ou aucune modification effectuée.
 *       403:
 *         description: Accès interdit. Seuls les administrateurs peuvent modifier la disponibilité.
 *       404:
 *         description: Terrain introuvable.
 *       500:
 *         description: Erreur lors de la mise à jour de la disponibilité du terrain.
 */
router.patch('/:id', async (req, res) => {
  const { username, password, is_available } = req.body;
  const { id } = req.params;

  try {
    // Vérification de l'utilisateur administrateur
    const adminUser = await User.findOne({ where: { username, password, is_admin: true } });

    if (!adminUser) {
      return res.status(403).json({ message: "Accès interdit. Seuls les administrateurs peuvent effectuer cette action." });
    }

    // Recherche du terrain
    const terrain = await Terrain.findByPk(id);
    if (!terrain) {
      return res.status(404).json({ message: "Terrain introuvable." });
    }

    // Vérification de la disponibilité du terrain
    if (is_available === terrain.is_available) {
      return res.status(400).json({ message: "La disponibilité du terrain n'a pas changé." });
    }

    // Mise à jour de la disponibilité du terrain
    terrain.is_available = is_available;
    await terrain.save();

    // Réponse avec format HAL
    const halTerrain = {
      id: terrain.dataValues.id,  // Accéder via dataValues
      name: terrain.dataValues.name,
      is_available: terrain.dataValues.is_available,
      _links: {
        self: { href: `/terrains/${terrain.dataValues.id}` },  // Lien vers ce terrain
      },
    };

    // Retour de la réponse avec message
    res.status(200).json({
      message: `La disponibilité du terrain ${terrain.dataValues.name} a été mise à jour avec succès.`,
      terrain: halTerrain,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité du terrain." });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const terrain = await Terrain.findByPk(req.params.id);

    if (!terrain) {
      return res.status(404).json({ message: 'Terrain non trouvé' });
    }

    const halResponse = {
      _links: {
        self: { href: `/v1/terrains/${terrain.id}` },
        terrains: { href: '/v1/terrains' },
        update: { href: `/v1/terrains/${terrain.id}/update` }, // Exemple de lien pour la mise à jour du terrain
        delete: { href: `/v1/terrains/${terrain.id}/delete` }  // Exemple de lien pour la suppression du terrain
      },
      id: terrain.id,
      disponibilite: terrain.disponibilite
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de récupération du terrain' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Terrain.destroy({ where: { id: req.params.id } });
    if (deletedRowsCount === 0) {
      return res.status(404).json({
        message: 'Terrain introuvable.'
      });
    }

    const halResponse = {
      _links: {
        self: { href: `/v1/terrains/${req.params.id}` },
        terrains: { href: '/v1/terrains' }
      },
      message: 'Terrain supprimé avec succès.'
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de suppression du terrain' });
  }
});

module.exports = router;
