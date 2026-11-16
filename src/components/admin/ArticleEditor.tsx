"use client";
import { useState, type FormEvent } from "react";
import { adminRequest } from "@/lib/client/admin-api";
export type ContentRecord = Record<string, unknown> & { id: string };
export const textValue = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

export default function ArticleEditor({
  article,
  onSaved,
  onCancel,
  onError,
}: {
  article: ContentRecord | null;
  onSaved: () => void;
  onCancel: () => void;
  onError: (error: unknown) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await adminRequest(
        article ? `articles/${encodeURIComponent(article.id)}` : "articles",
        { method: article ? "PUT" : "POST", body: JSON.stringify(data) },
      );
      onSaved();
    } catch (error) {
      onError(error);
      setError(
        error instanceof Error ? error.message : "Enregistrement impossible.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="admin-card">
      <div className="admin-section-heading">
        <h2>{article ? "Modifier l’article" : "Nouvel article"}</h2>
        <button
          className="admin-button secondary"
          onClick={onCancel}
          disabled={busy}
        >
          Retour à la liste
        </button>
      </div>
      <form className="admin-form" onSubmit={submit}>
        <fieldset disabled={busy}>
          <div className="admin-two-columns">
            {(["Fr", "En"] as const).map((language) => (
              <div className="admin-editor-column" key={language}>
                <h3>
                  {language === "Fr" ? "Version française" : "Version anglaise"}
                </h3>
                <label>
                  Titre ({language.toUpperCase()})
                  <input
                    name={`title${language}`}
                    required
                    minLength={3}
                    maxLength={250}
                    defaultValue={textValue(article?.[`title${language}`])}
                  />
                </label>
                <label>
                  Extrait ({language.toUpperCase()})
                  <textarea
                    name={`excerpt${language}`}
                    rows={3}
                    defaultValue={textValue(article?.[`excerpt${language}`])}
                  />
                </label>
                <label>
                  Contenu ({language.toUpperCase()})
                  <textarea
                    name={`content${language}`}
                    rows={9}
                    required
                    minLength={10}
                    defaultValue={textValue(article?.[`content${language}`])}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="admin-two-columns">
            <label>
              Catégorie
              <input
                name="category"
                required
                minLength={2}
                maxLength={100}
                defaultValue={textValue(article?.category)}
                placeholder="Éducation, environnement…"
              />
            </label>
            <label>
              Auteur
              <input
                name="author"
                maxLength={200}
                defaultValue={textValue(article?.author || article?.authorName)}
              />
            </label>
            <label>
              Image de couverture (URL)
              <input
                name="coverImage"
                type="url"
                defaultValue={textValue(
                  article?.coverImage || article?.imageUrl,
                )}
                placeholder="https://…"
              />
            </label>
            <label>
              Statut
              <select
                aria-label="Statut" name="status"
                defaultValue={textValue(article?.status) || "draft"}
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </label>
          </div>
        </fieldset>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-form-actions">
          <button className="admin-button" disabled={busy}>
            {busy ? "Enregistrement…" : "Enregistrer l’article"}
          </button>
          <button
            type="button"
            className="admin-button secondary"
            disabled={busy}
            onClick={onCancel}
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}
