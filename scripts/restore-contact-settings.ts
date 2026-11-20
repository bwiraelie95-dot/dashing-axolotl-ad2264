import 'dotenv/config';
import { prisma } from '../src/models/prisma/client';
import { contactDefaults } from '../src/lib/public/contact-defaults';
async function main() {
  let restored = 0;
  for (const [settingKey, settingValue] of Object.entries(contactDefaults)) {
    const current = await prisma.setting.findUnique({ where: { settingKey } });
    if (current && current.settingValue !== null && current.settingValue !== '') continue;
    await prisma.setting.upsert({ where: { settingKey }, create: { settingKey, settingValue, isPublic: true, groupName: 'general' }, update: { settingValue, isPublic: true } });
    restored++;
  }
  console.log(`${restored} coordonnées ou réglages de contact restaurés ; valeurs existantes conservées.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
