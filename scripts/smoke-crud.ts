import { randomUUID } from 'node:crypto';
import { contentModel } from '../src/models/contentModel';
import { prisma } from '../src/models/prisma/client';
import { userModel } from '../src/models/userModel';
import { issueAuthToken } from '../src/lib/auth';
import { NextRequest } from 'next/server';
import {
  DELETE as deleteAdminEntity,
  PUT as updateAdminEntity
} from '../src/app/api/admin/[entity]/[id]/route';
import { POST as createCmsEntity } from '../src/app/api/admin/cms/[entity]/route';
import { PUT as updateCmsEntity } from '../src/app/api/admin/cms/[entity]/[id]/route';

if (process.env.CRUD_SMOKE_CONFIRM !== 'yes') {
  throw new Error('Set CRUD_SMOKE_CONFIRM=yes to run the reversible database smoke test.');
}

const id = `crud-smoke-${randomUUID()}`;
const articleSlug = `${id}-article`;
const teamName = `${id} test team member`;
const adminId = `${id}-admin`;
let shouldCleanUp = false;
let articleRecordId: string | null = null;
let teamRecordId: string | null = null;
let adminCreated = false;

function adminRequest(path: string, method: string, token: string, body?: unknown) {
  return new NextRequest(`http://localhost/api/admin/${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      ...(body ? { 'content-type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
}

async function responseData<T>(response: Response, label: string): Promise<T> {
  const result = await response.json() as {
    success?: boolean;
    data?: T;
    error?: string;
  };
  if (!response.ok || !result.success || result.data === undefined) {
    throw new Error(`${label} returned ${response.status}: ${result.error || 'unknown error'}`);
  }
  return result.data;
}

async function assertResponse(response: Response, label: string) {
  const result = await response.json() as { success?: boolean; error?: string };
  if (!response.ok || !result.success) {
    throw new Error(`${label} returned ${response.status}: ${result.error || 'unknown error'}`);
  }
}

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

    const articlePayload = {
      slug: articleSlug,
      titleEn: 'CRUD smoke article',
      titleFr: 'Article de test CRUD',
      excerptEn: 'Temporary smoke-test excerpt.',
      excerptFr: 'Extrait temporaire du test CRUD.',
      contentEn: 'Temporary smoke-test content for the article editor.',
      contentFr: 'Contenu temporaire du test CRUD pour le journal.',
      category: 'Smoke test',
      status: 'draft'
    };
    const article = await responseData<{ id: string }>(
      await createCmsEntity(
        adminRequest('cms/articles', 'POST', token, {
          payload: articlePayload,
          draft: false
        }),
        { params: Promise.resolve({ entity: 'articles' }) }
      ),
      'Article create API'
    );
    articleRecordId = article.id;

    const updatedArticle = await responseData<{ titleEn: string }>(
      await updateCmsEntity(
        adminRequest(`cms/articles/${articleRecordId}`, 'PUT', token, {
          payload: {
            ...articlePayload,
            titleEn: 'CRUD smoke article updated'
          },
          draft: false
        }),
        { params: Promise.resolve({ entity: 'articles', id: articleRecordId }) }
      ),
      'Article update API'
    );
    if (updatedArticle.titleEn !== 'CRUD smoke article updated') {
      throw new Error('The article update could not be read back.');
    }
    const partialArticleUpdate = await responseData<{ titleFr: string }>(
      await updateAdminEntity(
        adminRequest(`articles/${articleRecordId}`, 'PUT', token, {
          titleEn: 'CRUD smoke legacy update'
        }),
        { params: Promise.resolve({ entity: 'articles', id: articleRecordId }) }
      ),
      'Article partial update API'
    );
    if (partialArticleUpdate.titleFr !== 'Article de test CRUD') {
      throw new Error('The article partial update lost existing values.');
    }

    const teamPayload = {
      name: teamName,
      roleEn: 'Temporary test role',
      roleFr: 'Rôle temporaire de test',
      category: 'Staff',
      status: 'visible'
    };
    const teamMember = await responseData<{ id: string }>(
      await createCmsEntity(
        adminRequest('cms/team', 'POST', token, {
          payload: teamPayload,
          draft: false
        }),
        { params: Promise.resolve({ entity: 'team' }) }
      ),
      'Team create API'
    );
    teamRecordId = teamMember.id;

    const updatedTeam = await responseData<{ name: string }>(
      await updateCmsEntity(
        adminRequest(`cms/team/${teamRecordId}`, 'PUT', token, {
          payload: { ...teamPayload, name: `${teamName} updated` },
          draft: false
        }),
        { params: Promise.resolve({ entity: 'team', id: teamRecordId }) }
      ),
      'Team update API'
    );
    if (updatedTeam.name !== `${teamName} updated`) {
      throw new Error('The team update could not be read back.');
    }

    await assertResponse(
      await deleteAdminEntity(
        adminRequest(`team/${teamRecordId}`, 'DELETE', token),
        { params: Promise.resolve({ entity: 'team', id: teamRecordId }) }
      ),
      'Team DELETE API'
    );
    if (await contentModel.findById('team', teamRecordId)) {
      throw new Error('The team member still appears after deletion.');
    }

    await assertResponse(
      await deleteAdminEntity(
        adminRequest(`articles/${articleRecordId}`, 'DELETE', token),
        { params: Promise.resolve({ entity: 'articles', id: articleRecordId }) }
      ),
      'Article DELETE API'
    );
    if (await contentModel.findById('articles', articleRecordId)) {
      throw new Error('The article still appears after deletion.');
    }

    console.log('[crud-smoke] program, article and team API CRUD checks succeeded.');
  } finally {
    if (shouldCleanUp) {
      await contentModel.delete('programs', id).catch(() => undefined);
    }
    const storedArticle = await prisma.article.findUnique({
      where: { slug: articleSlug },
      select: { externalId: true }
    });
    const cleanupArticleId = articleRecordId || storedArticle?.externalId;
    if (storedArticle || articleRecordId) {
      await prisma.article.deleteMany({
        where: { externalId: cleanupArticleId }
      });
    }
    const storedTeam = await prisma.teamMember.findFirst({
      where: { name: { startsWith: `${id} test team member` } },
      select: { externalId: true }
    });
    const cleanupTeamId = teamRecordId || storedTeam?.externalId;
    if (cleanupTeamId) {
      await prisma.teamMember.deleteMany({ where: { externalId: cleanupTeamId } });
    }
    if (adminCreated) {
      await prisma.user.deleteMany({ where: { externalId: adminId } });
    }
    const testRecordIds = [cleanupArticleId, cleanupTeamId]
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
