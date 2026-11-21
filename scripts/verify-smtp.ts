import nextEnv from '@next/env';
import nodemailer from 'nodemailer';
import { smtpOptions } from '../src/lib/mail/contact';
nextEnv.loadEnvConfig(process.cwd());
async function main() {
  const missing = ['SMTP_USER', 'SMTP_PASSWORD'].filter(key => !process.env[key]);
  if (missing.length) {
    console.error(`Configuration incomplète : ${missing.join(', ')} vide. Enregistrer le fichier .env ou renseigner les variables serveur.`);
    process.exitCode = 1;
    return;
  }
  const transport = nodemailer.createTransport(smtpOptions());
  try {
    await transport.verify();
    console.log('Connexion TLS et authentification SMTP validées. Aucun e-mail envoyé.');
  } finally { transport.close(); }
}
main().catch((error: unknown) => {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (code === "EAUTH") console.error("Authentification refusée : vérifier le compte et le mot de passe de la boîte Loopia.");
  console.error('Vérification SMTP échouée : vérifier SMTP_HOST, SMTP_PORT, SMTP_USER et SMTP_PASSWORD, ainsi que l’accès réseau. Aucun secret affiché.');
  process.exitCode = 1;
});
