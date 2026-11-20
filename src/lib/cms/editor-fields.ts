// Optional fields remain available without crowding everyday editing.
export const essentialFields: Record<string, string[]> = {
  pages: ['titleFr', 'subtitleFr', 'contentFr', 'coverImage', 'status'],
  banners: ['titleFr', 'subtitleFr', 'imageUrl', 'active', 'status'],
  articles: ['titleFr', 'excerptFr', 'contentFr', 'coverImage', 'category', 'status'],
  programs: ['titleFr', 'summaryFr', 'descriptionFr', 'coverImage', 'pillarId', 'programStatus', 'status'],
  team: ['name', 'roleFr', 'bioFr', 'photoUrl', 'category', 'demo', 'status'],
  stats: ['labelFr', 'value', 'period', 'source', 'verified', 'status'],
  siteSettings: ['organizationName', 'logo', 'address', 'email', 'phone', 'secondaryPhone', 'instagramUrl', 'instagramActive', 'facebookUrl', 'facebookActive', 'twitterUrl', 'twitterActive'],
};
export function pageLocation(slug: unknown) {
  const key = String(slug || '');
  const names: Record<string, string> = {
    'home-story': 'Accueil · photo et texte « Né à Goma. Bâti pour durer. »',
    about: 'Notre histoire · en-tête',
    approach: 'Notre approche · en-tête',
    'goma-restoration': 'Notre approche · projet Goma Restoration',
    programmes: 'Programmes · en-tête',
    journal: 'Journal · en-tête',
    'notre-equipe': 'Notre équipe · en-tête',
    contact: 'Contact · en-tête',
  };
  if (key.startsWith('value-')) return 'Notre histoire · carte de valeur';
  if (key.startsWith('principle-') || key.startsWith('phase-')) return 'Notre approche · étape';
  return names[key] || key;
}
