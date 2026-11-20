# Contenus prêts à modifier

`npm run content:prepare` complète les rubriques publiques de la base configurée par
`DATABASE_URL`, sans réinitialiser les comptes ni remplacer les textes existants.
Une copie des contenus avant intervention est conservée dans `.local-db/backups/`
(hors Git).

- Bannières : les cinq photos de l'ancien carrousel sont conservées dans
  `public/assets/banners/`. Chaque diapositive possède une image ordinateur et mobile.
- Pages : les textes institutionnels et les entrées correspondant aux routes publiques
  sont créés s'ils manquent. Les images principales manquantes sont renseignées.
- Programmes et articles : la collection est complétée jusqu'à cinq éléments. Les
  nouveaux textes portent explicitement la mention « À personnaliser ».
- Équipe : chaque groupe (conseil d'administration et équipe opérationnelle) est
  complété jusqu'à cinq profils. Les profils ajoutés sont signalés comme démonstration.
- Statistiques : cinq emplacements au total ; les nouvelles mesures sont non validées.
  Le site affiche « À renseigner » tant que l'équipe n'a pas saisi et validé ses données.
- Médiathèque : les cinq photos du carrousel sont disponibles. Les médias existants
  restent conservés.

L'accueil affiche au maximum trois programmes et trois articles. Les profils d’équipe
et les indicateurs ne sont plus affichés sur l’accueil ; leur administration et la page
Notre équipe restent disponibles.
Les pages dédiées conservent leur liste complète. Les comptes, dons, messages reçus et
journaux d'audit restent des données réelles : le script n'en invente pas.

Dans l'admin, choisir **Photos**, remplacer l'image, puis enregistrer. Conserver les
clés de section des pages : `home-story` alimente l'histoire de l'accueil, `about`
alimente Notre histoire et `approach` alimente Notre approche. Les galeries sont
également rendues sur le site. Publier le code et les nouvelles images avant de
considérer le déploiement comme terminé : les fichiers ajoutés localement ne sont pas
présents automatiquement sur Netlify.

## Édition simplifiée

Le formulaire présente les champs essentiels. **Options avancées et traduction**
donne accès aux traductions, liens de boutons, galeries et autres réglages ; les valeurs
existantes sont conservées quand ces options restent fermées. Les adresses des pages
sont générées à partir du titre lors de la création.

Pour la photo **Né à Goma. Bâti pour durer.** : ouvrir **Pages & contenus**, rechercher
ce titre, choisir **Photos**, sélectionner un fichier puis enregistrer. En mode simple,
remplacer une photo de bannière remplace aussi sa version mobile.

Les galeries des pages affichent uniquement les photos légendées et ne répètent pas
l’image principale. Les cartes de valeurs ne montrent qu’une photo ; Notre approche
privilégie les étapes textuelles et une seule image pour le projet Goma Restoration.

Les coordonnées du footer et de Contact sont modifiables dans **Paramètres du site**.
`npx tsx scripts/restore-contact-settings.ts` rétablit uniquement les valeurs absentes
à partir des coordonnées déjà fournies dans les contenus institutionnels du projet.
