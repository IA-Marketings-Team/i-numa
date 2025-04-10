
# Blueprint: i-numa Application

## Vue d'ensemble du Système

L'application i-numa est une plateforme de gestion de clients et de dossiers pour professionnels. Elle permet aux utilisateurs (agents, superviseurs, responsables) de gérer leurs interactions avec les clients, de suivre l'état des dossiers, et d'analyser les performances de l'équipe.

## Architecture Technique

### Pile Technologique
- **Frontend**: React + TypeScript
- **UI**: Tailwind CSS + Shadcn/UI
- **Gestion d'état**: Contexts API + React Query
- **Routage**: React Router
- **Base de données**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

### Structure de l'Application

```
src/
├── components/     # Composants réutilisables
├── contexts/       # Contexts React pour l'état global
├── hooks/          # Hooks personnalisés
├── integrations/   # Intégrations externes (Supabase)
├── pages/          # Pages/Routes de l'application
├── services/       # Services d'accès aux données
├── types/          # Définitions de types TypeScript
└── utils/          # Fonctions utilitaires
```

## Flux d'Authentification

1. L'utilisateur se connecte via la page de connexion (`/connexion`)
2. Le composant `LoginForm` envoie les identifiants via `useAuth().login()`
3. Le context `AuthContext` utilise `supabase.auth.signInWithPassword()`
4. Une fois authentifié, l'utilisateur est redirigé vers sa page par défaut en fonction de son rôle
5. Le composant `AuthGuard` protège les routes qui nécessitent une authentification
6. Le composant `ProtectedRoute` applique les restrictions basées sur les rôles

## Modèle de Données

### Utilisateurs (profiles)
- **id**: string (UUID)
- **nom**: string
- **prenom**: string
- **email**: string
- **telephone**: string
- **role**: enum ('client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable')
- **date_creation**: timestamp
- **adresse**: string
- **ville**: string
- **code_postal**: string
- **autres champs spécifiques au rôle...**

### Dossiers
- **id**: string (UUID)
- **client_id**: string (UUID, clé étrangère)
- **agent_phoner_id**: string (UUID, clé étrangère)
- **agent_visio_id**: string (UUID, clé étrangère)
- **statut**: enum ('prospect_chaud', 'prospect_froid', 'rdv_honore', 'rdv_non_honore', 'valide', 'signe')
- **date_creation**: timestamp
- **date_rdv**: timestamp
- **notes**: string
- **montant**: number

### Consultations de Dossiers (dossier_consultations)
- **id**: string (UUID)
- **dossier_id**: string (UUID, clé étrangère)
- **user_id**: string (UUID, clé étrangère)
- **user_name**: string
- **user_role**: string
- **timestamp**: timestamp
- **action**: string

### Offres
- **id**: string (UUID)
- **nom**: string
- **description**: string
- **prix**: number
- **categorie**: string
- **actif**: boolean

### Autres Tables
- **rendez_vous**: Gestion des rendez-vous
- **communications**: Historique des communications
- **tasks**: Tâches assignées aux utilisateurs
- **auth_logs**: Historique des connexions/déconnexions

## Diagramme de Relations

```
profiles <-- dossiers --> dossier_consultations
  ^
  |
 auth_logs

profiles <-- rendez_vous
profiles <-- tasks
profiles <-- communications
```

## Rôles Utilisateurs et Permissions

### Client
- Accès à ses propres dossiers
- Consultation des offres
- Consultation de son agenda

### Agent Phoner
- Gestion des prospects
- Planification de rendez-vous
- Consultation des statistiques personnelles

### Agent Visio
- Gestion des rendez-vous
- Validation des dossiers
- Consultations vidéo avec les clients

### Superviseur
- Supervision des agents
- Accès aux statistiques d'équipe
- Gestion des tâches

### Responsable
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs
- Configuration du système

## Composants Principaux

### Layout
- **Layout**: Structure principale de l'application
- **Header**: Barre de navigation supérieure
- **Sidebar**: Menu latéral adapté au rôle de l'utilisateur

### Authentication
- **LoginForm**: Formulaire de connexion
- **RegisterForm**: Formulaire d'inscription
- **AuthGuard**: Protection des routes authentifiées
- **ProtectedRoute**: Protection basée sur les rôles

### Dashboard
- **RoleBasedDashboard**: Tableau de bord adapté au rôle
- **ClientDashboard**, **AgentPhonerDashboard**, etc.

### Dossiers
- **DossierList**: Liste des dossiers
- **DossierDetail**: Détails d'un dossier
- **DossierForm**: Formulaire de création/édition

### Clients
- **ClientList**: Liste des clients
- **ClientDetail**: Détails d'un client
- **ClientForm**: Formulaire de création/édition

