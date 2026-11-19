import { randomUUID } from 'node:crypto';
import { contentModel } from '../src/models/contentModel';
import { prisma } from '../src/models/prisma/client';
import { saveCms } from '../src/models/cmsModel';
import { userModel } from '../src/models/userModel';
import { issueAuthToken } from '../src/lib/auth';
import { DELETE } from '../src/app/api/admin/[entity]/[id]/route';
import { NextRequest } from 'next/server';

if (process.env.CRUD_SMOKE_CONFIRM !== 'yes') {
  throw new Error('Set CRUD_SMOKE_CONFIRM=yes to run the reversible database smoke test.');
}

const id = `crud-smoke-${randomUUID()}`;
const articleSlug = `${id}-article`;
const teamId = `${id}-team`;
const adminId = `${id}-admin`;
let shouldCleanUp = false;
let articleCreated = false;
let articleRecordId: string | null = null;
let teamCreated = false;
let adminCreated = false;

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

    const article = await saveCms('articles', null, {
      slug: articleSlug,
      titleEn: 'CRUD smoke article',
      titleFr: 'Article de test CRUD',
      excerptEn: 'Temporary smoke-test excerpt.',
      excerptFr: 'Extrait temporaire du test CRUD.',
      contentEn: 'Temporary smoke-test content for the article editor.',
      contentFr: 'Contenu temporaire du test CRUD pour le journal.',
      category: 'Smoke test',
      status: 'draft'
    }, 'crud-smoke-author', false);
    if (!article) throw new Error('The article could not be created.');
    articleRecordId = article.id;
    articleCreated = true;

    const updatedArticle = await saveCms('articles', articleRecordId, {
      slug: articleSlug,
      titleEn: 'CRUD smoke article updated',
      titleFr: 'Article de test CRUD modifié',
      excerptEn: 'Temporary smoke-test excerpt.',
      excerptFr: 'Extrait temporaire du test CRUD.',
      contentEn: 'Updated temporary smoke-test content for the article editor.',
      contentFr: 'Contenu temporaire modifié du test CRUD pour le journal.',
      category: 'Smoke test',
      status: 'draft'
    }, 'crud-smoke-author', false);
    if (!updatedArticle || updatedArticle.titleEn !== 'CRUD smoke article updated') {
      throw new Error('The article update could not be read back.');
    }

    const teamMember = await contentModel.create('team', {
      id: teamId,
      name: 'CRUD smoke team member',
      roleEn: 'Temporary test role',
      roleFr: 'Rôle temporaire de test',
      category: 'Staff',
      status: 'visible'
    });
    teamCreated = true;
    if (teamMember.id !== teamId) throw new Error('The team member did not keep its public identifier.');

    const admin = await userModel.create({
      id: adminId,
      name: 'CRUD smoke admin',
      email: `${id}@example.invalid`,
      password: randomUUID(),
      role: 'admin',
      status: 'active'
    });
    adminCreated = true;
    const token = await issueAuthToken(admin);
    const response = await DELETE(
      new NextRequest(`http://localhost/api/admin/team/${teamId}`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` }
      }),
      { params: Promise.resolve({ entity: 'team', id: teamId }) }
    );
    const result = await response.json() as { success?: boolean; error?: string };
    if (!response.ok || !result.success) {
      throw new Error(`Team DELETE API returned ${response.status}: ${result.error || 'unknown error'}`);
    }
    if (await contentModel.findById('team', teamId)) {
      throw new Error('The team member still appears after deletion.');
    }

    const articleDeleted = await contentModel.delete('articles', articleRecordId);
    if (!articleDeleted) throw new Error('The article could not be deleted.');
    if (await contentModel.findById('articles', articleRecordId)) {
      throw new Error('The article still appears after deletion.');
    }

    console.log('[crud-smoke] program, article and team CRUD checks succeeded.');
  } finally {
    if (shouldCleanUp) {
      await contentModel.delete('programs', id).catch(() => undefined);
    }
    const storedArticle = await prisma.article.findUnique({
      where: { slug: articleSlug },
      select: { externalId: true }
    });
    const cleanupArticleId = articleRecordId || storedArticle?.externalId;
    if (articleCreated || storedArticle) {
      await prisma.article.deleteMany({
        where: { externalId: cleanupArticleId }
      });
    }
    if (teamCreated) {
      await prisma.teamMember.deleteMany({ where: { externalId: teamId } });
    }
    if (adminCreated) {
      await prisma.user.deleteMany({ where: { externalId: adminId } });
    }
    const testRecordIds = [cleanupArticleId, teamCreated ? teamId : null]
      .filter((recordId): recordId is string => Boolean(recordId));
    if (testRecordIds.length) {
      await prisma.contentDraft.deleteMany({
        where: { recordId: { in: testRecordIds } }
      });
      await prisma.contentRevision.deleteMany({
        where: { recordId: { in: testRecordIds } }
      });
      await prisma.auditLog.deleteMany({
        where: { recordId: { in: testRecordIds } }
      });
    }
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error('[crud-smoke] failed', error);
  process.exitCode = 1;
});
