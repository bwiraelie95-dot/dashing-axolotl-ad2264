"use client";
export default function LanguageSwitch({ language }: { language: string }) {
  return (
    <label>
      Langue / Language{" "}
      <select
        aria-label="Langue / Language"
        value={language}
        onChange={(e) => {
          document.cookie = `acv-language=${e.target.value}; Path=/; Max-Age=31536000; SameSite=Lax`;
          window.location.reload();
        }}
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
