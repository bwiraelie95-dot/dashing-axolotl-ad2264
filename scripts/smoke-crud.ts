import { randomUUID } from 'node:crypto';
import { contentModel } from '../src/models/contentModel';
import { prisma } from '../src/models/prisma/client';

if (process.env.CRUD_SMOKE_CONFIRM !== 'yes') {
  throw new Error('Set CRUD_SMOKE_CONFIRM=yes to run the reversible database smoke test.');
}

const id = `crud-smoke-${randomUUID()}`;
let shouldCleanUp = false;

async function run() {
  try {
    console.log(`[crud-smoke] creating ${id}`);
    const created = await contentModel.create('programs', {
      id,
      slug: id,
      titleEn: 'CRUD smoke test',
      titleFr: 'Test CRUD',
      descriptionEn: 'Temporary record created by the ACV deployment check.',
      descriptionFr: 'Enregistrement temporaire créé par le contrôle de déploiement ACV.',
      status: 'draft',
      order: 9_999
    });
    shouldCleanUp = true;

    if (created.id !== id) throw new Error('The created record did not keep its public identifier.');

    const read = await contentModel.findById('programs', id);
    if (!read) throw new Error('The record could not be read after creation.');

    const updated = await contentModel.update('programs', id, {
      titleEn: 'CRUD smoke test updated',
      titleFr: 'Test CRUD mis à jour'
    });
    if (!updated || updated.titleEn !== 'CRUD smoke test updated') {
      throw new Error('The updated values could not be read back from the database.');
    }

    const deleted = await contentModel.delete('programs', id);
    if (!deleted) throw new Error('The record could not be deleted.');
    shouldCleanUp = false;

    const afterDelete = await contentModel.findById('programs', id);
    if (afterDelete) throw new Error('The record still exists after deletion.');

    console.log('[crud-smoke] create, read, update and delete succeeded.');
  } finally {
    if (shouldCleanUp) {
      await contentModel.delete('programs', id).catch(() => undefined);
    }
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error('[crud-smoke] failed', error);
  process.exitCode = 1;
});
