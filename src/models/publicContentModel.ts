import { sendContactEmail, type ContactMessage } from "@/lib/mail/contact";
import { contentModel } from '@/models/contentModel';
import { logAuditAction } from '@/models/auditModel';
import type { ContentEntity } from '@/lib/validation';
import type { ContentQuery, ContentQueryResult } from '@/models/contentModel';

type Item = Record<string, unknown> & { id: string };

const publicResources = {
  programs: { entity: 'programs', status: ['status', 'published'], order: 'order' },
  articles: { entity: 'articles', status: ['status', 'published'], order: 'publishDate', descending: true },
  team: { entity: 'team', status: ['status', 'visible'], order: 'order' },
  founders: { entity: 'founders', status: ['status', 'visible'], order: 'order' },
  'field-staff': { entity: 'fieldStaff', status: ['status', 'active'] },
  governance: { entity: 'governance', status: ['status', 'active'], order: 'order' },
  partners: { entity: 'partners', status: ['status', 'active'], order: 'order' },
  testimonials: { entity: 'testimonials', status: ['status', 'visible'], order: 'order' },
  stats: { entity: 'stats', status: ['status', 'active'], order: 'order' },
  policies: { entity: 'policies', status: ['status', 'published'] },
  'field-notes': { entity: 'fieldNotes', status: ['status', 'published'], order: 'date', descending: true }
} as const;

export type PublicResource = keyof typeof publicResources;

function compareValues(left: unknown, right: unknown) {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left ?? '').localeCompare(String(right ?? ''));
}

export const publicContentModel = {
  async getSettings() {
    const settings = await contentModel.list<Item>('siteSettings');
    return settings[0] ?? null;
  },

  async getBanners(pageRoute?: string) {
    const now = Date.now();
    let banners = (await contentModel.list<Item>('banners')).filter(
      (banner) => {
        if (banner.active === false || banner.isActive === false) return false;
        const start = banner.startDate ? new Date(String(banner.startDate)).getTime() : null;
        const end = banner.endDate ? new Date(String(banner.endDate)).getTime() : null;
        return (!start || start <= now) && (!end || end >= now);
      }
    );

    const rawPage = pageRoute?.trim().toLowerCase() ?? '';
    const normalizedPage =
      rawPage === 'home' || rawPage === '/' ? '/' : rawPage && !rawPage.startsWith('/') ? `/${rawPage}` : rawPage;

    if (normalizedPage) {
      banners = banners.filter((banner) => {
        const route = String(banner.pageRoute ?? banner.page_assignment ?? '').toLowerCase();
        return (
          route === normalizedPage ||
          route === rawPage ||
          route === 'all' ||
          (normalizedPage === '/' && (route === '/' || route === 'home')) ||
          (normalizedPage === '/about' && route.startsWith('/about')) ||
          (normalizedPage === '/programs' && route.startsWith('/programs'))
        );
      });
    }

    const ordered = banners.sort((a, b) => compareValues(a.order, b.order));
    if (normalizedPage === '/') return ordered.slice(0, 8);
    if (normalizedPage) return ordered.slice(0, 1);
    return ordered;
  },

  async list(
    resource: PublicResource,
    query: Pick<ContentQuery, 'category' | 'search' | 'page' | 'limit'> = {}
  ): Promise<ContentQueryResult<Item>> {
    const config = publicResources[resource];
    const [statusKey, statusValue] = config.status;
    const result = await contentModel.query<Item>(config.entity as ContentEntity, {
      ...query,
      status: statusKey === 'status' ? statusValue : undefined
    });
    let items = result.data;

    if (statusKey !== 'status') items = items.filter((item) => item[statusKey] === statusValue);
    if ('order' in config) {
      items.sort((a, b) => {
        const result = compareValues(a[config.order], b[config.order]);
        return 'descending' in config && config.descending ? -result : result;
      });
    }
    return { data: items, total: result.total };
  },

  async submitContact(data: Record<string, unknown>, ipAddress?: string) {
    const submission = await contentModel.create<Item>('contactSubmissions', {
      ...data,
      category: data.category ?? 'General Inquiry',
      subject: data.subject ?? `Message de ${data.name}`,
      status: 'new',
      emailDelivery: 'pending',
      read: false,
      date: new Date().toISOString().slice(0, 10)
    });
    let emailDelivery: 'sent' | 'failed' = 'failed';
    try {
      await sendContactEmail({ ...data, id: submission.id } as ContactMessage);
      emailDelivery = 'sent';
    } catch {
      // Never log SMTP credentials, message content or raw provider errors.
      console.error('[ACV contact] Notification e-mail indisponible.', { id: submission.id });
    }
    try {
      await contentModel.update('contactSubmissions', submission.id, {
        emailDelivery,
        ...(emailDelivery === 'sent' ? { emailSentAt: new Date().toISOString() } : {}),
      });
      await logAuditAction(
        { userName: String(data.name), userEmail: String(data.email) },
        'create', 'contactSubmissions',
        emailDelivery === 'sent' ? 'Message enregistré ; notification acceptée par SMTP.' : 'Message enregistré ; notification e-mail échouée. À traiter dans l’administration.',
        submission.id, ipAddress,
      );
    } catch {
      // The original message is already saved: don't invite duplicate submissions.
      console.error('[ACV contact] Suivi de notification non enregistré.', { id: submission.id });
    }
    return {
      id: submission.id,
      emailDelivery,
      message: emailDelivery === 'sent'
        ? 'Votre message a été enregistré et transmis à l’équipe ACV. Merci !'
        : 'Votre message a été enregistré dans notre espace de contact, mais la notification e-mail est indisponible. Pour une demande urgente, écrivez directement à info@acv-drc.org.',
    };
  },

  async submitDonation(data: Record<string, unknown>, ipAddress?: string) {
    const anonymous = Boolean(data.anonymous);
    const donation = await contentModel.create<Item>('donors', {
      ...data,
      name: anonymous ? 'Donateur Anonyme' : data.name,
      donationDate: new Date().toISOString().slice(0, 10),
      pillarAllocation: data.pillar ?? 'All Programs',
      type: 'Individuel'
    });
    await logAuditAction(
      {
        userName: String(data.name ?? 'Anonymous Donor'),
        userEmail: String(data.email ?? 'anonymous@acv.local')
      },
      'create',
      'donors',
      `Nouveau don enregistré : ${donation.amount} ${donation.currency}.`,
      donation.id,
      ipAddress
    );
    return donation;
  }
};
