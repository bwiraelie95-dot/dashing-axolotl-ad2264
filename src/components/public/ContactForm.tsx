"use client";
import { useState, type FormEvent } from "react";
export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setError("");
    setSent(false);
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(20000),
      });
      const body = await response.json();
      if (!response.ok) throw Error(body.error || "Envoi impossible.");
      setSent(true);
      form.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-card admin-form" onSubmit={submit}>
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
          Votre message a été transmis à l’équipe ACV.
        </p>
      )}
      <button disabled={busy} className="admin-button">
        {busy ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}
