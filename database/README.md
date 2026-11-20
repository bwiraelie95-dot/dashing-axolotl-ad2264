# Base de données ACV

La base est décrite par `prisma/schema.prisma` et créée par les migrations versionnées dans `prisma/migrations`.
Elle contient les tables métier suivantes : utilisateurs, pages, bannières, programmes, équipe, articles,
médias, partenaires, paramètres, journaux d'audit, dons, messages de contact, témoignages, statistiques
d'impact, documents de politique et notes de terrain.

## Installation

1. Créer une base MySQL/MariaDB vide nommée `acv`, encodée en `utf8mb4`.
2. Copier `.env.example` vers `.env.local` et renseigner `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` et
   `SEED_ADMIN_PASSWORD` avec de vrais secrets.
3. Exécuter `npm run db:deploy` pour les tables, index, contraintes, vues, procédures, fonctions et triggers.
4. Exécuter `npm run prisma:seed` pour charger les contenus initiaux et le compte administrateur.

`DATABASE_URL` sert à l'application et doit utiliser le compte `acv_app` à privilèges limités. `DIRECT_URL`
sert aux migrations et utilise le compte `acv_migration`. Le fichier `grants.example.sql` fournit le modèle
des droits sans contenir de secret réel.

## Identifiants

Chaque table utilise une clé primaire interne `INT AUTO_INCREMENT` et un identifiant public stable
`external_id`. Les numéros `AUTO_INCREMENT` sont uniques et ordonnés, mais MySQL/MariaDB peut laisser des
trous après une annulation de transaction ou une insertion concurrente. L'application ne dépend donc jamais
d'une séquence sans trou.

## Déploiement Netlify / Loopia

Définir les mêmes variables dans Netlify et utiliser TLS si le serveur MySQL l'exige. Les migrations sont
idempotentes et les objets avancés sont réinstallés proprement par `npm run db:deploy`.
En production, conserver `DIRECT_URL` configurée avec le compte de migration : ne pas la remplacer par
`DATABASE_URL`, qui doit rester le compte applicatif aux privilèges limités.

Attention : les adresses sortantes des fonctions Netlify changent par défaut, alors que Loopia autorise un
hôte/IP par utilisateur MySQL. Une liste d'autorisation stable exige Netlify Private Connectivity (Enterprise)
ou un backend disposant d'une IP sortante fixe. L'hôte `%` de Loopia fonctionnerait techniquement mais expose la
base à Internet et n'est pas recommandé. Voir `docs/CRUD-DIAGNOSTIC.md` avant la mise en production.

Après configuration, vérifier la connexion avec `/api/health`, puis lancer le test réversible avec
`CRUD_SMOKE_CONFIRM=yes npm run test:crud` depuis un environnement autorisé à joindre la base.

## Aiven : nouvelle base et erreur MySQL 1449

L'erreur `The user specified as a definer ... does not exist` indique qu'un objet SQL
s'exécute sous un ancien compte supprimé. Les triggers sur `articles` et `team_members`
expliquent pourquoi une lecture peut fonctionner alors qu'une écriture échoue.
`npm run db:advanced` recrée les objets définis dans `advanced_objects.sql` sous le compte
`DIRECT_URL`, puis vérifie le propriétaire des triggers. Ne pas importer d'anciens DEFINER.

Pour Aiven, les deux URL utilisent la forme suivante (mot de passe encodé dans l'URL) :

```text
mysql://USER:PASSWORD@HOST:PORT/defaultdb?sslcert=certs/aiven-ca.pem&sslaccept=strict&connection_limit=3
```

Le certificat public est versionné dans `prisma/certs/aiven-ca.pem`. Le chemin `sslcert`
est relatif au schéma Prisma ; le script d'installation utilise la même convention.
Next.js inclut ce certificat dans les fichiers serveur destinés au déploiement.
Le script charge également les variables `.env*` via `@next/env`.

Pour basculer cette installation dans Netlify :

1. Publier les modifications du dépôt (certificat, configuration Next.js et script SQL).
2. Copier les valeurs de `DATABASE_URL` et `DIRECT_URL` du fichier local `.env.aiven`
   dans les variables du contexte **Production** Netlify, disponibles pour les builds
   et les fonctions. Conserver `AUTH_SECRET` et les autres variables existantes.
3. Redéployer : la commande production existante `npm run db:deploy && npm run build`
   applique les migrations et réinstalle les objets avec le compte Aiven.
4. Vérifier `/api/health`, se reconnecter puis créer, modifier et supprimer un article
   et un membre. Le compte initial et son mot de passe sont dans `.env.aiven-admin`,
   fichier local ignoré par Git. La base neuve ne contient pas les anciens contenus.
5. Remplacer le mot de passe Aiven partagé dans la capture, mettre à jour les deux URL
   dans Netlify et localement, puis redéployer. Changer aussi le mot de passe administrateur
   initial depuis le back-office.

`.env.before-aiven` conserve l'ancienne configuration locale. Aucun de ces fichiers
`.env*` privés ne doit être ajouté à Git. Ne pas lancer le seed de démonstration sur cette
base : il crée plusieurs comptes et contenus de démonstration.
