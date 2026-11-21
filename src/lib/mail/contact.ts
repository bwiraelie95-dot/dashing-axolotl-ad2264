import nodemailer from 'nodemailer';
import { z } from 'zod';

export const CONTACT_RECIPIENT = 'info@acv-drc.org';
export function smtpOptions(env: Record<string, string | undefined> = process.env) {
  const user = z.email().parse(env.SMTP_USER);
  if (!env.SMTP_PASSWORD) throw new Error('SMTP_NOT_CONFIGURED');
  const port = Number(env.SMTP_PORT || 465);
  if (![465, 587].includes(port)) throw new Error('SMTP_INVALID_PORT');
  return {
    host: env.SMTP_HOST || 'mailcluster.loopia.se',
    port,
    secure: port === 465,
    requireTLS: true,
    tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' as const },
    auth: { user, pass: env.SMTP_PASSWORD },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    disableFileAccess: true,
    disableUrlAccess: true,
    logger: false,
    debug: false,
  };
}
export type ContactMessage = {
  id: string; name: string; email: string; subject?: string; message: string; phone?: string;
};
export function contactEmail(message: ContactMessage, sender: string) {
  const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();
  return {
    from: { name: 'Africa Community Village — Contact', address: sender },
    to: CONTACT_RECIPIENT,
    replyTo: { name: oneLine(message.name), address: z.email().parse(message.email) },
    subject: `[ACV Contact] ${oneLine(message.subject || 'Nouveau message')}`,
    text: [
      'Nouveau message reçu depuis le formulaire du site ACV.',
      `Référence : ${message.id}`,
      `Nom : ${message.name}`,
      `E-mail : ${message.email}`,
      ...(message.phone ? [`Téléphone : ${message.phone}`] : []),
      `Sujet : ${message.subject || 'Nouveau message'}`,
      '', message.message, '',
      'Utilisez Répondre pour répondre directement au visiteur.',
    ].join('\n'),
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
export async function sendContactEmail(message: ContactMessage) {
  const options = smtpOptions();
  const transport = nodemailer.createTransport(options);
  try {
    const result = await transport.sendMail(contactEmail(message, options.auth.user));
    if (!result.accepted.some(address => String(address).toLowerCase() === CONTACT_RECIPIENT)) {
      throw new Error('SMTP_RECIPIENT_REJECTED');
    }
  } finally {
    transport.close();
  }
}
