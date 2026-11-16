"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminRequest, SESSION_KEY } from "@/lib/client/admin-api";

export default function LoginForm() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const result = await adminRequest("login", {
        method: "POST",
        body: JSON.stringify({
          email: String(form.get("email")).trim(),
          password: form.get("password"),
        }),
      });
      if (!result.token) throw new Error("La session n’a pas pu être créée.");
      sessionStorage.setItem(SESSION_KEY, result.token);
      router.replace("/admin/dashboard");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Connexion impossible.",
      );
      setBusy(false);
    }
  }
  return (
    <main className="admin-login">
      <div className="login-story">
        <Link href="/" className="admin-brand">
          <img src="/assets/brand/acv-logo.jpeg" alt="" />
          Africa Community Village
        </Link>
        <div>
          <p className="admin-eyebrow">ESPACE ÉQUIPE · GOMA, RDC</p>
          <h1>
            Faire vivre nos actions.
            <br />
            Partager notre impact.
          </h1>
          <p>
            Un espace pour les personnes qui font grandir ACV, chaque jour sur
            le terrain.
          </p>
        </div>
        <span>Communauté · Engagement · Transparence</span>
      </div>
      <div className="login-panel">
        <div className="login-form">
          <Link href="/" className="admin-text-link">
            ← Retour au site
          </Link>
          <p className="admin-eyebrow">ADMINISTRATION</p>
          <h2>Heureux de vous retrouver.</h2>
          <p className="admin-muted">
            Connectez-vous avec votre compte administrateur ACV.
          </p>
          <form onSubmit={submit} className="admin-form">
            <label>
              Adresse e-mail
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
                maxLength={191}
                placeholder="vous@organisation.org"
                disabled={busy}
              />
            </label>
            <div>
              <label htmlFor="admin-password">Mot de passe</label>
              <div className="password-field">
                <input
                  id="admin-password"
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  maxLength={200}
                  disabled={busy}
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={
                    visible
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {visible ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>
            {error && (
              <p className="admin-error" role="alert">
                {error}
              </p>
            )}
            <button className="admin-button" disabled={busy}>
              {busy ? "Connexion en cours…" : "Se connecter →"}
            </button>
          </form>
          <p className="admin-muted login-help">
            Accès réservé à l’équipe. Pour obtenir ou récupérer un compte,
            contactez votre administrateur principal.
          </p>
        </div>
      </div>
    </main>
  );
}
