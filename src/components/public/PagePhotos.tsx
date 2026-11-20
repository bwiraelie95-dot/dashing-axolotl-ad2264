import { local, type Item, type Language } from '@/lib/public/cms';

export default function PagePhotos({ item, language, cover = false }: { item?: Item; language: Language; cover?: boolean }) {
  if (!item) return null;
  const gallery = Array.isArray(item.gallery) ? item.gallery.filter((photo): photo is Record<string, unknown> => !!photo && typeof photo === 'object' && typeof photo.url === 'string') : [];
  const photos = [...(cover && item.coverImage ? [{ url: String(item.coverImage), captionFr: '', captionEn: '' }] : []), ...gallery];
  if (!photos.length) return null;
  return <div className="page-content-gallery">{photos.map((photo, i) => <figure key={`${photo.url}-${i}`}>
    <img src={String(photo.url)} alt={local(photo, 'caption', language)} loading="lazy" />
    {!!local(photo, 'caption', language) && <figcaption>{local(photo, 'caption', language)}</figcaption>}
  </figure>)}</div>;
}
