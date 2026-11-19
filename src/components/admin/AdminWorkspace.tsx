"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DashboardStats } from "@/types";
import {
  adminRequest,
  AdminApiError,
  SESSION_KEY,
  type AdminSession,
} from "@/lib/client/admin-api";
import RecordsPanel from "./RecordsPanel";
import CmsPanel from "./CmsPanel";
import { modules } from "@/lib/cms/modules";
import { can } from "@/lib/permissions";
import ResourcePanel from "./ResourcePanel";
import LanguageSwitch from "@/components/public/LanguageSwitch";

const navigation = [
  { id: "overview", label: "Vue d’ensemble", icon: "space_dashboard" },
  ...Object.entries(modules)
    .filter(([id]) =>
      [
        "articles",
        "programs",
        "banners",
        "team",
        "stats",
        "siteSettings",
        "pages",
        "users",
      ].includes(id),
    )
    .map(([id, module]) => ({
      id,
      label: module.label,
      icon:
        (
          {
            articles: "article",
            programs: "forest",
            banners: "image",
            team: "groups",
            stats: "monitoring",
            siteSettings: "tune",
            pages: "web",
            users: "manage_accounts",
          } as Record<string, string>
        )[id] || "edit_document",
    })),
  { id: "media", label: "Médiathèque", icon: "image" },
  { id: "auditLogs", label: "Journal d’audit", icon: "history" },
  { id: "contactSubmissions", label: "Messages reçus", icon: "inbox" },
  { id: "donors", label: "Registre des dons", icon: "volunteer_activism" },
] as const;
type Tab = (typeof navigation)[number]["id"];
const englishLabels: Record<string, string> = {
  overview: "Overview",
  articles: "Journal & articles",
  programs: "Programs & activities",
  banners: "Home banners",
  team: "Team",
  stats: "Impact figures",
  siteSettings: "Site settings",
  pages: "Pages & content",
  users: "Users",
  media: "Media library",
  auditLogs: "Audit log",
  contactSubmissions: "Messages",
  donors: "Donations",
};
export default function AdminWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<AdminSession | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [tab, setTab] = useState<Tab>("overview");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const english = language === "en";
  useEffect(() => {
    setLanguage(
      document.cookie
        .split("; ")
        .some((cookie) => cookie === "acv-language=en")
        ? "en"
        : "fr",
    );
  }, []);
  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    router.replace("/admin/login");
  }, [router]);
  const onError = useCallback(
    (error: unknown) => {
      if (error instanceof AdminApiError && error.status === 401) logout();
    },
    [logout],
  );
  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      router.replace("/admin/login");
      return;
    }
    const controller = new AbortController();
    setError("");
    adminRequest<AdminSession>("session", { signal: controller.signal })
      .then((result) => setUser(result.data))
      .catch((error) => {
        if (controller.signal.aborted) return;
        onError(error);
        setError(
          error instanceof Error ? error.message : "Session indisponible.",
        );
      });
    return () => controller.abort();
  }, [router, attempt, onError]);
  if (!user)
    return (
      <main className="admin-loading">
        <div className="admin-card">
          <h1>Administration ACV</h1>
          {error ? (
            <>
              <p role="alert" className="admin-error">
                {error}
              </p>
              <button
                className="admin-button"
                onClick={() => setAttempt((a) => a + 1)}
              >
                Réessayer
              </button>
              <button className="admin-button secondary" onClick={logout}>
                Retour à la connexion
              </button>
            </>
          ) : (
            <p role="status">Vérification de votre session…</p>
          )}
        </div>
      </main>
    );
  return (
    <div className="admin-shell">
      {navigationOpen && (
        <button
          className="admin-nav-backdrop"
          type="button"
          aria-label={english ? "Close navigation" : "Fermer la navigation"}
          onClick={() => setNavigationOpen(false)}
        />
      )}
      <aside
        id="admin-navigation"
        className={`admin-sidebar ${navigationOpen ? "is-open" : ""}`}
      >
        <Link href="/" className="admin-brand">
          <img src="/assets/brand/acv-logo.jpeg" alt="" />
          <span>
            ACV<span className="admin-brand-caption">ESPACE ÉQUIPE</span>
          </span>
        </Link>
        <p className="admin-eyebrow">PILOTER NOS ACTIONS</p>
        <nav aria-label="Navigation administration">
          {navigation
            .filter(
              (item) =>
                item.id === "overview" || can(user.role, item.id, "read"),
            )
            .map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setNavigationOpen(false);
                }}
                aria-current={tab === item.id ? "page" : undefined}
                className={tab === item.id ? "active" : ""}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {item.icon}
                </span>
                {english ? englishLabels[item.id] || item.label : item.label}
              </button>
            ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <p>
            Une équipe.
            <br />
            <strong>Un impact collectif.</strong>
          </p>
          <Link href="/">Voir le site ↗</Link>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-heading">
            <button
              className="admin-nav-toggle"
              type="button"
              aria-controls="admin-navigation"
              aria-expanded={navigationOpen}
              aria-label={
                navigationOpen
                  ? english
                    ? "Close navigation"
                    : "Fermer la navigation"
                  : english
                    ? "Open navigation"
                    : "Ouvrir la navigation"
              }
              onClick={() => setNavigationOpen((open) => !open)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                menu
              </span>
            </button>
            <div>
            <span className="admin-eyebrow">AFRICA COMMUNITY VILLAGE</span>
            <p>{english ? "Administration" : "Espace d’administration"}</p>
            </div>
          </div>
          <div className="admin-account">
            <span>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </span>
            <LanguageSwitch language={language} />
            <button className="admin-button secondary" onClick={logout}>
              {english ? "Log out" : "Déconnexion"}
            </button>
          </div>
        </header>
        <main className="admin-content">
          <div className="admin-page-title">
            <div>
              <p className="admin-eyebrow">COMMUNAUTÉ · TERRAIN · IMPACT</p>
              <h1>
                {english
                  ? englishLabels[tab]
                  : navigation.find((item) => item.id === tab)?.label}
              </h1>
              <p className="admin-muted">
                {tab === "overview"
                  ? english
                    ? "The latest information from your organization, all in one place."
                    : "Les dernières informations de votre organisation, au même endroit."
                  : english
                    ? "Information saved in your ACV workspace."
                    : "Données enregistrées dans votre espace ACV."}
              </p>
            </div>
            <span className="admin-status">
              <span />
              {english ? "Active session" : "Session active"}
            </span>
          </div>
          {tab === "overview" && (
            <section className="admin-welcome">
              <div>
                <p className="admin-eyebrow">
                  {english ? "YOUR ACV WORKSPACE" : "VOTRE ESPACE ACV"}
                </p>
                <h2>
                  {english ? "Welcome" : "Bonjour"},{" "}
                  {user.name.split(" ")[0]}.
                </h2>
                <p>
                  {english
                    ? "Find your content and the actions available to your role."
                    : "Retrouvez vos contenus et les actions accessibles à votre rôle."}
                </p>
                <span className="role-chip">
                  {(
                    {
                      "super-admin": "Super administrateur",
                      admin: "Administrateur",
                      editor: "Éditeur",
                      "program-manager": "Responsable programmes",
                      "communication-manager": "Communication",
                      "finance-manager": "Finance",
                      viewer: "Consultation",
                    } as Record<string, string>
                  )[user.role] || user.role}
                </span>
              </div>
              <div className="admin-shortcuts">
                {[
                  {
                    id: "programs",
                    label: english ? "Manage programs" : "Gérer les programmes",
                    icon: "forest",
                  },
                  {
                    id: "articles",
                    label: english ? "Open journal" : "Ouvrir le journal",
                    icon: "article",
                  },
                  {
                    id: "banners",
                    label: english
                      ? "Edit home photos"
                      : "Modifier les photos de l’accueil",
                    icon: "image",
                  },
                  {
                    id: "team",
                    label: english ? "Update the team" : "Mettre à jour l’équipe",
                    icon: "groups",
                  },
                  {
                    id: "donors",
                    label: english ? "View donations" : "Consulter les dons",
                    icon: "payments",
                  },
                ]
                  .filter((item) => can(user.role, item.id, "read"))
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTab(item.id);
                        setNavigationOpen(false);
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                      {item.label}
                      <span aria-hidden="true">↗</span>
                    </button>
                  ))}
              </div>
            </section>
          )}
          {tab === "overview" ? (
            <Overview onError={onError} />
          ) : tab === "media" || tab === "auditLogs" ? (
            <RecordsPanel
              key={tab}
              entity={tab}
              canEdit={can(user.role, tab, "manage")}
              onError={onError}
            />
          ) : modules[tab] ? (
            <CmsPanel
              key={tab}
              entity={tab}
              canEdit={can(user.role, tab, "update")}
              onError={onError}
            />
          ) : (
            <ResourcePanel
              key={tab}
              entity={tab as "contactSubmissions" | "donors"}
              canEdit={can(user.role, tab, "update")}
              onError={onError}
            />
          )}
        </main>
      </div>
    </div>
  );
}
function Overview({ onError }: { onError: (error: unknown) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    setStats(null);
    adminRequest<DashboardStats>("dashboard/stats", {
      signal: controller.signal,
    })
      .then((result) => setStats(result.data))
      .catch((error) => {
        if (!controller.signal.aborted) {
          onError(error);
          setError(error.message);
        }
      });
    return () => controller.abort();
  }, [version, onError]);
  return (
    <>
      <div className="admin-section-heading">
        <h2>Votre activité en un regard</h2>
        <button
          className="admin-button secondary"
          onClick={() => setVersion((v) => v + 1)}
        >
          Actualiser
        </button>
      </div>
      {error ? (
        <p role="alert" className="admin-error">
          {error}
        </p>
      ) : !stats ? (
        <p className="admin-card" role="status">
          Chargement des indicateurs…
        </p>
      ) : (
        <>
          <div className="admin-stats">
            {[
              ["Articles publiés", stats.counts.publishedArticles, "article"],
              ["Programmes", stats.counts.programs, "eco"],
              ["Messages non lus", stats.counts.unreadInquiries, "mail"],
              ["Dons enregistrés", stats.counts.donors, "favorite"],
            ].map(([label, value, icon]) => (
              <div className="admin-card stat-card" key={label}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {icon}
                </span>
                <p>{label}</p>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="admin-two-columns">
            <section className="admin-card">
              <h2>Dernières actions</h2>
              {stats.recentAuditLogs.length ? (
                <ul className="activity-list">
                  {stats.recentAuditLogs.slice(0, 6).map((item) => (
                    <li key={item.id}>
                      <span className="activity-dot" />
                      <div>
                        <strong>{item.userName || item.userEmail}</strong>
                        <p>{item.details}</p>
                        <small>{formatDate(item.timestamp)}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">Aucune activité enregistrée.</p>
              )}
            </section>
            <section className="admin-card">
              <h2>Messages récents</h2>
              {stats.recentInquiries.length ? (
                <ul className="activity-list">
                  {stats.recentInquiries.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <p>
                          {item.subject || item.reason || "Demande de contact"}
                        </p>
                        <small>{item.email}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">Aucun message pour le moment.</p>
              )}
              <div className="admin-note">
                Les brouillons restent privés. Seuls les contenus publiés
                apparaissent sur le site.
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}
export function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}
