# Générateur de graphique de statistiques

## À propos du projet

Une application web pour générer facilement des graphiques de statistiques personnalisés et les exporter en haute qualité.

## Fonctionnalités

- Création de graphiques de statistiques radar 
- Personnalisation du nombre de statistiques (3 à 12)
- Système de classement hiérarchique (F à UR)
- Export en PNG avec ou sans fond transparent
- Interface intuitive en français

## Développeur

Ce projet a été développé par Izumi Hearthcliff.

## Comment utiliser ce code ?

**Utiliser votre IDE préféré**

Pour travailler localement avec votre propre IDE, vous pouvez cloner ce dépôt.

Le seul prérequis est d'avoir Node.js et npm installés - [installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Suivez ces étapes :

```sh
# Étape 1 : Cloner le dépôt en utilisant l'URL Git du projet.
git clone <URL_GIT_DU_PROJET>

# Étape 2 : Naviguer vers le répertoire du projet.
cd <NOM_DU_PROJET>

# Étape 3 : Installer les dépendances nécessaires.
npm i

# Étape 4 : Démarrer le serveur de développement avec rechargement automatique.
npm run dev
```

**Modifier un fichier directement sur GitHub**

- Naviguer vers le(s) fichier(s) souhaité(s).
- Cliquer sur le bouton "Edit" (icône crayon) en haut à droite de la vue du fichier.
- Faire vos modifications et les valider.

**Utiliser GitHub Codespaces**

- Naviguer vers la page principale de votre dépôt.
- Cliquer sur le bouton "Code" (bouton vert) près du coin supérieur droit.
- Sélectionner l'onglet "Codespaces".
- Cliquer sur "New codespace" pour lancer un nouvel environnement Codespace.
- Modifier les fichiers directement dans le Codespace et valider vos modifications une fois terminé.

## Technologies utilisées dans ce projet

Ce projet est construit avec :

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Comment déployer ce projet ?

### Déploiement sur Render

1. Connectez-vous à [Render](https://render.com/)
2. Créez un nouveau "Static Site"
3. Connectez votre dépôt GitHub
4. Configuration de build :
   - Build Command : `npm run build`
   - Publish Directory : `dist`
5. Cliquez sur "Create Static Site"

### Autres options de déploiement

Ce projet peut également être déployé sur Vercel, Netlify ou tout autre hébergeur qui prend en charge les applications React/Vite.
