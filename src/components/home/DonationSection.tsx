"use client";
import { useState } from "react";
export default function DonationSection({
  language,
}: {
  language: "fr" | "en";
}) {
  const english = language === "en";
  const t = (french: string, englishText: string) =>
    english ? englishText : french;
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(false);
  return (
    <section className="w-full py-24 bg-surface" id="don">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-reveal
          className="rounded-[28px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 bg-surface-container-lowest"
        >
          <div className="lg:col-span-5 bg-primary-container text-on-primary p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative">
            <div className="relative z-10 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/15 text-tertiary-fixed font-eyebrow text-eyebrow tracking-wider w-max">
                {t("SOUTIEN DIRECT & SOUVERAIN", "DIRECT, COMMUNITY-LED SUPPORT")}
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-surface-container-lowest leading-tight">
                {t("Votre don agit directement sur le terrain", "Your donation supports work on the ground")}
              </h2>
              <p className="font-body-md text-body-md text-primary-fixed leading-relaxed">
                {t("Chez ACV, 92% de vos contributions sont alloués aux activités concrètes menées dans les villages du Nord-Kivu. Aucun intermédiaire bureaucratique.", "At ACV, 92% of contributions go to practical activities in North Kivu communities, without bureaucratic intermediaries.")}
              </p>
              <ul className="flex flex-col gap-4 pt-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary-fixed text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-sm text-body-sm text-surface-container-lowest">
                    {t("Transparence totale et comptes publiés semestriellement.", "Full transparency, with accounts published every six months.")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary-fixed text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-sm text-body-sm text-surface-container-lowest">
                    {t("Gestion intégrale par des acteurs locaux engagés à Goma.", "Managed by committed local teams in Goma.")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary-fixed text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-sm text-body-sm text-surface-container-lowest">
                    {t("Impact mesuré et rapport photographique remis aux donateurs.", "Measured impact and photo updates shared with donors.")}
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative z-10 pt-8 mt-8 border-t border-on-primary/15 flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary-fixed text-[28px]">
                shield
              </span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm font-semibold text-surface-container-lowest">
                  {t("Plateforme certifiée et sécurisée", "Certified, secure platform")}
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed text-xs">
                  {t("Paiement chiffré SSL 256 bits", "256-bit SSL encrypted payment")}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 bg-surface-container-low flex flex-col justify-center">
            <div className="flex bg-surface-container p-1 rounded-xl mb-8 max-w-sm">
              <button
                className="flex-1 py-2.5 text-center font-label-md text-label-md rounded-lg transition-all"
                style={{ background: !monthly ? "white" : "transparent" }}
                id="btn-once"
                onClick={() => setMonthly(false)}
                aria-pressed={!monthly}
                type="button"
              >
                {t("Don ponctuel", "One-time donation")}
              </button>
              <button
                className="flex-1 py-2.5 text-center font-label-md text-label-md rounded-lg text-on-surface-variant hover:text-on-surface transition-all"
                style={{ background: monthly ? "white" : "transparent" }}
                id="btn-monthly"
                onClick={() => setMonthly(true)}
                aria-pressed={monthly}
                type="button"
              >
                {t("Don mensuel", "Monthly donation")}
              </button>
            </div>

            <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-3 block">
              {t("Sélectionnez un montant", "Choose an amount")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAmount(25);
                  setCustom("");
                }}
                aria-pressed={!custom && amount === 25}
                className={`py-3.5 px-4 rounded-xl font-bold text-xl transition-colors ${!custom && amount === 25 ? "bg-primary-container text-on-primary" : "bg-white text-on-surface"}`}
              >
                {" "}
                25 ${" "}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAmount(50);
                  setCustom("");
                }}
                aria-pressed={!custom && amount === 50}
                className={`py-3.5 px-4 rounded-xl font-bold text-xl transition-colors ${!custom && amount === 50 ? "bg-primary-container text-on-primary" : "bg-white text-on-surface"}`}
              >
                {" "}
                50 ${" "}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAmount(100);
                  setCustom("");
                }}
                aria-pressed={!custom && amount === 100}
                className={`py-3.5 px-4 rounded-xl font-bold text-xl transition-colors ${!custom && amount === 100 ? "bg-primary-container text-on-primary" : "bg-white text-on-surface"}`}
              >
                {" "}
                100 ${" "}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAmount(250);
                  setCustom("");
                }}
                aria-pressed={!custom && amount === 250}
                className={`py-3.5 px-4 rounded-xl font-bold text-xl transition-colors ${!custom && amount === 250 ? "bg-primary-container text-on-primary" : "bg-white text-on-surface"}`}
              >
                {" "}
                250 ${" "}
              </button>
            </div>

            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline-sm text-headline-sm text-on-surface-variant font-bold">
                $
              </span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                id="custom-amount"
                aria-label={t("Montant personnalisé en dollars", "Custom amount in US dollars")}
                min="5"
                max="10000"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                placeholder={t("Autre montant libre", "Enter another amount")}
                type="number"
              />
            </div>

            <div className="mb-8">
              <label
                className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-2 block"
                htmlFor="project-select"
              >
                {t("Attribuer mon don à une priorité", "Direct my donation to a priority")}
              </label>
              <div className="relative">
                <select
                  className="w-full bg-surface-container-lowest py-3.5 px-4 rounded-xl font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary transition-all cursor-pointer"
                  id="project-select"
                >
                  <option value="urgent">
                    {t("Où le besoin est le plus urgent (Tous piliers)", "Where the need is greatest (all pillars)")}
                  </option>
                  <option value="nature">
                    {t("Nature & Reboisement des Virunga", "Nature & Virunga reforestation")}
                  </option>
                  <option value="agri">
                    {t("Agroécologie & Souveraineté alimentaire", "Agroecology & food sovereignty")}
                  </option>
                  <option value="jeunesse">{t("Bourses & Éducation rurale", "Scholarships & rural education")}</option>
                  <option value="sante">
                    {t("Eau propre & Santé communautaire", "Clean water & community health")}
                  </option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <button
              className="w-full py-4 px-6 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-bold shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2"
              id="submit-donation"
              disabled
              aria-describedby="payment-note"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">
                favorite
              </span>
              <span id="donate-label">
                {monthly
                  ? t(
                      `Faire un don mensuel de ${custom || amount} $`,
                      `Donate ${custom || amount} $ monthly`,
                    )
                  : t(
                      `Faire un don de ${custom || amount} $`,
                      `Donate ${custom || amount} $`,
                    )}
              </span>
            </button>
            <p
              id="payment-note"
              className="mt-4 text-sm text-on-surface-variant"
            >
              {t("Aperçu du formulaire — le paiement sera disponible après connexion à Stripe.", "Form preview — payments will be available once Stripe is connected.")}
            </p>
            <div className="mt-4 flex items-center justify-between text-outline text-xs">
              <span>{t("Reçu fiscal immédiat par email", "Immediate receipt by email")}</span>
              <span>{t("Déductible d'impôt selon juridiction", "Tax-deductible where applicable")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
