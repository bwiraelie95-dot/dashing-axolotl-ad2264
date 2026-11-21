import assert from 'node:assert/strict';
import { afterEach, test, mock } from 'node:test';
import nodemailer from 'nodemailer';
import { contactEmail, smtpOptions, sendContactEmail } from '../src/lib/mail/contact';
import { publicContentModel } from '../src/models/publicContentModel';
import { contentModel } from '../src/models/contentModel';

const message = { id: 'test-contact', name: 'Visiteur', email: 'visitor@example.org', subject: 'Question', message: 'Bonjour, ceci est un test local.' };
const savedEnv = { ...process.env };
afterEach(() => { mock.restoreAll(); process.env = { ...savedEnv }; prisma.requestLimit.upsert = originalUpsert; prisma.requestLimit.deleteMany = originalDeleteMany; });
function configure() { process.env.SMTP_USER = 'info@acv-drc.org'; process.env.SMTP_PASSWORD = 'test-only'; }

test('le visiteur est Reply-To, jamais expéditeur ou destinataire', () => {
  const mail = contactEmail({ ...message, name: 'Nom\r\nBcc: other@example.org', subject: 'Question\r\nBcc: other@example.org' }, 'info@acv-drc.org');
  assert.equal(mail.from.address, 'info@acv-drc.org');
  assert.equal(mail.to, 'info@acv-drc.org');
  assert.equal(mail.replyTo.address, message.email);
  assert(!/[\r\n]/.test(mail.subject));
  assert(!/[\r\n]/.test(mail.replyTo.name));
  assert(mail.text.includes(message.message));
});
test('TLS requis sur 465 et 587 ; configuration absente refusée', () => {
  assert.throws(() => smtpOptions({}));
  configure();
  const ssl = smtpOptions();
  assert.equal(ssl.secure, true);
  assert.equal(ssl.tls.rejectUnauthorized, true);
  assert.equal(smtpOptions({ ...process.env, SMTP_PORT: '587' }).requireTLS, true);
  assert.equal(smtpOptions({ ...process.env, SMTP_PORT: '587' }).secure, false);
  assert.throws(() => smtpOptions({ ...process.env, SMTP_PORT: '25' }));
});
test('un refus du destinataire SMTP est un échec', async () => {
  configure();
  mock.method(nodemailer, 'createTransport', () => ({ sendMail: async () => ({ accepted: [] }), close() {} }));
  await assert.rejects(sendContactEmail(message), /SMTP_RECIPIENT_REJECTED/);
});
for (const fails of [false, true]) test(`message sauvegardé avant SMTP, résultat ${fails ? 'échec' : 'succès'} suivi sans divulgation`, async () => {
  configure();
  const events: string[] = [];
  mock.method(contentModel, 'create', async (entity: string) => { events.push(entity); return { id: message.id }; });
  mock.method(contentModel, 'update', async (_entity: string, _id: string, data: Record<string, unknown>) => { events.push(String(data.emailDelivery)); return { id: message.id }; });
  mock.method(console, 'error', () => {});
  mock.method(nodemailer, 'createTransport', () => ({ sendMail: async () => {
    events.push('smtp');
    if (fails) throw Error('secret-provider-detail');
    return { accepted: ['info@acv-drc.org'] };
  }, close() {} }));
  const result = await publicContentModel.submitContact(message);
  assert.deepEqual(events, ['contactSubmissions', 'smtp', fails ? 'failed' : 'sent', 'auditLogs']);
  assert.equal(result.emailDelivery, fails ? 'failed' : 'sent');
  assert(!JSON.stringify(result).includes('secret-provider-detail'));
  assert(!('email' in result));
});
test('échec de sauvegarde : aucun e-mail envoyé', async () => {
  const transport = mock.method(nodemailer, 'createTransport', () => { throw Error('must not send'); });
  mock.method(contentModel, 'create', async () => { throw Error('database unavailable'); });
  await assert.rejects(publicContentModel.submitContact(message), /database unavailable/);
  assert.equal(transport.mock.callCount(), 0);
});

// Exercise the real public endpoint without sending mail or touching Aiven.
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/public/[resource]/route';
import { prisma } from '../src/models/prisma/client';
const originalUpsert = prisma.requestLimit.upsert;
const originalDeleteMany = prisma.requestLimit.deleteMany;
function request(body: unknown) {
  return new NextRequest('http://localhost/api/public/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}
function stubLimit(count = 1) {
  const upsert = (async () => ({ count })) as unknown as typeof originalUpsert;
  prisma.requestLimit.upsert = upsert;
  prisma.requestLimit.deleteMany = (async () => ({ count: 0 })) as typeof originalDeleteMany;
  assert.equal(prisma.requestLimit.upsert, upsert);
}
test('le honeypot ne sauvegarde ni ne transmet les messages robots', async () => {
  stubLimit();
  const submit = mock.method(publicContentModel, 'submitContact', async () => { throw Error('must not submit'); });
  const response = await POST(request({ ...message, website: 'https://spam.invalid' }), { params: Promise.resolve({ resource: 'contact' }) });
  assert.equal(response.status, 201);
  assert.equal(submit.mock.callCount(), 0);
});
test('validation et limitation bloquent avant sauvegarde/envoi', async () => {
  stubLimit();
  const submit = mock.method(publicContentModel, 'submitContact', async () => { throw Error('must not submit'); });
  assert.equal((await POST(request({ ...message, email: 'invalid' }), { params: Promise.resolve({ resource: 'contact' }) })).status, 400);
  stubLimit(6);
  assert.equal((await POST(request(message), { params: Promise.resolve({ resource: 'contact' }) })).status, 429);
  assert.equal(submit.mock.callCount(), 0);
});
