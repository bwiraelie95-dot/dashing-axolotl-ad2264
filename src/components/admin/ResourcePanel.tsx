"use client";
import { useEffect, useState } from "react";
import { adminRequest, SESSION_KEY } from "@/lib/client/admin-api";
import ArticleEditor, {
  textValue as text,
  type ContentRecord,
} from "./ArticleEditor";

type Entity = "articles" | "contactSubmissions" | "donors";
export default function ResourcePanel({
  entity,
  canEdit,
  onError,
}: {
  entity: Entity;
  canEdit: boolean;
  onError: (error: unknown) => void;
}) {
  const [items, setItems] = useState<ContentRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [editor, setEditor] = useState<ContentRecord | null | undefined>(
    undefined,
  );
  const [detail, setDetail] = useState<ContentRecord | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  useEffect(() => {
    if (!detail) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetail(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [detail !== null]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setItems([]);
    setDetail(null);
    const params = new URLSearchParams({
      page: String(page),
      limit: "15",
      search: query,
      ...(status ? { status } : {}),
    });
    adminRequest<ContentRecord[]>(`${entity}?${params}`, {
      signal: controller.signal,
    })
      .then((result) => {
        setItems(result.data);
        setTotal(result.total ?? result.data.length);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          onError(error);
          setError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [entity, page, query, status, version, onError]);
  async function exportDonations() {
    try {
      const response = await fetch(
        `/api/admin/donations/export?status=${encodeURIComponent(status)}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(SESSION_KEY)}`,
          },
        },
      );
      if (!response.ok) throw new Error("Export refusé.");
      const url = URL.createObjectURL(await response.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = "acv-donations.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Export impossible.");
    }
  }
  async function markRead(item: ContentRecord) {
    try {
      await adminRequest(`contactSubmissions/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ read: true }),
      });
      setDetail({ ...item, read: true });
      setVersion((v) => v + 1);
    } catch (error) {
      onError(error);
      setError(
        error instanceof Error ? error.message : "Enregistrement impossible.",
      );
    }
  }
  async function remove(item: ContentRecord) {
    if (
      !window.confirm(
        `Supprimer l’article « ${text(item.titleFr || item.titleEn)} » ?`,
      )
    )
      return;
    setDeleting(item.id);
    setError("");
    setNotice("");
    try {
      await adminRequest(`articles/${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });
      setNotice("Article supprimé.");
      if (items.length === 1 && page > 1) setPage(page - 1);
      else setVersion((v) => v + 1);
    } catch (error) {
      onError(error);
      setError(
        error instanceof Error ? error.message : "Suppression impossible.",
      );
    } finally {
      setDeleting(null);
    }
  }
  const receivedAt = text(detail?.createdAt || detail?.submittedAt);
  if (editor !== undefined)
    return (
      <ArticleEditor
        article={editor}
        onError={onError}
        onCancel={() => setEditor(undefined)}
        onSaved={() => {
          setEditor(undefined);
          setNotice("Article enregistré.");
          setVersion((v) => v + 1);
        }}
      />
    );
  return (
    <section className="admin-card resource-panel">
      <div className="admin-section-heading">
        <form
          className="admin-search"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(search.trim());
            setPage(1);
          }}
        >
          <label className="sr-only" htmlFor="resource-search">
            Rechercher
          </label>
          <input
            id="resource-search"
            placeholder="Rechercher…"
            value={search}
            maxLength={200}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button className="admin-button secondary">Rechercher</button>
        </form>
        {entity === "donors" && (
          <div className="admin-form-actions">
            <select
              aria-label="Filtrer par statut"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tous les statuts</option>
              {[
                "pending",
                "completed",
                "failed",
                "cancelled",
                "refunded",
                "partially_refunded",
                "disputed",
                "dispute_lost",
                "pledged",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              className="admin-button secondary"
              onClick={() => void exportDonations()}
            >
              Exporter CSV
            </button>
          </div>
        )}
        <div className="admin-form-actions">
          <button
            className="admin-button secondary"
            onClick={() => setVersion((v) => v + 1)}
            disabled={loading}
          >
            Actualiser
          </button>
          {entity === "articles" && canEdit && (
            <button
              className="admin-button"
              onClick={() => {
                setNotice("");
                setEditor(null);
              }}
            >
              + Nouvel article
            </button>
          )}
        </div>
      </div>
      {notice && (
        <p className="admin-success" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status" className="admin-empty">
          Chargement…
        </p>
      ) : !items.length ? (
        <p className="admin-empty">
          {error
            ? "Les données n’ont pas pu être chargées."
            : query
              ? "Aucun résultat pour cette recherche."
              : "Aucun enregistrement pour le moment."}
        </p>
      ) : (
        <div className="admin-table-scroll">
          <table>
            <thead>
              <tr>
                {(entity === "articles"
                  ? ["Article", "Catégorie", "Statut", "Actions"]
                  : entity === "donors"
                    ? ["Donateur", "Montant", "Fréquence", "Statut"]
                    : ["Expéditeur", "Sujet", "Statut", "Détail"]
                ).map((title) => (
                  <th key={title} scope="col">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {entity === "articles" ? (
                    <>
                      <td>
                        <strong>
                          {text(item.titleFr || item.titleEn) || "Sans titre"}
                        </strong>
                        <small>{text(item.author || item.authorName)}</small>
                      </td>
                      <td>{text(item.category) || "—"}</td>
                      <td>
                        <span
                          className={`admin-badge ${item.status === "published" ? "published" : ""}`}
                        >
                          {item.status === "published"
                            ? "Publié"
                            : item.status === "archived"
                              ? "Archivé"
                              : "Brouillon"}
                        </span>
                      </td>
                      <td>
                        {canEdit ? (
                          <div className="admin-row-actions">
                            <button
                              onClick={() => setEditor(item)}
                              disabled={deleting !== null}
                            >
                              Modifier
                            </button>
                            <button
                              className="danger"
                              onClick={() => void remove(item)}
                              disabled={deleting !== null}
                            >
                              {deleting === item.id
                                ? "Suppression…"
                                : "Supprimer"}
                            </button>
                          </div>
                        ) : (
                          <span className="admin-muted">Lecture seule</span>
                        )}
                      </td>
                    </>
                  ) : entity === "donors" ? (
                    <>
                      <td>
                        <strong>
                          {item.anonymous
                            ? "Anonyme"
                            : text(item.name || item.donorName) || "Sans nom"}
                        </strong>
                        <small>{text(item.email || item.donorEmail)}</small>
                        <small>{text(item.stripeSessionId)}</small>
                        <small>{text(item.stripePaymentIntentId)}</small>
                      </td>
                      <td>
                        {text(item.amount)} {text(item.currency) || "USD"}
                      </td>
                      <td>
                        {item.frequency === "monthly" ? "Mensuel" : "Ponctuel"}
                      </td>
                      <td>{text(item.status) || "—"}</td>
                    </>
                  ) : (
                    <>
                      <td>
                        <strong>{text(item.name)}</strong>
                        <small>{text(item.email)}</small>
                      </td>
                      <td>
                        {text(item.subject || item.reason) ||
                          "Demande de contact"}
                      </td>
                      <td>
                        <span className="admin-badge">
                          {item.read ? "Lu" : "Non lu"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-text-link"
                          onClick={() => {
                            setDetail(item);
                            if (canEdit && !item.read) void markRead(item);
                          }}
                        >
                          Consulter
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="admin-pagination">
        <span>{loading ? "…" : `${total} résultat(s)`}</span>
        <div>
          <button
            className="admin-button secondary"
            disabled={loading || page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Précédent
          </button>
          <span>Page {page}</span>
          <button
            className="admin-button secondary"
            disabled={loading || page * 15 >= total}
            onClick={() => setPage(page + 1)}
          >
            Suivant
          </button>
        </div>
      </div>
      {detail && (
        <div
          className="admin-message-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetail(null);
          }}
        >
          <section
            className="admin-message-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-message-title"
          >
            <div className="admin-section-heading">
              <div>
                <p className="admin-eyebrow">MESSAGE REÇU</p>
                <h3 id="admin-message-title">
                  {text(detail.subject || detail.reason) || "Message reçu"}
                </h3>
              </div>
              <button
                className="admin-button secondary"
                autoFocus
                onClick={() => setDetail(null)}
              >
                Fermer
              </button>
            </div>
            <p className="admin-muted">
              {text(detail.name)} ·{" "}
              <a href={`mailto:${text(detail.email)}`}>{text(detail.email)}</a>
            </p>
            {receivedAt && (
              <time className="admin-message-date" dateTime={receivedAt}>
                {receivedAt}
              </time>
            )}
            {detail.emailDelivery === "sent" && <p className="admin-note">Notification acceptée par le serveur e-mail.</p>}
            {detail.emailDelivery === "failed" && <p className="admin-error">Notification e-mail échouée. Le message est conservé ici : répondez au visiteur depuis votre messagerie.</p>}
            {detail.emailDelivery === "pending" && <p className="admin-note">Notification e-mail en attente ou non confirmée.</p>}
            <p className="admin-message-content">{text(detail.message)}</p>
          </section>
        </div>
      )}
    </section>
  );
}
