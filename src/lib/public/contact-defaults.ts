// Contact details already provided in the project's institutional content.
export const contactDefaults: Record<string, string | boolean> = {
  address: '184 Avenue de la Paix, Quartier Himbi, Goma, Nord-Kivu, République Démocratique du Congo',
  email: 'info@acv-drc.org',
  phone: '+243 975 131 159',
  secondaryPhone: '+243 977 531 777',
  instagramUrl: 'https://www.instagram.com/africa.community.village',
  instagramActive: true,
  facebookUrl: 'https://www.facebook.com/people/Africa-Community-Village/61566422018591/',
  facebookActive: true,
  twitterUrl: 'https://x.com/africomvillage',
  twitterActive: true,
};
export function withContactDefaults(settings: Record<string, unknown>) {
  const result = { ...settings };
  for (const [key, value] of Object.entries(contactDefaults)) {
    if (result[key] == null || (typeof result[key] === 'string' && !result[key].trim())) result[key] = value;
  }
  return result;
}
