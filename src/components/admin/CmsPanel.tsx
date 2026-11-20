"use client";
import { useEffect, useState } from "react";
import { adminRequest } from "@/lib/client/admin-api";

import { modules, type Field } from "@/lib/cms/modules";
import { essentialFields, pageLocation } from "@/lib/cms/editor-fields";
import { safeLink } from "@/lib/cms/validation";
type RecordData = Record<string, unknown> & { id?: string };
type Photo = { url: string; captionFr?: string; captionEn?: string };
const text = (v: unknown) => (v == null ? "" : String(v));
function mediaUrls(item: RecordData) {
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  return [
    ...new Set(
      [
        text(item.coverImage || item.imageUrl || item.image),
        text(item.imageMobile),
        ...gallery.flatMap((photo) => {
          if (typeof photo === "string") return [photo];
          if (photo && typeof photo === "object" && "url" in photo)
            return [text(photo.url)];
          return [];
        }),
      ].filter(Boolean),
    ),
  ];
}
export default function CmsPanel({
  entity,
  canEdit,
  onError,
}: {
  entity: string;
  canEdit: boolean;
  onError: (e: unknown) => void;
}) {
  const module = modules[entity];
  const [advanced, setAdvanced] = useState(false);
  const [editorTab, setEditorTab] = useState("content");
  const [dirty, setDirty] = useState(false);
  const tabs = [
    { id: "content", label: "Contenu", icon: "edit_note" },
    { id: "media", label: "Photos", icon: "photo_library" },
    { id: "publication", label: "Publication", icon: "publish" },
  ];
  const fieldGroup = (field: Field) =>
    field.type === "image" || field.type === "gallery"
      ? "media"
      : [
            "status",
            "active",
            "slug",
            "order",
            "activityDate",
            "publishedDate",
            "pillarId",
            "programStatus",
            "category",
            "programExternalId",
            "demo",
            "author",
          ].includes(field.key)
        ? "publication"
        : "content";
  const grouped = ["articles", "programs", "pages", "team", "banners"].includes(entity);
  useEffect(() => {
    if (!dirty) return;
    const guard = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  const closeEditor = () => {
    if (dirty && !confirm("Quitter sans enregistrer les modifications ?"))
      return;
    setValue(null);
    setDirty(false);
  };

  const [deleted, setDeleted] = useState<RecordData[]>([]);
  const [programs, setPrograms] = useState<RecordData[]>([]);
  useEffect(() => {
    if (!["articles", "stats"].includes(entity)) return;
    const c = new AbortController();
    fetch("/api/public/programs?limit=100", { signal: c.signal })
      .then((r) => r.json())
      .then((r) => setPrograms(r.data || []))
      .catch(() => {});
    return () => c.abort();
  }, [entity]);
  const [items, setItems] = useState<RecordData[]>([]),
    [drafts, setDrafts] = useState<RecordData[]>([]),
    [value, setValue] = useState<RecordData | null>(null);
  const [revision, setRevision] = useState<RecordData[]>([]),
    [preview, setPreview] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [version, setVersion] = useState(0);
  useEffect(() => {
    if (!value) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [Boolean(value)]);
  useEffect(() => {
    if (!value) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (!dirty || window.confirm("Quitter sans enregistrer les modifications ?")) {
        setValue(null);
        setDirty(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [value, dirty]);
  const fail = (e: unknown) => {
    onError(e);
    setError(e instanceof Error ? e.message : "Opération impossible.");
  };
  useEffect(() => {
    const controller = new AbortController();
    setBusy(true);
    setError("");
    adminRequest<RecordData[]>(
      `cms/${entity}?page=${page}&limit=20&search=${encodeURIComponent(search)}`,
      { signal: controller.signal },
    )
      .then((result) => {
        setItems(result.data);
        setDeleted(
          (result as typeof result & { deleted: RecordData[] }).deleted || [],
        );
        setTotal(result.total ?? result.data.length);
        setDrafts(
          (result as typeof result & { drafts: RecordData[] }).drafts ?? [],
        );
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          onError(e);
          setError(e.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setBusy(false);
      });
    return () => controller.abort();
  }, [entity, page, search, version, onError]);
  function edit(item: RecordData, tab = "content") {
    setValue(item);
    setAdvanced(false);
    setDirty(false);
    setEditorTab(tab);
    setPreview(false);
    setRevision([]);
    setError("");
    if (item.id)
      adminRequest<RecordData[]>(`cms/${entity}/${encodeURIComponent(item.id)}`)
        .then((r) => setRevision(r.data))
        .catch(fail);
  }
  async function save(draft: boolean) {
    if (!value) return;
    setBusy(true);
    setError("");
    const payload = Object.fromEntries(
      module.fields
        .filter(
          (f) =>
            value[f.key] !== undefined &&
            value[f.key] !== null &&
            !(f.type === "password" && !value[f.key]),
        )
        .map((f) => [f.key, value[f.key]]),
    );
    // New French-first records also have a usable English fallback.
    for (const field of module.fields) {
      if (field.key.endsWith("En") && !payload[field.key]) {
        const french = payload[field.key.slice(0, -2) + "Fr"];
        if (typeof french === "string" && french.trim()) payload[field.key] = french;
      }
    }
    try {
      await adminRequest(
        `cms/${entity}${value.id ? "/" + encodeURIComponent(value.id) : ""}`,
        {
          method: value.id ? "PUT" : "POST",
          body: JSON.stringify({ payload, draft }),
        },
      );
      setNotice(
        draft
          ? "Brouillon enregistré. Le contenu public est inchangé."
          : "Modifications enregistrées.",
      );
      setValue(null);
      setDirty(false);
      setVersion((v) => v + 1);
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }
  async function remove(item: RecordData) {
    if (!confirm("Confirmer la suppression de cet élément ?")) return;
    setBusy(true);
    try {
      await adminRequest(`${entity}/${encodeURIComponent(text(item.id))}`, {
        method: "DELETE",
      });
      setVersion((v) => v + 1);
      setNotice("Élément supprimé.");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }
  async function upload(files: FileList | null, field: Field) {
    if (!files?.length || !value) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      Array.from(files).forEach((file) => form.append("files", file));
      const r = await adminRequest<RecordData | RecordData[]>("upload", {
        method: "POST",
        body: form,
      });
      const media = Array.isArray(r.data) ? r.data : [r.data];
      setDirty(true);
      setValue((v) =>
        v
          ? {
              ...v,
              ...(entity === "banners" && field.key === "imageUrl" && !advanced ? { imageMobile: text(media[0].url || media[0].fileUrl) } : {}),
              [field.key]:
                field.type === "gallery"
                  ? [
                      ...(Array.isArray(v[field.key])
                        ? (v[field.key] as Photo[])
                        : []),
                      ...media.map((m) => ({ url: text(m.url || m.fileUrl) })),
                    ]
                  : text(media[0].url || media[0].fileUrl),
            }
          : v,
      );
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }
  const update = (key: string, v: unknown) => {
    setDirty(true);
    setValue((old) => {
      const next = { ...old, [key]: v };
      const slugify=(title:unknown)=>String(title||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      if(key==='titleFr'&&!old?.id&&(!old?.slug||old.slug===slugify(old.titleFr))&&typeof v==='string')next.slug=slugify(v);
      return next;
    });
  };
  return (
    <section className={`admin-card cms-panel ${value ? "cms-panel-editing" : ""}`}>
      {!value && error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {!value && notice && (
        <p className="admin-success" role="status">
          {notice}
        </p>
      )}
      {value ? (
        <div
          className="cms-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              (!dirty || window.confirm("Quitter sans enregistrer les modifications ?"))
            ) {
              setValue(null);
              setDirty(false);
            }
          }}
        >
          <section
            className="cms-editor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cms-editor-title"
          >
            {error && (
              <p className="admin-error" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="admin-success" role="status">
                {notice}
              </p>
            )}
          <div className="admin-section-heading">
            <h2>
              <span id="cms-editor-title">
              {value.id ? "Modifier" : "Créer"} — {module.label}
              </span>
            </h2>
            <button
              className="admin-button secondary"
              disabled={busy}
              onClick={closeEditor}
            >
              Fermer
            </button>
          </div>
          <div className="admin-form-actions">
            <button
              className="admin-button secondary"
              onClick={() => setPreview(!preview)}
            >
              {preview ? "Revenir au formulaire" : "Prévisualiser"}
            </button>
          </div>
          <p className="cms-editor-help">
            {entity === "programs"
              ? "Ajoutez le récit de votre activité, ses photos et sa date. Choisissez « published » dans Publication pour la rendre visible."
              : entity === "banners"
                ? "Dans l’onglet Photos, remplacez l’image d’ordinateur ou ajoutez une image adaptée au mobile. Les diapositives actives apparaissent sur la page d’accueil."
              : entity === "team"
                ? "Remplacez la photo, le nom et la fonction, puis choisissez le groupe et la visibilité."
                : "Préparez votre contenu, vérifiez son aperçu et enregistrez vos modifications."}
          </p>
          {grouped && !preview && (
            <div
              className="cms-editor-tabs"
              role="tablist"
              aria-label="Étapes de l’édition"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={editorTab === tab.id}
                  onClick={() => setEditorTab(tab.id)}
                >
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          {essentialFields[entity] && !preview && <div className="cms-simple-toolbar">
            <p>{entity === "pages" && value.slug ? pageLocation(value.slug) : "Remplissez le contenu, choisissez une photo, puis enregistrez."}</p>
            <button type="button" className="admin-text-link" aria-expanded={advanced} onClick={() => setAdvanced(v => !v)}>{advanced ? "Revenir aux champs essentiels" : "Options avancées et traduction"}</button>
          </div>}
          {preview ? (
            <div className="cms-preview">
              <p className="admin-eyebrow">APERÇU · NON ENREGISTRÉ</p>
              {["Fr", "En"].map((lang) => (
                <article key={lang}>
                  <h2>{text(value["title" + lang] || value.name)}</h2>
                  {safeLink(
                    text(value.coverImage || value.imageUrl || value.photoUrl),
                  ) &&
                    !!(
                      value.coverImage ||
                      value.imageUrl ||
                      value.photoUrl
                    ) && (
                      <img
                        src={text(
                          value.coverImage || value.imageUrl || value.photoUrl,
                        )}
                        alt=""
                      />
                    )}
                  {module.fields
                    .filter(
                      (f) => f.key.endsWith(lang) && !f.key.startsWith("title"),
                    )
                    .map((f) => (
                      <p key={f.key} className="whitespace-pre-wrap">
                        {text(value[f.key])}
                      </p>
                    ))}
                </article>
              ))}
            </div>
          ) : (
            <div className="cms-fields">
              {module.fields.filter(field => advanced || !essentialFields[entity] || essentialFields[entity].includes(field.key)).map((field) => (
                <div
                  key={field.key}
                  hidden={grouped && fieldGroup(field) !== editorTab}
                  className={`cms-field-group ${field.type === "textarea" || field.type === "gallery" ? "cms-wide" : ""}`}
                >
                  {entity === "siteSettings" &&
                    (
                      {
                        organizationName: "General Settings",
                        primaryColor: "Appearance",
                        seoTitleFr: "SEO",
                        instagramUrl: "Social Media & Footer Settings",
                        donationTitleFr: "Donations",
                        defaultLanguage: "Localization",
                      } as Record<string, string>
                    )[field.key] && (
                      <h3 className="cms-wide">
                        {
                          (
                            {
                              organizationName: "General Settings",
                              primaryColor: "Appearance",
                              seoTitleFr: "SEO",
                              instagramUrl: "Social Media & Footer Settings",
                              donationTitleFr: "Donations",
                              defaultLanguage: "Localization",
                            } as Record<string, string>
                          )[field.key]
                        }
                      </h3>
                    )}
                  <div
                    className={`admin-field ${field.type === "textarea" || field.type === "gallery" ? "cms-wide" : ""}`}
                  >
                    <span>
                      {field.label}
                      {field.required ? " *" : ""}
                    </span>
                    {["buttonUrl", "ctaLink", "secondaryUrl", "centralUrl"].includes(field.key) && <small>Page ouverte au clic sur le bouton, par exemple /contact. Facultatif.</small>}
                    {field.type === "gallery" && entity === "pages" && <small>Ajoutez une légende à chaque photo pour qu’elle apparaisse sur le site. L’image principale n’est pas répétée dans la galerie.</small>}
                    {field.key === "imageUrl" && entity === "banners" && !advanced && <small>Cette photo sera utilisée sur ordinateur et mobile.</small>}
                    {field.key === "programExternalId" ? (
                      <select
                        aria-label={field.label}
                        value={text(value[field.key])}
                        disabled={!canEdit}
                        onChange={(e) => update(field.key, e.target.value)}
                      >
                        <option value="">Aucun programme</option>
                        {programs.map((p) => (
                          <option key={p.id} value={p.id}>
                            {text(p.titleFr || p.titleEn)}
                          </option>
                        ))}
                        {!!value[field.key] &&
                          !programs.some((p) => p.id === value[field.key]) && (
                            <option value={text(value[field.key])}>
                              {text(value[field.key])}
                            </option>
                          )}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <input
                        aria-label={field.label}
                        type="checkbox"
                        checked={value[field.key] === true}
                        disabled={!canEdit}
                        onChange={(e) => update(field.key, e.target.checked)}
                      />
                    ) : field.type === "select" ? (
                      <select
                        aria-label={field.label}
                        value={text(value[field.key])}
                        disabled={!canEdit}
                        onChange={(e) => update(field.key, e.target.value)}
                      >
                        <option value="">Choisir…</option>
                        {field.options?.map((o) => (
                          <option key={o} value={o}>
                            {(
                              {
                                published: "Publié",
                                draft: "Brouillon",
                                archived: "Archivé",
                                visible: "Visible",
                                hidden: "Masqué",
                                ExecutiveCouncil: "Conseil d’administration",
                                Staff: "Membres",
                                active: "Actif",
                                suspended: "Suspendu",
                                planned: "Prévu",
                                completed: "Terminé",
                              } as Record<string, string>
                            )[o] || o}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        aria-label={field.label}
                        rows={7}
                        value={text(value[field.key])}
                        disabled={!canEdit}
                        onChange={(e) => update(field.key, e.target.value)}
                      />
                    ) : field.type === "gallery" ? (
                      <div>
                        <input
                          aria-label="Ajouter des photos"
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          disabled={busy || !canEdit}
                          onChange={(e) => void upload(e.target.files, field)}
                        />
                        <div className="cms-gallery">
                          {(Array.isArray(value[field.key])
                            ? (value[field.key] as Photo[])
                            : []
                          ).map((photo, i, all) => (
                            <div key={i}>
                              <img
                                src={photo.url}
                                alt={photo.captionFr || ""}
                              />
                              {["Fr", "En"].map((lang) => (
                                <input
                                  key={lang}
                                  aria-label={`Légende ${lang} ${i + 1}`}
                                  placeholder={`Légende ${lang}`}
                                  value={
                                    photo[("caption" + lang) as keyof Photo] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    update(
                                      field.key,
                                      all.map((p, j) =>
                                        i === j
                                          ? {
                                              ...p,
                                              ["caption" + lang]:
                                                e.target.value,
                                            }
                                          : p,
                                      ),
                                    )
                                  }
                                />
                              ))}
                              <button
                                type="button"
                                disabled={!canEdit || i === 0}
                                onClick={() => {
                                  const next = [...all];
                                  [next[i - 1], next[i]] = [
                                    next[i],
                                    next[i - 1],
                                  ];
                                  update(field.key, next);
                                }}
                              >
                                ← Déplacer
                              </button>
                              <button
                                type="button"
                                disabled={!canEdit}
                                onClick={() =>
                                  update(
                                    field.key,
                                    all.filter((_, j) => j !== i),
                                  )
                                }
                              >
                                Retirer
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {(field.type !== "image" || advanced) && <input
                          aria-label={field.label}
                          type={
                            field.type === "number"
                              ? "number"
                              : field.type === "password"
                                ? "password"
                                : "text"
                          }
                          autoComplete={
                            field.type === "password"
                              ? "new-password"
                              : undefined
                          }
                          value={text(value[field.key])}
                          disabled={!canEdit}
                          onChange={(e) =>
                            update(
                              field.key,
                              field.type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                            )
                          }
                        />}
                        {field.type === "image" && (
                          <>
                            <input
                              aria-label={`Téléverser ${field.label}`}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              disabled={busy || !canEdit}
                              onChange={(e) =>
                                void upload(e.target.files, field)
                              }
                            />
                            {!!value[field.key] &&
                              safeLink(text(value[field.key])) && (
                                <>
                                  <img
                                    className="cms-thumbnail"
                                    src={text(value[field.key])}
                                    alt="Aperçu"
                                  />
                                </>
                              )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {field.type === "image" &&
                    !!value[field.key] &&
                    safeLink(text(value[field.key])) && (
                      <button
                        type="button"
                        className="admin-button secondary"
                        disabled={!canEdit || busy}
                        onClick={() => update(field.key, "")}
                      >
                        Retirer cette image
                      </button>
                    )}
                </div>
              ))}
            </div>
          )}
          {canEdit && (
            <div className="admin-form-actions cms-save-bar">
              <span className="save-state">
                {dirty
                  ? "Modifications non enregistrées"
                  : "Prêt à enregistrer"}
              </span>
              {entity !== "users" && (
                <button
                  className="admin-button secondary"
                  disabled={busy}
                  onClick={() => void save(true)}
                >
                  Enregistrer un brouillon
                </button>
              )}
              <button
                className="admin-button"
                disabled={busy}
                onClick={() => void save(false)}
              >
                {busy ? "Enregistrement…" : "Enregistrer les modifications"}
              </button>
            </div>
          )}
          {!!revision.length && (
            <details>
              <summary>Historique et restauration ({revision.length})</summary>
              {revision.map((r) => (
                <div className="admin-section-heading" key={text(r.id)}>
                  <span>
                    {text(r.createdAt)} · {text(r.authorId)} · {text(r.action)}
                  </span>
                  <button
                    disabled={!canEdit}
                    className="admin-button secondary"
                    onClick={() => {
                      setValue({ ...(r.payload as RecordData), id: value.id });
                      setNotice(
                        "Version chargée dans le formulaire. Enregistrez pour la restaurer.",
                      );
                    }}
                  >
                    Charger cette version
                  </button>
                </div>
              ))}
            </details>
          )}
          </section>
        </div>
      ) : (
        <>
          {(entity === "banners" || entity === "pages") && <p className="admin-note mb-5">
            {entity === "banners" ? "Les diapositives de l’accueil sont prêtes. Utilisez Photos pour remplacer une image, puis enregistrez les modifications." : "Pour changer la photo « Né à Goma. Bâti pour durer. », recherchez ce titre, cliquez sur Photos, choisissez votre image et enregistrez."}
          </p>}
          <div className="admin-section-heading">
            <input
              aria-label="Rechercher"
              placeholder={`Rechercher dans ${module.label.toLowerCase()}…`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {canEdit && (entity !== "siteSettings" || !items.length) && (
              <button
                className="admin-button"
                onClick={() =>
                  edit(
                    Object.fromEntries(
                      module.fields
                        .filter(
                          (f) =>
                            f.type === "checkbox" ||
                            f.type === "select" ||
                            f.type === "number",
                        )
                        .map((f) => [
                          f.key,
                          f.type === "checkbox"
                            ? false
                            : f.type === "number"
                              ? 0
                              : f.options?.[0],
                        ]),
                    ),
                  )
                }
              >
                + Créer
              </button>
            )}
          </div>
          {busy ? (
            <p role="status">Chargement…</p>
          ) : (
            <div className="admin-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Contenu</th>
                    <th>Statut / rôle</th>
                    {["pages", "banners"].includes(entity) && <th>Photos</th>}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={text(item.id)}>
                      <td>
                        <strong>
                          {text(
                            item.titleFr ||
                              item.titleEn ||
                              item.name ||
                              item.labelFr ||
                              item.organizationName ||
                              item.id,
                          )}
                        </strong>
                        <small>
                          {entity === "pages" ? pageLocation(item.slug) : text(item.slug || item.email || item.lastLogin)}
                        </small>
                      </td>
                      <td>{text(item.status || item.role)}</td>
                      {["pages", "banners"].includes(entity) && (
                        <td>
                          <div className="cms-page-media-preview">
                            {mediaUrls(item)
                              .slice(0, 3)
                              .map((url) => (
                                <img key={url} src={url} alt="" />
                              ))}
                            <span>
                              {mediaUrls(item).length} photo
                              {mediaUrls(item).length === 1 ? "" : "s"}
                            </span>
                            <button
                              className="admin-text-link"
                              onClick={() => edit(item, "media")}
                            >
                              Modifier les photos
                            </button>
                          </div>
                        </td>
                      )}
                      <td>
                        <button
                          className="admin-text-link"
                          onClick={() => edit(item)}
                        >
                          {canEdit ? "Modifier" : "Consulter"}
                        </button>
                        {canEdit && entity !== "siteSettings" && (
                          <button
                            className="admin-text-link danger"
                            onClick={() => void remove(item)}
                          >
                            {" "}
                            Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!items.length && (
                <p className="admin-empty">Aucun contenu enregistré.</p>
              )}
            </div>
          )}
          <div className="admin-pagination">
            <span>{total} résultat(s)</span>
            <button
              disabled={page === 1 || busy}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </button>
            <span>Page {page}</span>
            <button
              disabled={page * 20 >= total || busy}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </button>
          </div>
          {!!deleted.length && (
            <details>
              <summary>Corbeille ({deleted.length})</summary>
              {deleted.map((item) => (
                <div key={text(item.id)} className="admin-section-heading">
                  <span>{text(item.titleFr || item.name || item.id)}</span>
                  <button
                    className="admin-button secondary"
                    disabled={!canEdit || busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await adminRequest(`cms/${entity}/${item.id}/restore`, {
                          method: "POST",
                        });
                        setNotice("Contenu restauré hors publication.");
                        setVersion((v) => v + 1);
                      } catch (e) {
                        fail(e);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Restaurer hors publication
                  </button>
                </div>
              ))}
            </details>
          )}
          {!!drafts.length && (
            <details>
              <summary>Brouillons enregistrés ({drafts.length})</summary>
              {drafts.map((d) => (
                <div key={text(d.id)} className="admin-section-heading">
                  <span>
                    {text((d.payload as RecordData).titleFr || d.recordId)}
                  </span>
                  <button
                    className="admin-button secondary"
                    onClick={() =>
                      edit({
                        ...(d.payload as RecordData),
                        id: text(d.recordId),
                      })
                    }
                  >
                    Reprendre
                  </button>
                </div>
              ))}
            </details>
          )}
        </>
      )}
    </section>
  );
}
