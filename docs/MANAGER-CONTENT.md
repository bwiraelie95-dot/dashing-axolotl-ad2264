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

L'accueil affiche au maximum cinq programmes, articles, profils et indicateurs actifs.
Les pages dédiées conservent leur liste complète. Les comptes, dons, messages reçus et
journaux d'audit restent des données réelles : le script n'en invente pas.

Dans l'admin, choisir **Photos**, remplacer l'image, puis enregistrer. Conserver les
clés de section des pages : `home-story` alimente l'histoire de l'accueil, `about`
alimente Notre histoire et `approach` alimente Notre approche. Les galeries sont
également rendues sur le site. Publier le code et les nouvelles images avant de
considérer le déploiement comme terminé : les fichiers ajoutés localement ne sont pas
présents automatiquement sur Netlify.
