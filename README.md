# TP 7 – Explorateur d'API REST (REST Countries)
**TP global 3/4 – fetch, chargement, erreurs**  
*ENSA Safi – Génie Informatique*  
*Enseignant : Pr. Ahmed Bentajer*  
*Étudiants : Mouad Elkarari & Saad-Eddine Hossainy*

---

## 🎯 Objectifs du TP

1. **Récupérer des données depuis une véritable API REST** avec l'API standard `fetch()`.
2. **Gérer les trois états d'un appel asynchrone** :
   - ⏳ **En cours (`loading = true`)** : affichage d'un indicateur de chargement / spinner.
   - ✅ **Réussi (`loading = false`, données reçues)** : rendu des cartes de pays.
   - ❌ **En erreur (`error = "..."`)** : affichage d'un message d'erreur clair et possibilité de réessayer.
3. **Enchaîner `async/await` avec les hooks de cycle de vie** de Vue (`mounted`).
4. **Comprendre et contourner le piège classique de `fetch()`** : vérifier impérativement `if (!reponse.ok)` car un code HTTP 404 ou 500 ne rejette pas la promesse.
5. **Gérer la réutilisation des composants par Vue Router (Bonus)** : utiliser un `watch` sur `$route.params.code` pour rafraîchir les données lors de la navigation entre pays frontaliers sans remontage du composant.

---

## 🚀 Démarrage du projet

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur de développement Vite
```bash
npm run dev
```
L'application est accessible à l'adresse : **`http://localhost:5173/`**

### 3. Compilation pour la production
```bash
npm run build
```

---

## 🏗️ Architecture et Structure des Fichiers

```text
ELKARARI_MOUAD_TP7/
├── index.html                        # Point d'entrée HTML
├── package.json                      # Dépendances Vue 3, Vue Router 4, Vite
├── vite.config.js                    # Configuration de Vite avec alias '@'
├── public/
│   └── countriesV3.1.json            # Jeu de données miroir REST Countries v3.1
└── src/
    ├── main.js                       # Point d'entrée JS (initialisation de Vue et Vue Router)
    ├── style.css                     # Styles CSS modernes et variables globales
    ├── App.vue                       # Layout principal (barre de navigation, router-view, footer)
    ├── router/
    │   └── index.js                  # Définition des routes : '/' et '/pays/:code'
    ├── components/
    │   └── CountryCard.vue           # Composant réutilisable pour afficher la carte d'un pays
    └── views/
        ├── CountryListView.vue       # Page principale avec liste, recherche et filtre
        └── CountryDetailView.vue     # Page détaillée par pays avec pays frontaliers (Bonus watch)
```

---

## 📝 Réponses détaillées aux sections du TP

### 1. Liste des pays (`CountryListView.vue`)
- **Méthode `chargerPays()`** :
  - Active l'état `loading = true` et réinitialise `error = null`.
  - Appelle `fetch(API_URL)`.
  - Valide la réponse avec `if (!reponse.ok) throw new Error(...)`.
  - Intègre une bascule automatique de secours vers le miroir local / raw GitHub si l'API REST Countries publique est dépréciée ou inaccessible.
  - Réinitialise `loading = false` dans le bloc `finally`.
- **Propriété calculée `paysAffiches`** :
  - Filtre la liste des pays selon la valeur de `this.recherche`.
  - Compare la chaîne de recherche avec `country.name.common` en utilisant `.toLowerCase()` pour une comparaison insensible à la casse.

### 2. Fiche détail (`CountryDetailView.vue`)
- **Récupération du paramètre d'URL** :
  - Le code du pays est extrait via `this.$route.params.code`.
- **Méthode `chargerPays()`** :
  - Interroge l'endpoint `https://restcountries.com/v3.1/alpha/${code}`.
  - **Gestion de la forme de réponse** : l'API peut retourner soit un objet direct `{ ... }`, soit un tableau d'un seul élément `[ { ... } ]`. Le code gère les deux cas :
    ```javascript
    if (Array.isArray(rawData)) {
      this.country = rawData[0] || null;
    } else {
      this.country = rawData;
    }
    ```
- **Affichage complet** :
  - Drapeau haute résolution et armoiries nationales.
  - Nom commun et nom officiel.
  - Capitale, région, sous-région, population formatée avec séparateurs de milliers, superficie en km².
  - Langues officielles et devises (noms et symboles).
  - Lien direct vers Google Maps.

### 3. Bonus : Navigation dynamique entre fiches (`watch`)
- **Problématique** :
  Lorsque l'utilisateur consulte un pays (ex: `/pays/MAR`) et clique sur un pays frontalier voisin (ex: `/pays/ESP`), le chemin correspond au même composant de route (`CountryDetailView`). Pour des raisons d'optimisation, Vue Router **réutilise l'instance existante du composant** et n'appelle pas à nouveau le hook `mounted()`.
- **Solution mise en place** :
  Ajout d'un observateur (`watch`) sur `$route.params.code` :
  ```javascript
  watch: {
    '$route.params.code'(newCode, oldCode) {
      if (newCode && newCode !== oldCode) {
        this.chargerPays();
      }
    }
  }
  ```
  Dès que le paramètre de route change, `chargerPays()` est automatiquement invoquée et la nouvelle fiche s'affiche instantanément.

---

## 🛡️ Le Piège classique de `fetch()`

Contrairement à des bibliothèques comme Axios, **l'API `fetch()` ne rejette une promesse QUE lors d'un échec réseau critique** (perte de connexion, échec DNS).  
Une erreur HTTP telle qu'un code **404 Not Found** ou **500 Internal Server Error** est considérée comme une requête réussie par `fetch` (`response.ok` vaut `false`, mais la promesse est résolue).  

Sans la vérification systématique :
```javascript
if (!reponse.ok) {
  throw new Error(`Erreur ${reponse.status}`);
}
```
l'erreur passerait inaperçue et le traitement suivant (ex: `reponse.json()`) échouerait plus tard avec un message incompréhensible pour l'utilisateur.
