import type { Language } from '@/types';

interface LanguagePreferenceInput {
  stored?: string | null;
  cookie?: string | null;
  navigatorLanguages?: readonly string[] | null;
}

function supportedLanguage(value: string | null | undefined): Language | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().split(/[-_]/, 1)[0];
  return normalized === 'fr' || normalized === 'en' ? normalized : null;
}

function cookieLanguage(cookie: string | null | undefined): Language | null {
  const match = cookie?.match(/(?:^|;\s*)acv_lang=(fr|en)(?:;|$)/i);
  return supportedLanguage(match?.[1]);
}

export function resolveLanguagePreference({
  stored,
  cookie,
  navigatorLanguages
}: LanguagePreferenceInput): Language {
  const savedPreference = supportedLanguage(stored) ?? cookieLanguage(cookie);
  if (savedPreference) return savedPreference;

  for (const candidate of navigatorLanguages ?? []) {
    const language = supportedLanguage(candidate);
    if (language) return language;
  }

  return 'fr';
}
