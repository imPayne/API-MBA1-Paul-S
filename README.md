# API-MBA1-Paul-S
Projet API M1 2024

## Table des matières

1. Initialisation du projet
    - Lancer le conteneur Docker
    - Lancer le back-end Express
    - Exécuter les migrations
    - Exécuter le Seeder
2. Documentation Swagger

---

## Initialisation du projet

### Lancer le conteneur Docker
1. Ouvrez un terminal et naviguez jusqu'à la racine de votre projet.
2. Exécutez la commande suivante pour lancer le conteneur Docker en mode détaché :
   ```bash
   docker compose up -d
   ```
   

### Lancer le back-end Express
1. Installer les dépendances (package.json) avec la commande suivante : 
    ```bash
    npm install
    ```
2. Une fois le conteneur Docker lancé, démarrez le serveur Express en exécutant la commande suivante :
   ```bash
   node app.js
   ```

### Exécuter les migrations
1. Après avoir lancé le serveur, exécutez les migrations de base de données avec la commande suivante :
   ```bash
   npx sequelize-cli db:migrate
   ```

### Exécuter le Seeder
1. Pour remplir la base de données avec des données d'exemple, exécutez la commande suivante :
   ```bash
   npx sequelize-cli db:seed:all
   ```

---

## Documentation Swagger

- Une fois votre serveur en marche, vous pouvez accéder à la documentation Swagger en suivant ce lien :  
  Documentation API Swagger (http://localhost:3000/api-docs)

## 1. **Gestion des Utilisateurs**

### a. **Créer un Utilisateur**
- **Endpoint**: `POST /api/users/`
- **Description**: Permet de créer un nouvel utilisateur avec un nom d'utilisateur, un mot de passe et un booléen is_admin.
- **Paramètres**:
    - `username` (string): Le nom d'utilisateur.
    - `password` (string): Le mot de passe de l'utilisateur.
    - `is_admin` (boolean): Le status de l'utilisateur (admin ou non).

# Dictionnaire des Données

## 1. **Model: Reservation**
La table `reservations` contient les informations concernant les réservations de terrains.

### Champs

| Nom du Champ         | Type de Donnée      | Description                                                                 |
|----------------------|---------------------|-----------------------------------------------------------------------------|
| `id`                 | INTEGER             | Identifiant unique de la réservation (clé primaire, auto-incrémenté).        |
| `user_id`            | INTEGER             | Identifiant de l'utilisateur ayant effectué la réservation (clé étrangère). |
| `terrain_id`         | INTEGER             | Identifiant du terrain réservé (clé étrangère).                             |
| `reservation_date`   | DATEONLY            | Date de la réservation.                                                     |
| `reservation_time`   | TIME                | Heure de la réservation.                                                    |
| `duration`           | INTEGER             | Durée de la réservation en minutes (par défaut 45 minutes).                 |

### Relations
- **`user_id`** est une clé étrangère qui fait référence à l'ID de l'utilisateur dans la table `users`.
- **`terrain_id`** est une clé étrangère qui fait référence à l'ID du terrain dans la table `terrains`.

### Index
- Un index unique est créé pour les champs `terrain_id`, `reservation_date` et `reservation_time` pour garantir qu'il n'y ait pas de réservations en double pour le même terrain à la même date et heure.

---

## 2. **Model: Terrain**
La table `terrains` contient les informations sur les terrains disponibles à la réservation.

### Champs

| Nom du Champ     | Type de Donnée  | Description                                                                         |
|------------------|-----------------|-------------------------------------------------------------------------------------|
| `id`             | INTEGER         | Identifiant unique du terrain (clé primaire, auto-incrémenté).                      |
| `name`           | CHAR(1)         | Nom du terrain (doit être unique).                                                  |
| `is_available`   | BOOLEAN         | Indicateur de disponibilité du terrain (true = disponible, false = non disponible). |

---

## 3. **Model: User**
La table `users` contient les informations des utilisateurs.

### Champs

| Nom du Champ     | Type de Donnée  | Description                                                                         |
|------------------|-----------------|-------------------------------------------------------------------------------------|
| `id`             | INTEGER         | Identifiant unique de l'utilisateur (clé primaire, auto-incrémenté).                |
| `username`       | STRING(50)      | Nom d'utilisateur (doit être unique).                                               |
| `password`       | STRING(255)     | Mot de passe de l'utilisateur (peut être nul).                                      |
| `is_admin`       | BOOLEAN         | Indicateur de rôle d'administrateur (true = administrateur, false = utilisateur).    |

---

### Remarque
- Les modèles `User`, `Terrain` et `Reservation` sont liés entre eux par des relations de clé étrangère, où `user_id` fait référence à l'utilisateur et `terrain_id` fait référence à un terrain réservé.


| **Ressource**               | **URL**                          | **Méthodes HTTP**                  | **Paramètres d'URL/Variations**                        | **Commentaires**                                        |
|-----------------------------|----------------------------------|------------------------------------|--------------------------------------------------------|--------------------------------------------------------|
| **Utilisateurs**             | `/users`                         | GET, POST                          | -                                                      | Récupère tous les utilisateurs (GET) / Crée un utilisateur (POST) |
| **Utilisateur spécifique**  | `/users/{id}`                    | GET, DELETE                        | `id`: identifiant de l'utilisateur                     | Récupère ou supprime un utilisateur spécifique par ID |
| **Terrains**                 | `/terrains`                      | GET                                | -                                                      | Récupère la liste de tous les terrains disponibles |
| **Terrain spécifique**      | `/terrains/{id}`                 | GET, PUT                           | `id`: identifiant du terrain                           | Récupère ou met à jour un terrain spécifique par ID |
| **Réservations**             | `/reservations`                  | GET, POST                          | -                                                      | Récupère toutes les réservations (GET) / Crée une réservation (POST) |
| **Réservation spécifique**  | `/reservations/{id}`             | GET, DELETE                        | `id`: identifiant de la réservation                     | Récupère ou supprime une réservation spécifique par ID |