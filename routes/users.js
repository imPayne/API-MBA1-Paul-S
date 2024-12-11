const express = require('express');
const router = express.Router();
const { User } = require('../models');

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

    // Construction de la réponse HAL avec des liens et des données
    const response = {
      _links: {
        self: { href: '/users' }, // Lien vers la ressource actuelle
        // Vous pouvez ajouter d'autres liens si nécessaire (ex : pagination, autres collections, etc.)
      },
      _embedded: {
        users: users.map(user => ({
          ...user.toJSON(),  // Assurez-vous que `user.toJSON()` est un objet ou une forme sérialisée du modèle
          _links: {
            self: { href: `/users/${user.id}` },  // Lien vers l'élément utilisateur spécifique
          }
        }))
      }
    };

    // Envoi de la réponse avec un statut 200 (OK)
    res.status(200).json(response);
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

  try {
    const newUser = await User.create({ username, password });

    // Construction de la réponse HAL pour la nouvelle ressource utilisateur
    const response = {
      _links: {
        self: { href: `/users/${newUser.id}` }, // Lien vers la ressource nouvellement créée
      },
      ...newUser.toJSON(),  // Ajout des propriétés de l'utilisateur créé
    };

    // Envoi de la réponse avec le statut 201 (Créé)
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
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

    // Construction de la réponse HAL pour l'utilisateur
    const response = {
      _links: {
        self: { href: `/users/${user.id}` }, // Lien vers la ressource de cet utilisateur
      },
      ...user.toJSON(),  // Ajout des propriétés de l'utilisateur récupéré
    };

    res.status(200).json(response);
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
      return res.status(404).json({
        message: 'Utilisateur introuvable.',
        _links: {
          self: { href: `/users/${req.params.id}` }, // Lien vers la ressource qui a été tentée d'être supprimée
        },
      });
    }

    // Réponse de succès, y compris un lien vers une autre action possible, comme la liste des utilisateurs
    const response = {
      message: 'Utilisateur supprimé avec succès.',
      _links: {
        self: { href: `/users/${req.params.id}` },
        users: { href: '/users' },  // Lien vers la liste des utilisateurs
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Echec de la suppression de l'utilisateur",
      _links: {
        self: { href: `/users/${req.params.id}` }, // Lien vers la ressource tentée d'être supprimée
      },
    });
  }
});

module.exports = router;
