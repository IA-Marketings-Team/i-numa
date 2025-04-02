
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dossierRoutes = require('./routes/dossiers');
const offreRoutes = require('./routes/offres');
const teamRoutes = require('./routes/teams');
const taskRoutes = require('./routes/tasks');
const rendezVousRoutes = require('./routes/rendezVous');
const notificationRoutes = require('./routes/notifications');
const statistiqueRoutes = require('./routes/statistiques');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB établie'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dossiers', dossierRoutes);
app.use('/api/offres', offreRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rendez-vous', rendezVousRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/statistiques', statistiqueRoutes);

// Route de base
app.get('/', (req, res) => {
  res.send('API I-Numa fonctionne correctement');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
