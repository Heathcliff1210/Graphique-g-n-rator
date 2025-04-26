/**
 * Script pour corriger les problèmes de compatibilité esbuild
 * 
 * Ce script doit être exécuté avant l'installation des dépendances
 * si vous rencontrez des erreurs avec esbuild.
 * 
 * Usage: node esbuild-fix.js
 */

const fs = require('fs');
const path = require('path');

// Version d'esbuild compatible
const compatibleVersion = "0.21.5";

try {
  // Modifier package.json pour utiliser une version spécifique d'esbuild
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = require(packageJsonPath);
  
  // Mettre à jour les dépendances
  if (packageJson.devDependencies && packageJson.devDependencies.esbuild) {
    packageJson.devDependencies.esbuild = compatibleVersion;
  }
  
  if (packageJson.dependencies && packageJson.dependencies.esbuild) {
    packageJson.dependencies.esbuild = compatibleVersion;
  }
  
  // Écrire le fichier mis à jour
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log(`✅ package.json mis à jour avec esbuild v${compatibleVersion}`);
  console.log('👉 Exécutez maintenant "npm install" pour installer les dépendances mises à jour');
} catch (error) {
  console.error('❌ Erreur lors de la mise à jour de package.json:', error);
  process.exit(1);
}