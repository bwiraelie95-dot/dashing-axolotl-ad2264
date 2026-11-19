"use client";
import { useEffect, useState } from "react";
type Item = Record<string, unknown> & { id: string };
const text = (value: unknown) => (typeof value === "string" ? value : "");
export default function PublicCollection({ resource }: { resource: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/public/${resource}?limit=100`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok)
          throw Error("Impossible de charger ces informations pour le moment.");
        setItems(body.data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [resource, retry]);
  if (loading)
    return (
      <p role="status" className="admin-card">
        Chargement…
      </p>
    );
  if (error)
    return (
      <div className="admin-card">
        <p role="alert">{error}</p>
        <button
          className="admin-button mt-4"
          onClick={() => setRetry((r) => r + 1)}
        >
          Réessayer
        </button>
      </div>
    );
  if (!items.length)
    return (
      <div className="admin-card">
        <h2 className="mb-3">Informations à venir</h2>
        <p>
          Aucun{" "}
          {resource === "team"
            ? "profil"
            : resource === "governance"
              ? "membre"
              : "contenu"}{" "}
          n’a encore été publié dans cette rubrique.
        </p>
        <a className="admin-text-link inline-block mt-5" href="/contact">
          Contacter l’équipe →
        </a>
      </div>
    );
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <article className="admin-card" key={item.id}>
          {text(item.photoUrl || item.coverImage) && (
            <img
              src={text(item.photoUrl || item.coverImage)}
              alt=""
              className="w-full h-64 object-cover rounded-xl mb-6"
              loading="lazy"
              decoding="async"
            />
          )}
          <h2>
            {text(item.titleFr || item.name || item.fullName || item.titleEn)}
          </h2>
          <p className="admin-eyebrow mt-3">
            {text(item.roleFr || item.category || item.location)}
          </p>
          <p className="whitespace-pre-wrap leading-7">
            {text(item.bioFr || item.excerptFr || item.captionFr)}
          </p>
          {text(item.contentFr) && (
            <details className="mt-4">
              <summary className="admin-text-link cursor-pointer">
                Lire la suite
              </summary>
              <p className="whitespace-pre-wrap leading-7 mt-4">
                {text(item.contentFr)}
              </p>
            </details>
          )}
        </article>
      ))}
    </div>
  );
}
