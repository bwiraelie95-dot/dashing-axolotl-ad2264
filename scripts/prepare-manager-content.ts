import 'dotenv/config';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import institutional from '../prisma/content/institutional.json';
import { pages as publicPages, programPages } from '../src/lib/public/pages';
import { pillars } from '../src/lib/cms/modules';
import { contentModel } from '../src/models/contentModel';
import { prisma } from '../src/models/prisma/client';
import type { ContentEntity } from '../src/lib/validation';

type Item = Record<string, unknown> & { id: string };
const photos = Array.from({ length: 5 }, (_, i) => `/assets/banners/home-${i + 1}.jpg`);
const entities: ContentEntity[] = ['pages', 'banners', 'programs', 'articles', 'team', 'stats', 'media'];
const report: Record<string, number> = {};
async function main() {
  for (const photo of photos) await stat(`public${photo}`);
  const snapshot: Record<string, Item[]> = {};
  for (const entity of entities) snapshot[entity] = await contentModel.list<Item>(entity);
  await mkdir('.local-db/backups', { recursive: true });
  await writeFile(`.local-db/backups/before-manager-content-${Date.now()}.json`, JSON.stringify(snapshot, null, 2), { mode: 0o600 });
  async function add(entity: ContentEntity, id: string, payload: Record<string, unknown>) {
    if (snapshot[entity].some(item => item.id === id || (payload.slug && item.slug === payload.slug))) return;
    const item = await contentModel.create<Item>(entity, { ...payload, id });
    snapshot[entity].push(item);
    report[entity] = (report[entity] || 0) + 1;
  }
  // Reuse the site's existing institutional copy, never reset a manager's edits.
  const pageDefaults: Record<string, unknown>[] = [...institutional.pages];
  for (const [slug, page] of Object.entries(publicPages)) {
    const key = slug === 'notre-histoire' ? 'about' : slug === 'notre-approche' ? 'approach' : slug;
    if (!pageDefaults.some(p => p.slug === key)) pageDefaults.push({ slug: key, titleFr: page.title, subtitleFr: page.intro, contentFr: page.paragraphs?.join('\n\n') || page.intro, status: 'published' });
  }
  pageDefaults.push({ slug: 'home-story', titleFr: 'Né à Goma. Bâti pour durer.', titleEn: 'Born in Goma. Built to last.', contentFr: institutional.pages.find(p => p.slug === 'about')!.contentFr, contentEn: institutional.pages.find(p => p.slug === 'about')!.contentEn, status: 'published' });
  for (const [index, page] of pageDefaults.entries()) {
    const existing = snapshot.pages.find(p => p.slug === page.slug);
    const photo = page.slug === 'home-story' ? photos[1] : photos[index % photos.length];
    if (!existing) await add('pages', `manager-page-${page.slug}`, { ...page, route: page.slug === 'home' ? '/' : `/${page.slug}`, coverImage: photo, order: index });
    else if (!existing.coverImage) await contentModel.update('pages', existing.id, { coverImage: photo });
  }
  for (const [i, photo] of photos.entries()) {
    await add('banners', `manager-home-banner-${i + 1}`, { titleFr: programPages[i][1], titleEn: ['Education and youth', 'Nature and biodiversity', 'Agriculture and food security', 'Health and well-being', 'Socio-economic empowerment'][i], subtitleFr: programPages[i][2], imageUrl: photo, imageMobile: photo, active: true, status: 'published', pageRoute: '/', order: i, ctaTextFr: 'Découvrir', ctaTextEn: 'Discover', ctaLink: `/${programPages[i][0]}` });
    if (!snapshot.media.some(m => m.url === photo)) await add('media', `manager-photo-${i + 1}`, { title: `Photo accueil — ${programPages[i][1]}`, filename: `home-${i + 1}.jpg`, url: photo, type: 'image', mimeType: 'image/jpeg', sizeBytes: (await stat(`public${photo}`)).size, altTextFr: 'Illustration du site ACV, à remplacer par une photographie de terrain si nécessaire.' });
  }
  for (const entity of ['programs', 'articles'] as const) {
    let needed = Math.max(0, 5 - snapshot[entity].length);
    for (let i = 0; i < 5 && needed > 0; i++) {
      const slug = `modele-${entity}-${programPages[i][0]}`;
      if (snapshot[entity].some(x => x.slug === slug)) continue;
      const titleFr = `À personnaliser — ${programPages[i][1]}`;
      const titleEn = `Template — ${['Education and youth', 'Nature and biodiversity', 'Sustainable agriculture', 'Community health', 'Economic empowerment'][i]}`;
      const copyFr = `Contenu de présentation à personnaliser par l’équipe ACV. ${programPages[i][2]} Remplacez ce modèle par la description de votre initiative, ses objectifs et vos photos avant de le présenter comme une action réalisée.`;
      const copyEn = 'Presentation template for the ACV team. Replace this text with your initiative, objectives and field photographs. This template does not describe a completed activity.';
      await add(entity, `manager-${slug}`, { slug, titleFr, titleEn, coverImage: photos[i], gallery: [], status: 'published', order: i, ...(entity === 'programs' ? { pillarId: pillars[i], programStatus: 'planned', summaryFr: programPages[i][2], summaryEn: copyEn, descriptionFr: copyFr, descriptionEn: copyEn } : { category: 'Modèle à personnaliser', excerptFr: programPages[i][2], excerptEn: copyEn, contentFr: copyFr, contentEn: copyEn }) });
      needed--;
    }
  }
  for (const group of ['ExecutiveCouncil', 'Staff']) {
    let needed = Math.max(0, 5 - snapshot.team.filter(x => x.category === group).length);
    for (let i = 1; i <= 5 && needed > 0; i++) {
      const id = `manager-team-${group}-${i}`;
      if (snapshot.team.some(x => x.id === id)) continue;
      await add('team', id, { name: `Profil à compléter ${i}`, roleFr: group === 'ExecutiveCouncil' ? 'Conseil d’administration' : 'Équipe opérationnelle', roleEn: group === 'ExecutiveCouncil' ? 'Board member' : 'Team member', bioFr: 'Profil de démonstration. Remplacer par le nom, la fonction et la biographie du membre.', bioEn: 'Demo profile. Replace with the member’s name, role and biography.', category: group, photoUrl: '/assets/demo/profile.svg', demo: true, status: 'visible', order: i });
      needed--;
    }
  }
  let neededStats = Math.max(0, 5 - snapshot.stats.length);
  for (let i = 0; i < 5 && neededStats > 0; i++) {
    const id = `manager-stat-${i + 1}`;
    if (snapshot.stats.some(x => x.id === id)) continue;
    await add('stats', id, { labelFr: ['Jeunes accompagnés', 'Arbres plantés', 'Jardins communautaires', 'Personnes sensibilisées', 'Initiatives soutenues'][i], labelEn: ['Young people supported', 'Trees planted', 'Community gardens', 'People reached', 'Initiatives supported'][i], value: '0', scope: 'global', displayPage: 'home', period: 'À renseigner', source: 'Modèle à compléter : aucune mesure disponible.', verified: false, status: 'active', order: i });
    neededStats--;
  }
  console.log('Éléments ajoutés :', report);
  console.log('Les modèles statistiques ne sont pas validés ; le site doit afficher « À renseigner » plutôt que zéro.');
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
