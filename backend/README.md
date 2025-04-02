
# I-Numa Backend API

API backend pour l'application I-Numa, développée avec Node.js, Express et MongoDB.

## Configuration requise

- Node.js (v14.x ou supérieur)
- MongoDB

## Installation

1. Cloner le dépôt
2. Installer les dépendances :
   ```
   npm install
   ```
3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   MONGODB_URI=votre_uri_mongodb
   JWT_SECRET=votre_secret_jwt
   PORT=5000
   ```

## Démarrage

### Mode développement
```
npm run dev
```

### Mode production
```
npm start
```

## Structure de l'API

L'API est organisée autour des ressources suivantes :

- `/api/auth` - Authentification et gestion des utilisateurs
- `/api/users` - Gestion des utilisateurs
- `/api/dossiers` - Gestion des dossiers clients
- `/api/offres` - Gestion des offres
- `/api/teams` - Gestion des équipes
- `/api/tasks` - Gestion des tâches
- `/api/rendez-vous` - Gestion des rendez-vous
- `/api/notifications` - Gestion des notifications
- `/api/statistiques` - Gestion des statistiques

## Sécurité

L'API utilise JWT pour l'authentification. Tous les points d'accès (sauf l'inscription et la connexion) nécessitent un token JWT valide dans l'en-tête `x-auth-token`.

## Rôles utilisateurs

- `client` - Client standard
- `agent_phoner` - Agent téléphonique
- `agent_visio` - Agent visio
- `agent_developpeur` - Développeur
- `agent_marketing` - Agent marketing
- `superviseur` - Superviseur d'équipe
- `responsable` - Responsable de l'entreprise

Chaque rôle a des permissions spécifiques sur les différentes routes de l'API.
