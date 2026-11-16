# ACV — interface React et backend

Le projet utilise Next.js App Router pour son API et sa nouvelle page d’accueil React, adaptée de `design/acv-accueil.html`. Un nouvel espace admin est disponible sur `/admin/login` et `/admin/dashboard`.

## Organisation

- `src/app/page.tsx` : page d’accueil ; `layout.tsx` et `globals.css` : structure et styles communs.
- `src/components/home` : header responsive, carrousel de cinq photos, contenu, aperçu du formulaire de don et footer.
- Le carrousel change de photo toutes les 300 secondes, avec navigation manuelle et pause.
- Les montants du formulaire sont interactifs ; le paiement est désactivé tant que le nouveau parcours Stripe n’est pas raccordé.
- Les contenus de la page sont ceux de la maquette, pas des données chargées depuis MySQL.
- Tailwind compile les styles localement ; les polices Google Fonts et les photos de la maquette restent distantes.

- `src/app/api/**/route.ts` : routes HTTP publiques et administrateur, authentification, validation Zod, paiements Stripe et médias.
- `src/models` : accès aux données et logique métier ; `src/models/prisma/client.ts` initialise Prisma.
- `src/lib` : authentification JWT, réponses HTTP, validation et client Stripe.
- `prisma` : schéma MySQL, migrations et initialisation des données.
- `server/repository` : données et types utilisés par le seed.
- `database` et `scripts` : scripts SQL, déploiement des objets de base et vérifications.
- `src/utils/databaseScriptGenerator.ts` : génération SQL et export de données, conservés sans interface.
- `public/assets` : médias référencés par les données initiales, conservés pour éviter des liens cassés.

Les mutations d’articles passent par `/api/admin/articles` et `/api/admin/articles/:id`. Les anciennes Server Actions liées aux pages ont été retirées.

## Démarrage local

1. Installer les dépendances avec `npm ci`.
2. Copier `.env.example` vers `.env` et renseigner les connexions MySQL et `AUTH_SECRET`.
3. Appliquer les migrations avec `npm run db:deploy`.
4. Renseigner `SEED_ADMIN_PASSWORD`, puis initialiser les données avec `npm run prisma:seed` si nécessaire.
5. Lancer `npm run dev` ; les routes sont disponibles sous `http://localhost:3000/api`.

`/api/health` vérifie la connexion réelle à MySQL. La page d’accueil est disponible sur `/`. `/admin` redirige vers le tableau de bord ; sans session, l’utilisateur est renvoyé vers la connexion. L’authentification reste accessible par `POST /api/admin/login`.

Pour la production : `npm run build`, puis `npm start`. La configuration Netlify reste disponible pour héberger l’API et les médias.

## Paiements et futur frontend

`NEXT_PUBLIC_APP_URL` est conservée pour compatibilité : elle désigne l’URL du frontend externe où Stripe redirige vers `/donate` et `/donate/success`. Ces pages ne sont plus fournies par ce dépôt. Configurer cette variable avant d’utiliser les paiements.

## Vérification

- `npm run lint` : contrôle TypeScript.
- `npm run build` : génération Prisma et compilation de l’API.
- `CRUD_SMOKE_CONFIRM=yes npm run test:crud` : test CRUD réversible, uniquement avec une base de test configurée.
- `DEPLOYMENT_URL=https://votre-api.example npm run verify:deployment` : vérification de l’API déployée et de sa connexion MySQL.

Aucune migration ni modification de base n’est exécutée par `lint` ou `build`.

## Administration et animations

- `src/components/admin` : connexion, vérification de session, tableau de bord, création/modification/suppression d’articles et consultation paginée des messages et dons. Les rôles sans droit d’édition disposent d’une lecture seule ; les API restent l’autorité sur les permissions.
- `GET /api/admin/session` vérifie le jeton et le compte actif avec la même authentification que les autres routes. Le jeton Bearer est conservé dans `sessionStorage` pour l’onglet courant, retiré lors de la déconnexion ou d’une réponse 401. La déconnexion locale n’invalide pas un jeton déjà copié ; sa durée de validité serveur reste de huit heures.
- La connexion nécessite MySQL accessible, les migrations appliquées, `AUTH_SECRET` et un compte créé par le seed (mot de passe défini dans `SEED_ADMIN_PASSWORD`). Aucun identifiant fictif ni mode de connexion simulé n’est livré.
- Les mutations d’articles affichent le succès seulement après confirmation de l’API. Les erreurs conservent le formulaire. La page publique reste statique pour le moment.
- `ScrollEffects.tsx` utilise IntersectionObserver et Web Animations pour les apparitions uniques, et un seul calcul par frame pour la progression du défilement. Le contenu est visible sans JavaScript. `prefers-reduced-motion` désactive ces effets.

## Base locale configurée

Une instance MariaDB dédiée à ACV écoute sur `127.0.0.1:3307`, indépendante de l’instance système. Ses données persistantes sont dans `.local-db/data` (ignoré par Git). Pour la relancer après un redémarrage : `npm run db:local:start`, puis `npm run dev`.

Les connexions applicative et migration et le secret JWT sont dans `.env` (permissions 600, ignoré par Git). Le compte applicatif est limité aux opérations de données sur `acv`. Le compte de migration dispose des droits de schéma uniquement sur cette base.

Un seul super-administrateur local a été créé : `admin@acv.local`. Son mot de passe généré est dans `.local-db/admin-access.txt` (permissions 600). Les migrations et objets SQL sont installés ; aucune donnée de démonstration ni compte du seed historique n’a été importé.

## Navigation publique

Les liens publics utilisent des pages dédiées (`/notre-equipe`, `/gouvernance`, `/notre-histoire`, `/programmes`, `/journal`, `/contact`, etc.). `src/lib/public/pages.ts` décrit les rubriques et les cinq pages de piliers. La route `[slug]` renvoie 404 pour les chemins inconnus.

Les rubriques équipe, gouvernance, notes de terrain et journal lisent les API publiques avec un état de chargement, d’erreur et de liste vide. Aucun profil fictif n’est ajouté à la base. Le formulaire de contact transmet les messages à `/api/public/contact`. Les pages légales et le rapport d’impact indiquent explicitement les informations encore à compléter.
