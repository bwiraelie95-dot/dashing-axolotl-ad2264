# Diagnostic CRUD et déploiement ACV

## Cause principale du faux CRUD

L’ancienne interface appliquait les créations, modifications et suppressions dans l’état React avant la confirmation de l’API. Les erreurs réseau ou MySQL étaient ensuite interceptées avec un simple avertissement `API sync deferred`. L’écran donnait donc l’impression que l’action avait réussi alors que la base n’avait rien enregistré.

Le flux corrigé respecte désormais cet ordre :

1. valider les données dans la route API ;
2. vérifier le jeton et le rôle de l’administrateur ;
3. exécuter la mutation Prisma/MySQL ;
4. écrire le journal d’audit ;
5. retourner l’enregistrement réellement persisté ;
6. seulement ensuite mettre à jour l’interface et afficher le succès.

Une erreur API reste visible dans le back-office et ne produit plus de succès local trompeur.

## Contrôles à exécuter avant chaque merge

```powershell
npm ci
npm run lint
npm run test:unit
npm run build
```

Avec une base de test configurée dans `DATABASE_URL`, lancer le test réversible :

```powershell
$env:CRUD_SMOKE_CONFIRM = 'yes'
npm run test:crud
Remove-Item Env:CRUD_SMOKE_CONFIRM
```

Le script crée un programme temporaire avec un identifiant unique, le relit, le modifie, le relit à nouveau puis le supprime. Un nettoyage est tenté même si une étape échoue.

Après déploiement Netlify :

```powershell
$env:DEPLOYMENT_URL = 'https://votre-site.netlify.app'
npm run verify:deployment
Remove-Item Env:DEPLOYMENT_URL
```

`/api/health` retourne HTTP 200 uniquement si l’application peut réellement exécuter `SELECT 1` sur MySQL. Une base inaccessible retourne HTTP 503 sans révéler les identifiants de connexion.

## Point d’architecture Netlify → Loopia

Loopia permet de limiter un utilisateur MySQL à une adresse IP externe précise. Netlify indique que les adresses sortantes de ses fonctions changent par défaut. Ses IP statiques pour les fonctions font partie de Private Connectivity, une option Enterprise.

Conséquence : avec un compte Netlify standard, une liste d’autorisation Loopia limitée à une IP risque de casser de manière intermittente. Définir `%` comme hôte MySQL contourne le problème mais expose le service à Internet et Loopia le déconseille.

Solutions sûres, par ordre de préférence :

1. activer Netlify Private Connectivity et autoriser toutes les IP fixes de la région choisie dans Loopia ;
2. héberger l’API sur un service à IP sortante fixe tout en gardant le frontend sur Netlify ;
3. utiliser une base conçue pour les environnements serverless et garder Loopia pour le domaine et les services qui y sont adaptés.

Documentation officielle :

- Loopia, hôte et droits MySQL : https://support.loopia.se/wiki/rattigheter-till-mysql-databaser/
- Netlify, Private Connectivity : https://docs.netlify.com/manage/security/private-connectivity/
- Netlify, régions des fonctions : https://docs.netlify.com/build/functions/configuration/

## Variables Netlify obligatoires

- `DATABASE_URL` : compte applicatif à droits limités, pool réduit ;
- `DIRECT_URL` : compte de migration, jamais utilisé par le navigateur ;
- `AUTH_SECRET` : valeur aléatoire d’au moins 32 caractères ;
- `SEED_ADMIN_PASSWORD` : uniquement pour l’initialisation ;
- `NEXT_PUBLIC_APP_URL` : URL publique canonique ;
- `STRIPE_SECRET_KEY` : secret serveur si les dons Stripe sont activés.

Ne jamais exposer ces valeurs dans Git, une capture, un ticket ou une variable préfixée `NEXT_PUBLIC_`.
