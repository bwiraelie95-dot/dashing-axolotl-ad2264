"use client";
export default function LanguageSwitch({ language }: { language: string }) {
  return (
    <div className="language-switch" role="group" aria-label="Langue / Language">
      {(["fr", "en"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={language === value}
          onClick={() => {
            if (language === value) return;
            document.cookie = `acv-language=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
            window.location.reload();
          }}
        >
          {value.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
