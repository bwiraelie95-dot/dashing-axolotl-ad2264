import { local, type Item, type Language } from '@/lib/public/cms';

export default function PagePhotos({ item, language }: { item?: Item; language: Language }) {
  if (!item) return null;
  const gallery = Array.isArray(item.gallery) ? item.gallery.filter((photo): photo is Record<string, unknown> => !!photo && typeof photo === 'object' && typeof photo.url === 'string') : [];
  const photos = gallery.filter((photo, index) =>
    !!local(photo, 'caption', language).trim() && photo.url !== item.coverImage &&
    gallery.findIndex(candidate => candidate.url === photo.url) === index
  );
  if (!photos.length) return null;
  return <div className="page-content-gallery">{photos.map((photo, i) => <figure key={`${photo.url}-${i}`}>
    <img src={String(photo.url)} alt={local(photo, 'caption', language)} loading="lazy" />
    {!!local(photo, 'caption', language) && <figcaption>{local(photo, 'caption', language)}</figcaption>}
  </figure>)}</div>;
}
