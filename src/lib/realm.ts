
import * as Realm from 'realm-web';

// Remplacez APP_ID par votre ID d'application MongoDB Realm
export const APP_ID = 'application-0-abcde'; // À remplacer par votre vrai APP_ID

// Créer une instance d'application Realm
let app: Realm.App;

// Initialiser l'application Realm
export function getRealmApp() {
  if (!app) {
    app = new Realm.App({ id: APP_ID });
  }
  return app;
}

// Fonction pour se connecter avec un utilisateur anonyme
export async function loginAnonymous() {
  const app = getRealmApp();
  const credentials = Realm.Credentials.anonymous();
  try {
    const user = await app.logIn(credentials);
    console.log("Connecté à Realm en tant qu'utilisateur anonyme");
    return user;
  } catch (error) {
    console.error("Erreur de connexion à Realm:", error);
    throw error;
  }
}

// Fonction pour se connecter avec email/password
export async function loginEmailPassword(email: string, password: string) {
  const app = getRealmApp();
  const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    const user = await app.logIn(credentials);
    console.log("Connecté à Realm avec email/password");
    return user;
  } catch (error) {
    console.error("Erreur de connexion à Realm:", error);
    throw error;
  }
}

// Récupérer l'utilisateur actuel
export function getCurrentUser() {
  const app = getRealmApp();
  return app.currentUser;
}

// Déconnexion
export async function logout() {
  const app = getRealmApp();
  if (app.currentUser) {
    await app.currentUser.logOut();
    console.log("Déconnecté de Realm");
  }
}
