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
import ResourcePanel from "./ResourcePanel";

const navigation = [
  { id: "overview", label: "Vue d’ensemble", icon: "space_dashboard" },
  { id: "articles", label: "Articles & récits", icon: "article" },
  { id: "contactSubmissions", label: "Messages reçus", icon: "inbox" },
  { id: "donors", label: "Registre des dons", icon: "volunteer_activism" },
] as const;
type Tab = (typeof navigation)[number]["id"];
export default function AdminWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<AdminSession | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [tab, setTab] = useState<Tab>("overview");
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
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          <img src="/assets/brand/acv-logo.jpeg" alt="" />
          <span>
            ACV<span className="admin-brand-caption">ESPACE ÉQUIPE</span>
          </span>
        </Link>
        <p className="admin-eyebrow">PILOTER NOS ACTIONS</p>
        <nav aria-label="Navigation administration">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? "page" : undefined}
              className={tab === item.id ? "active" : ""}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
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
          <div>
            <span className="admin-eyebrow">AFRICA COMMUNITY VILLAGE</span>
            <p>Espace d’administration</p>
          </div>
          <div className="admin-account">
            <span>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </span>
            <button className="admin-button secondary" onClick={logout}>
              Déconnexion
            </button>
          </div>
        </header>
        <main className="admin-content">
          <div className="admin-page-title">
            <div>
              <p className="admin-eyebrow">COMMUNAUTÉ · TERRAIN · IMPACT</p>
              <h1>{navigation.find((item) => item.id === tab)?.label}</h1>
              <p className="admin-muted">
                {tab === "overview"
                  ? "Les dernières informations de votre organisation, au même endroit."
                  : "Données enregistrées dans votre espace ACV."}
              </p>
            </div>
            <span className="admin-status">
              <span />
              Session active
            </span>
          </div>
          {tab === "overview" ? (
            <Overview onError={onError} />
          ) : (
            <ResourcePanel
              key={tab}
              entity={tab}
              canEdit={["admin", "super-admin", "editor"].includes(user.role)}
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
                Les contenus de la page d’accueil restent ceux de la maquette.
                Leur affichage dynamique sera raccordé séparément.
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