### Autres
- **AgendaPage**: Gestion des rendez-vous
- **StatistiquesPage**: Analyse des performances
- **OffresPage**: Gestion des offres
- **TasksPage**: Gestion des tâches

## Pages Principales

| Route | Composant | Description |
|-------|-----------|-------------|
| / | Index | Redirection basée sur le rôle |
| /connexion | LoginPage | Page de connexion |
| /inscription | RegisterPage | Page d'inscription |
| /tableau-de-bord | DashboardPage | Tableau de bord principal |
| /clients | ClientsPage | Liste des clients |
| /clients/:id | ClientDetailPage | Détails d'un client |
| /dossiers | DossiersPage | Liste des dossiers |
| /dossiers/:id | DossierDetailsPage | Détails d'un dossier |
| /agenda | AgendaPage | Calendrier des rendez-vous |
| /statistiques | StatistiquesPage | Tableaux et graphiques |
| /mes-offres | OffresPage | Gestion des offres |
| /marketplace | MarketplacePage | Boutique d'offres |
| /profil | ProfilePage | Profil utilisateur |

## Services

### authService
Gère les opérations d'authentification et de gestion des utilisateurs.

### clientService
Gère les opérations CRUD pour les clients.

### dossierService
Gère les opérations CRUD pour les dossiers, y compris les transitions d'état.

### offreService
Gère les opérations CRUD pour les offres et produits.

### consultationService
Enregistre et récupère les consultations de dossiers.

### dynamicStatService
Calcule et fournit des statistiques dynamiques pour le tableau de bord.

## Contexts

### AuthContext
Gère l'état d'authentification global et les informations de l'utilisateur.

### DossierContext
Fournit l'accès aux dossiers à travers l'application.

### CartContext
Gère le panier d'achat pour la marketplace.

### StatistiqueContext
Gère les données statistiques pour les tableaux de bord.

## Hooks Personnalisés

### useAuthState
Gère l'état local de l'authentification.

### useDossierForm
Logique du formulaire de dossier.

### useRoleBasedNavigation
Fournit les éléments de navigation adaptés au rôle.

### useDynamicStats
Récupère et formate les statistiques pour les tableaux de bord.

## Fonctionnalités Principales

### Gestion des Clients
- Création, modification, suppression de clients
- Import de clients via CSV
- Détails et historique des clients

### Gestion des Dossiers
- Création, modification, suivi des dossiers
- Transitions d'état (prospect → RDV → validé → signé)
- Attribution d'agents phoneur et visio

### Agenda et Rendez-vous
- Vue mensuelle et hebdomadaire
- Création et gestion des rendez-vous
- Notifications de rappel

### Communications
- Historique des appels
- Planification de rendez-vous
- Envoi de communications

### Marketplace
- Catalogue d'offres
- Panier d'achat
- Système de recommandation

### Statistiques et Rapports
- Tableaux de bord
- Graphiques de performance
- Métriques de conversion

## Flux de Navigation

1. L'utilisateur se connecte via `/connexion`
2. Redirection vers `/tableau-de-bord` adapté au rôle
3. Navigation via la barre latérale vers les fonctionnalités adaptées au rôle
4. Accès au profil et paramètres via le menu déroulant en haut à droite
5. Déconnexion qui redirige vers `/connexion`

## Stratégie de Gestion d'État

- **Auth**: Context API pour l'état global d'authentification
- **Dossiers/Clients**: Context API pour l'accès global
- **Statistiques**: Context API pour les données de tableau de bord
- **Formulaires**: State local avec React Hooks
- **Données d'API**: React Query pour la mise en cache et la revalidation

## Traitement des Erreurs

- Toast notifications pour les erreurs utilisateur
- Console logging détaillé pour le débogage
- Composants d'erreur pour les pages non trouvées (`NotFoundPage`)
- Gestion des permissions avec redirection vers `UnauthorizedPage`

## Stratégie de Tests

- Tests unitaires pour les services et utilitaires
- Tests de composants pour l'interface utilisateur
- Tests d'intégration pour les flux principaux
- Tests end-to-end pour les scénarios critiques

## Optimisations de Performance

- Mise en cache des résultats d'API avec React Query
- Chargement progressif des données volumineuses
- Pagination pour les listes longues
- Composants optimisés avec React.memo lorsque nécessaire

## Considérations de Sécurité

- Authentification via Supabase Auth
- Protection des routes par rôle
- Validation des entrées côté client et serveur
- Journal d'audit des actions sensibles (auth_logs)
- RLS (Row Level Security) dans Supabase pour les données sensibles

## Extensions Futures

- Intégration de services de paiement
- Système de notifications en temps réel
- Application mobile companion
- Intelligence artificielle pour les recommandations
- Système d'automatisation des tâches
