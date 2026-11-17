import { z } from 'zod';

export const contentEntitySchema = z.enum([
  'pages',
  'banners',
  'programs',
  'team',
  'founders',
  'fieldStaff',
  'governance',
  'articles',
  'media',
  'partners',
  'donors',
  'testimonials',
  'stats',
  'siteSettings',
  'auditLogs',
  'contactSubmissions',
  'policies',
  'fieldNotes'
]);

export type ContentEntity = z.infer<typeof contentEntitySchema>;

export const adminEntitySchema = z.union([contentEntitySchema, z.literal('users')]);
export type AdminEntity = z.infer<typeof adminEntitySchema>;

export const idSchema = z.string().trim().min(1).max(191);

export const entityPayloadSchema = z
  .record(z.string().max(100), z.unknown())
  .refine((payload) => Object.keys(payload).length > 0, 'Aucune donnée à enregistrer.')
  .refine((payload) => Object.keys(payload).length <= 100, 'Trop de champs ont été envoyés.');

const adminRoleSchema = z.enum(['super-admin', 'admin', 'editor', 'viewer']);
const adminStatusSchema = z.enum(['active', 'suspended']);

export const adminUserCreateSchema = z.object({
  id: idSchema.optional(),
  name: z.string().trim().min(2).max(150),
  email: z.email().max(191).transform((value) => value.trim().toLowerCase()),
  password: z.string().min(12).max(200),
  role: adminRoleSchema.default('editor'),
  status: adminStatusSchema.default('active'),
  avatar: z.string().trim().max(2_048).optional()
}).strict();

export const adminUserPatchSchema = adminUserCreateSchema
  .omit({ id: true })
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, 'Aucune donnée à enregistrer.');

export const contactSubmissionPatchSchema = z.object({
  read: z.boolean().optional(),
  status: z.enum(['new', 'reviewed', 'replied']).optional()
}).strict().refine((payload) => Object.keys(payload).length > 0, 'Aucune donnée à enregistrer.');

export const siteSettingsPatchSchema = z.object({
  organizationName: z.string().trim().max(191).optional(),
  address: z.string().trim().max(500).optional(),
  email: z.email().max(191).optional(),
  secondaryEmail: z.union([z.email().max(191), z.literal('')]).optional(),
  phone: z.string().trim().max(50).optional(),
  secondaryPhone: z.string().trim().max(50).optional(),
  whatsapp: z.string().trim().max(50).optional(),
  officeHoursEn: z.string().trim().max(500).optional(),
  officeHoursFr: z.string().trim().max(500).optional(),
  registrationNumber: z.string().trim().max(191).optional(),
  instagramUrl: z.string().trim().max(2_048).optional(),
  facebookUrl: z.string().trim().max(2_048).optional(),
  linkedinUrl: z.string().trim().max(2_048).optional(),
  twitterUrl: z.string().trim().max(2_048).optional(),
  instagram: z.string().trim().max(2_048).optional(),
  facebook: z.string().trim().max(2_048).optional(),
  linkedin: z.string().trim().max(2_048).optional(),
  twitter: z.string().trim().max(2_048).optional(),
  legalNoticeEn: z.string().max(50_000).optional(),
  legalNoticeFr: z.string().max(50_000).optional(),
  privacyPolicyEn: z.string().max(50_000).optional(),
  privacyPolicyFr: z.string().max(50_000).optional(),
  defaultOgImage: z.string().trim().max(2_048).optional(),
  bannerSpeedMs: z.coerce.number().int().min(3_000).max(60_000).optional()
}).strict().refine((payload) => Object.keys(payload).length > 0, 'Aucune donnée à enregistrer.');

const bannerPayloadFields = {
  id: idSchema.optional(),
  pageRoute: z.string().trim().min(1).max(191),
  titleEn: z.string().trim().min(2).max(255),
  titleFr: z.string().trim().min(2).max(255),
  subtitleEn: z.string().trim().max(5_000).optional().nullable(),
  subtitleFr: z.string().trim().max(5_000).optional().nullable(),
  imageUrl: z.string().trim().max(2_048).optional(),
  image: z.string().trim().max(2_048).optional(),
  ctaTextEn: z.string().trim().max(191).optional().nullable(),
  ctaTextFr: z.string().trim().max(191).optional().nullable(),
  ctaLink: z.string().trim().max(2_048).optional().nullable(),
  altTextEn: z.string().trim().max(255).optional().nullable(),
  altTextFr: z.string().trim().max(255).optional().nullable(),
  order: z.coerce.number().int().min(0).max(10_000).optional(),
  active: z.boolean().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable()
};

export const bannerPayloadSchema = z
  .object(bannerPayloadFields)
  .passthrough()
  .refine((data) => Boolean(data.imageUrl || data.image), {
    message: 'Une image est requise pour la bannière.',
    path: ['imageUrl']
  })
  .refine(
    (data) => !data.startDate || !data.endDate || new Date(data.startDate) <= new Date(data.endDate),
    { message: 'La date de fin doit être postérieure à la date de début.', path: ['endDate'] }
  );

export const bannerPatchSchema = z.object({
  ...bannerPayloadFields,
  pageRoute: bannerPayloadFields.pageRoute.optional(),
  titleEn: bannerPayloadFields.titleEn.optional(),
  titleFr: bannerPayloadFields.titleFr.optional()
}).passthrough().refine(
  (data) => !data.startDate || !data.endDate || new Date(data.startDate) <= new Date(data.endDate),
  { message: 'La date de fin doit être postérieure à la date de début.', path: ['endDate'] }
);

export const adminQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  category: z.string().trim().max(100).optional(),
  status: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).optional()
});

export const loginSchema = z.object({
  email: z.email().max(191),
  password: z.string().min(8).max(200)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(200),
  newPassword: z
    .string()
    .min(12)
    .max(200)
    .regex(/[a-z]/, 'Le nouveau mot de passe doit contenir une minuscule.')
    .regex(/[A-Z]/, 'Le nouveau mot de passe doit contenir une majuscule.')
    .regex(/[0-9]/, 'Le nouveau mot de passe doit contenir un chiffre.')
    .regex(/[^A-Za-z0-9]/, 'Le nouveau mot de passe doit contenir un caractère spécial.')
}).refine((data) => data.currentPassword !== data.newPassword, {
  path: ['newPassword'],
  message: 'Le nouveau mot de passe doit être différent du mot de passe actuel.'
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.email().max(191),
  phone: z.string().trim().max(50).optional(),
  category: z.string().trim().max(100).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(10_000)
});

export const donationSchema = z.object({
  name: z.string().trim().max(150).optional(),
  email: z.email().max(191).optional(),
  amount: z.coerce.number().positive().max(1_000_000).default(50),
  currency: z.enum(['USD', 'EUR', 'CDF']).default('USD'),
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'yearly']).default('one-time'),
  pillar: z.string().trim().max(150).optional(),
  paymentMethod: z.string().trim().max(100).optional(),
  anonymous: z.boolean().default(false),
  notes: z.string().trim().max(2_000).optional()
});

export const articleInputSchema = z
  .object({
    id: idSchema.optional(),
    titleEn: z.string().trim().min(3).max(250),
    titleFr: z.string().trim().min(3).max(250),
    contentEn: z.string().trim().min(10),
    contentFr: z.string().trim().min(10),
    category: z.string().trim().min(2).max(100),
    status: z.enum(['published', 'draft'])
  })
  .catchall(z.unknown());
