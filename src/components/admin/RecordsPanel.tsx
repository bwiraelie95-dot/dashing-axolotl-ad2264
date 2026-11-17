"use client";
import { useEffect, useState } from "react";
import { adminRequest, SESSION_KEY } from "@/lib/client/admin-api";
type Row = Record<string, unknown> & { id: string };
export default function RecordsPanel({
  entity,
  canEdit,
  onError,
}: {
  entity: "media" | "auditLogs";
  canEdit: boolean;
  onError: (e: unknown) => void;
}) {
  const [rows, setRows] = useState<Row[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [version, setVersion] = useState(0),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [search, setSearch] = useState("");
  const fail = (e: unknown) => {
    onError(e);
    setError(e instanceof Error ? e.message : "Erreur réseau.");
  };
  useEffect(() => {
    const c = new AbortController();
    setBusy(true);
    adminRequest<Row[]>(
      `${entity}?page=${page}&limit=20&search=${encodeURIComponent(search)}`,
      { signal: c.signal },
    )
      .then((r) => {
        setRows(r.data);
        setTotal(r.total || 0);
      })
      .catch((e) => {
        if (!c.signal.aborted) {
          onError(e);
          setError(e.message);
        }
      })
      .finally(() => {
        if (!c.signal.aborted) setBusy(false);
      });
    return () => c.abort();
  }, [entity, page, search, version, onError]);
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("files", f));
      await adminRequest("upload", { method: "POST", body: form });
      setVersion((v) => v + 1);
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    if (!confirm("Supprimer définitivement ce média non utilisé ?")) return;
    try {
      await adminRequest(`media/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setVersion((v) => v + 1);
    } catch (e) {
      fail(e);
    }
  }
  return (
    <section className="admin-card">
      <div className="admin-section-heading">
        <input
          aria-label="Rechercher"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {entity === "media" && canEdit && (
          <label>
            Téléverser des médias
            <input
              type="file"
              multiple
              disabled={busy}
              onChange={(e) => void upload(e.target.files)}
            />
          </label>
        )}
      </div>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {busy ? (
        <p role="status">Chargement…</p>
      ) : entity === "media" ? (
        <div className="cms-gallery">
          {rows.map((r) => (
            <article key={r.id}>
              {r.type === "image" && (
                <img
                  src={String(r.url)}
                  alt={String(r.altTextFr || r.title || "")}
                />
              )}
              <p>{String(r.title)}</p>
              <a
                className="admin-text-link"
                href={String(r.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ouvrir ↗
              </a>
              <button
                className="admin-button secondary"
                onClick={() => {
                  void navigator.clipboard.writeText(String(r.url)).catch(fail);
                }}
              >
                Copier le lien
              </button>
              {canEdit && (
                <button onClick={() => void remove(r.id)}>Supprimer</button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Détail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{String(r.createdAt || r.timestamp)}</td>
                  <td>{String(r.userEmail || "")}</td>
                  <td>{String(r.action)}</td>
                  <td>{String(r.details || "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="admin-pagination">
        <span>{total} enregistrements</span>
        <button
          disabled={page === 1 || busy}
          onClick={() => setPage((p) => p - 1)}
        >
          Précédent
        </button>
        <span>{page}</span>
        <button
          disabled={page * 20 >= total || busy}
          onClick={() => setPage((p) => p + 1)}
        >
          Suivant
        </button>
      </div>
    </section>
  );
}
