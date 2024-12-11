const express = require('express');
const router = express.Router();
const { User } = require('../models');
const {user} = require("pg/lib/native");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     description: Retourne une liste de tous les utilisateurs enregistrés.
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erreur lors de la récupération des utilisateurs.
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();

    const halResponse = {
      _links: {
        self: { href: `${req.protocol}://${req.get('host')}/users` },
      },

          _links: {
            self: { href: `${req.protocol}://${req.get('host')}/users/${user.id}` },
          },


    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de récupération des utilisateurs' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Permet de créer un utilisateur avec un nom d'utilisateur et un mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Erreur lors de la création de l'utilisateur.
 */
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Validation des données d'entrée
  if (!username || !password) {
    return res.status(400).json({ message: 'Le nom d\'utilisateur et le mot de passe sont obligatoires.' });
  }

  try {
    // Création de l'utilisateur
    const newUser = await User.create({ username, password });

    const userHAL = {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      _links: {
        self: {
          href: `${req.protocol}://${req.get('host')}/users/${newUser.id}`
        },
        allUsers: {
          href: `${req.protocol}://${req.get('host')}/users`
        }
      }
    };

    res.status(201).json(userHAL);
  } catch (error) {
    console.error(error);

    // Gestion des erreurs (par exemple : violation d'unicité)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ce nom d\'utilisateur est déjà pris.' });
    }

    res.status(500).json({ message: 'Erreur de création de l\'utilisateur' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur spécifique
 *     description: Permet de récupérer les détails d'un utilisateur en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'utilisateur à récupérer.
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur récupérés avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur lors de la récupération de l'utilisateur.
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Construction de la réponse HAL
    const userHAL = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      _links: {
        self: {
          href: `${req.protocol}://${req.get('host')}/users/${user.id}`
        },
        allUsers: {
          href: `${req.protocol}://${req.get('host')}/users`
        }
      }
    };

    res.status(200).json(userHAL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Impossible de récupérer l'utilisateur." });
  }
});


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     description: Supprime un utilisateur spécifique en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'utilisateur à supprimer.
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur lors de la suppression de l'utilisateur.
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await User.destroy({ where: { id: req.params.id } });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Construction de la réponse HAL
    const responseHAL = {
      message: 'Utilisateur supprimé avec succès.',
      _links: {
        allUsers: {
          href: `${req.protocol}://${req.get('host')}/users`
        }
      }
    };

    res.status(200).json(responseHAL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Echec de la suppression de l'utilisateur." });
  }
});


module.exports = router;
