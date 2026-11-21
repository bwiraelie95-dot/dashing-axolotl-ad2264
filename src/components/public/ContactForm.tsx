"use client";
import { useState, type FormEvent } from "react";
export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setError("");
    setSent("");
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(45000),
      });
      const body = await response.json();
      if (!response.ok) throw Error(body.error || "Envoi impossible.");
      setSent(body.data?.message || "Votre message a été enregistré.");
      form.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-card admin-form" onSubmit={submit}>
      <div className="contact-honeypot" aria-hidden="true">
        <label>Votre site web<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label>
        Votre nom
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={150}
        />
      </label>
      <label>
        Adresse e-mail
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={191}
        />
      </label>
      <label>
        Sujet
        <select name="subject">
          <option>Demande d’information</option>
          <option>Devenir bénévole</option>
          <option>Proposer un partenariat</option>
          <option>Données personnelles</option>
        </select>
      </label>
      <label>
        Message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={10000}
          rows={6}
        />
      </label>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      {sent && (
        <p role="status" className="admin-success">
          {sent}
        </p>
      )}
      <button disabled={busy} className="admin-button">
        {busy ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}
