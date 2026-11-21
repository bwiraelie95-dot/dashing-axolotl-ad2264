# Formulaire Contact → Loopia

Le formulaire enregistre d’abord le message dans Aiven, puis envoie une notification
à **info@acv-drc.org** depuis une fonction serveur Next.js. Le visiteur est placé dans
`Reply-To`, jamais dans `From`. Le destinataire est fixé côté serveur.

## Activation

1. Créer la boîte `info@acv-drc.org` dans Loopia si elle n’existe pas, puis vérifier son
   accès dans https://webmail.loopia.se/.
2. Dans Netlify → configuration du site → variables d’environnement, définir pour
   **Production / Functions** :

   ```dotenv
   SMTP_HOST=mailcluster.loopia.se
   SMTP_PORT=465
   SMTP_USER=info@acv-drc.org
   SMTP_PASSWORD=mot-de-passe-de-la-boite-loopia
   ```

   Ne pas mettre ces secrets dans Git, `netlify.toml` ou une variable `NEXT_PUBLIC_*`.
   Le port 465 utilise TLS dès la connexion ; 587 exige STARTTLS. La validation du
   certificat reste activée.
3. Publier le code et redéployer Netlify. Le fichier `.env` local n’est pas transmis
   automatiquement à Netlify.
4. Pour vérifier les accès localement, renseigner les mêmes variables dans `.env`
   puis exécuter `npm run verify:smtp`. Cette commande ne transmet aucun message.
5. Après déploiement, envoyer un message depuis `/contact`. Vérifier sa réception
   dans Loopia (y compris les indésirables), puis utiliser Répondre : le destinataire
   doit être l’adresse du visiteur. Vérifier aussi « Messages reçus » dans l’admin.

## Erreurs et protections

- Validation des champs, taille de requête limitée à 64 Kio, champ antispam caché et
  limitation de cinq tentatives par minute et par IP, enregistrée en base pour les
  fonctions serverless. Ce sont des protections de base, pas une garantie contre
  les robots distribués.
- La confirmation est affichée à l’écran : aucun accusé de réception automatique
  n’est envoyé à une adresse de visiteur non vérifiée.
- Sans configuration SMTP ou si l’envoi échoue, le message reste dans l’admin.
  Le visiteur reçoit une confirmation de sauvegarde indiquant l’indisponibilité de
  la notification. Ne pas lui demander de soumettre à nouveau un message déjà sauvé.
- Le détail admin indique une notification acceptée par SMTP, échouée ou en attente.
  Une acceptation SMTP ne prouve pas l’arrivée dans la boîte de réception.
- Aucun renvoi automatique des notifications échouées : l’équipe les traite depuis
  l’admin et répond depuis sa messagerie. Les anciens messages ne sont pas envoyés
  rétroactivement.
- Les journaux n’exposent ni mot de passe SMTP ni contenu des messages.

## Validation

`npm run test:contact` utilise des transports et accès base simulés : aucun e-mail
réel n’est envoyé. `npm run build` vérifie le bundle de production.

Paramètres officiels Loopia : https://support.loopia.com/wiki/email-servers/
