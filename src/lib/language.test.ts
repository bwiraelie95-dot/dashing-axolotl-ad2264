import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveLanguagePreference } from './language';

test('keeps an explicit saved preference', () => {
  assert.equal(resolveLanguagePreference({ stored: 'fr', navigatorLanguages: ['en-US'] }), 'fr');
});

test('restores the language cookie when local storage is empty', () => {
  assert.equal(resolveLanguagePreference({ cookie: 'theme=dark; acv_lang=en; session=x' }), 'en');
});

test('detects the first supported browser language', () => {
  assert.equal(resolveLanguagePreference({ navigatorLanguages: ['sw-CD', 'en-GB', 'fr-FR'] }), 'en');
});

test('uses French as the safe default for an unsupported browser language', () => {
  assert.equal(resolveLanguagePreference({ navigatorLanguages: ['sw-CD'] }), 'fr');
});
