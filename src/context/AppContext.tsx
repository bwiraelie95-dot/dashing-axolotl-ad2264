import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Language,
  PageRoute,
  AdminUser,
  PageItem,
  BannerSlide,
  ProgramPillar,
  TeamMember,
  Founder,
  FieldAgent,
  GovernanceMember,
  Article,
  MediaItem,
  Partner,
  Donor,
  Testimonial,
  ImpactStat,
  SiteSettings,
  AuditLog,
  ContactSubmission,
  PolicyDocument,
  FieldNote,
  DashboardStats,
  DataRequestState
} from '../types';
import { fallbackBanners, fallbackSiteSettings } from '../data/fallbackData';
import { api, ApiError, getAuthToken } from '../services/api';
import { resolveLanguagePreference } from '../lib/language';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentRoute: PageRoute | string;
  navigateTo: (route: PageRoute | string) => void;

  // Admin Auth & Modal
  isAdminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  currentUser: AdminUser | null;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // File Upload from device
  uploadMedia: (files: File[] | FileList) => Promise<MediaItem[]>;

  // Synchronized Dashboard Analytics
  dashboardStats: DashboardStats | null;
  refreshDashboardStats: () => Promise<void>;

  // 17 Administrative Modules
  pages: PageItem[];
  addPage: (item: Partial<PageItem>) => Promise<PageItem>;
  updatePage: (id: string, partial: Partial<PageItem>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;

  banners: BannerSlide[];
  addBanner: (banner: BannerSlide | Omit<BannerSlide, 'id'>) => Promise<void>;
  updateBanner: (banner: BannerSlide | string, partial?: Partial<BannerSlide>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;

  programs: ProgramPillar[];
  addProgram: (item: Partial<ProgramPillar>) => Promise<ProgramPillar>;
  updateProgram: (program: ProgramPillar | string, partial?: Partial<ProgramPillar>) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;

  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember | Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (member: TeamMember | string, partial?: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  founders: Founder[];
  addFounder: (item: Partial<Founder>) => Promise<Founder>;
  updateFounder: (id: string, partial: Partial<Founder>) => Promise<void>;
  deleteFounder: (id: string) => Promise<void>;

  fieldStaff: FieldAgent[];
  addFieldStaff: (item: Partial<FieldAgent>) => Promise<FieldAgent>;
  updateFieldStaff: (id: string, partial: Partial<FieldAgent>) => Promise<void>;
  deleteFieldStaff: (id: string) => Promise<void>;

  governance: GovernanceMember[];
  addGovernance: (item: Partial<GovernanceMember>) => Promise<GovernanceMember>;
  updateGovernance: (id: string, partial: Partial<GovernanceMember>) => Promise<void>;
  deleteGovernance: (id: string) => Promise<void>;

  policies: PolicyDocument[];
  updatePolicy: (policy: PolicyDocument | string, partial?: Partial<PolicyDocument>) => Promise<void>;

  blogPosts: Article[];
  articles: Article[];
  addBlogPost: (post: Article | Omit<Article, 'id'>) => Promise<void>;
  updateBlogPost: (post: Article | string, partial?: Partial<Article>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  fieldNotes: FieldNote[];
  addFieldNote: (note: FieldNote | Omit<FieldNote, 'id'>) => Promise<void>;
  deleteFieldNote: (id: string) => Promise<void>;

  media: MediaItem[];
  deleteMedia: (id: string) => Promise<void>;

  partners: Partner[];
  addPartner: (item: Partial<Partner>) => Promise<Partner>;
  updatePartner: (id: string, partial: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;

  donors: Donor[];
  donations: Donor[];
  addDonation: (donation: Donor | Omit<Donor, 'id'>) => Promise<void>;

  testimonials: Testimonial[];
  addTestimonial: (item: Partial<Testimonial>) => Promise<Testimonial>;
  updateTestimonial: (id: string, partial: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  stats: ImpactStat[];
  addStat: (item: Partial<ImpactStat>) => Promise<ImpactStat>;
  updateStat: (id: string, partial: Partial<ImpactStat>) => Promise<void>;
  deleteStat: (id: string) => Promise<void>;

  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;

  auditLogs: AuditLog[];

  contactSubmissions: ContactSubmission[];
  addContactSubmission: (sub: ContactSubmission | Omit<ContactSubmission, 'id'>) => Promise<void>;
  markContactRead: (id: string) => Promise<void>;
  updateContactStatus: (id: string, status: ContactSubmission['status']) => Promise<void>;

  adminUsers: AdminUser[];
  addAdminUser: (item: Partial<AdminUser>) => Promise<AdminUser>;
  updateAdminUser: (id: string, partial: Partial<AdminUser>) => Promise<void>;
  deleteAdminUser: (id: string) => Promise<void>;

  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
  dataState: DataRequestState;
  retryData: () => Promise<void>;

  actionLoading: {
    isOpen: boolean;
    message?: string;
    submessage?: string;
    status: 'loading' | 'success';
  };
  triggerActionLoading: (message?: string, submessage?: string, minDurationMs?: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode; initialRoute?: string }> = ({
  children,
  initialRoute = '/'
}) => {
  // Keep the server and first client render identical, then restore the user's
  // preference after hydration to avoid a full React client-side regeneration.
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const preferredLanguage = resolveLanguagePreference({
      stored: localStorage.getItem('acv_lang'),
      cookie: document.cookie,
      navigatorLanguages: navigator.languages?.length ? navigator.languages : [navigator.language]
    });

    setLanguageState(preferredLanguage);
    localStorage.setItem('acv_lang', preferredLanguage);
    document.documentElement.lang = preferredLanguage;
    document.cookie = `acv_lang=${preferredLanguage}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('acv_lang', lang);
    document.documentElement.lang = lang;
    document.cookie = `acv_lang=${lang}; path=/; max-age=31536000; samesite=lax`;
  };

  const [currentRoute, setCurrentRoute] = useState<PageRoute | string>(initialRoute);

  useEffect(() => {
    document.documentElement.lang = language;

    const titles: Record<string, { en: string; fr: string }> = {
      '/': { en: 'Africa Community Village', fr: 'Africa Community Village' },
      '/about': { en: 'About us', fr: 'À propos' },
      '/programs': { en: 'Programs', fr: 'Programmes' },
      '/approach': { en: 'Our approach', fr: 'Notre approche' },
      '/blog': { en: 'Blog & news', fr: 'Blog & actualités' },
      '/contact': { en: 'Contact', fr: 'Contact' },
      '/donate': { en: 'Donate', fr: 'Faire un don' }
    };
    const routeKey = Object.keys(titles).find((route) => route !== '/' && String(currentRoute).startsWith(route)) ?? '/';
    const pageTitle = titles[routeKey][language];
    document.title = routeKey === '/' ? pageTitle : `${pageTitle} | Africa Community Village`;
  }, [currentRoute, language]);

  const navigateTo = (route: PageRoute | string) => {
    const target = new URL(String(route), window.location.origin);
    const browserUrl = `${target.pathname}${target.search}${target.hash}`;

    setCurrentRoute(target.pathname);
    window.history.pushState({}, '', browserUrl);

    const scrollToTarget = () => {
      if (target.hash) {
        const element = document.getElementById(decodeURIComponent(target.hash.slice(1)));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    };

    requestAnimationFrame(() => requestAnimationFrame(scrollToTarget));
    window.setTimeout(scrollToTarget, 180);
    window.setTimeout(scrollToTarget, 500);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      const nextRoute = window.location.pathname || '/';
      if (nextRoute !== currentRoute) setCurrentRoute(nextRoute);

      if (window.location.hash) {
        window.setTimeout(() => {
          document
            .getElementById(decodeURIComponent(window.location.hash.slice(1)))
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [currentRoute]);

  // Loading indicator
  // Keep the first server/hydrated frame structured while public data syncs.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading || !window.location.hash) return;

    const timer = window.setTimeout(() => {
      document
        .getElementById(decodeURIComponent(window.location.hash.slice(1)))
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [currentRoute, isLoading]);

  // CircleProgressIndicator Action Loading State
  const [actionLoading, setActionLoading] = useState<{
    isOpen: boolean;
    message?: string;
    submessage?: string;
    status: 'loading' | 'success';
  }>({
    isOpen: false,
    message: '',
    submessage: '',
    status: 'loading'
  });

  const triggerActionLoading = useCallback(
    async (message?: string, submessage?: string, minDurationMs: number = 750): Promise<void> => {
      setActionLoading({
        isOpen: true,
        message: message || (language === 'fr' ? 'Traitement de votre action...' : 'Processing your action...'),
        submessage: submessage || (language === 'fr' ? 'En attente d’une suite favorable...' : 'Awaiting confirmation...'),
        status: 'loading'
      });

      await new Promise((resolve) => setTimeout(resolve, minDurationMs));

      setActionLoading((prev) => ({
        ...prev,
        status: 'success',
        submessage: language === 'fr' ? 'Opération validée avec succès !' : 'Action confirmed successfully!'
      }));

      setTimeout(() => {
        setActionLoading((prev) => ({ ...prev, isOpen: false }));
      }, 550);
    },
    [language]
  );

  // Admin Auth state
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = typeof window === 'undefined' ? null : localStorage.getItem('acv_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Entities state with initial fallbacks
  const [pages, setPages] = useState<PageItem[]>([]);
  const [banners, setBanners] = useState<BannerSlide[]>(fallbackBanners);
  const [programs, setPrograms] = useState<ProgramPillar[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [fieldStaff, setFieldStaff] = useState<FieldAgent[]>([]);
  const [governance, setGovernance] = useState<GovernanceMember[]>([]);
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(fallbackSiteSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [dataState, setDataState] = useState<DataRequestState>({
    status: 'idle',
    error: null,
    updatedAt: null
  });

  // Load only the datasets required by the active route. Successfully loaded
  // resources are cached for the lifetime of the client session.
  const loadedDatasetKeys = useRef(new Set<string>());

  type PublicDataResult = { success: boolean; data: unknown };
  type PublicLoadTask = {
    key: string;
    load: () => Promise<PublicDataResult>;
    apply: (data: unknown) => void;
  };

  const hydrateFromApi = useCallback(async (route: string, force = false) => {
    const routeGroup = route.startsWith('/about')
      ? '/about'
      : route.startsWith('/programs')
        ? '/programs'
        : route.startsWith('/blog')
          ? '/blog'
        : route.startsWith('/admin')
          ? '/admin'
          : route;
    const tasks: PublicLoadTask[] = [];
    const addTask = (task: PublicLoadTask) => {
      if (force || !loadedDatasetKeys.current.has(task.key)) tasks.push(task);
    };

    addTask({
      key: 'settings',
      load: api.public.getSettings,
      apply: (data) => {
        if (data) setSiteSettings((previous) => ({ ...previous, ...(data as SiteSettings) }));
      }
    });
    tasks.push({
      key: `banners:${routeGroup}`,
      load: () => api.public.getBanners(routeGroup),
      apply: (data) => {
        const nextBanners = data as BannerSlide[];
        setBanners(nextBanners.length > 0 ? nextBanners : fallbackBanners);
      }
    });

    const addPrograms = () => addTask({
      key: 'programs',
      load: () => api.public.getPrograms({ limit: 50 }),
      apply: (data) => setPrograms(data as ProgramPillar[])
    });
    const addArticles = () => addTask({
      key: 'articles:first-page',
      load: () => api.public.getArticles(undefined, { page: 1, limit: 12 }),
      apply: (data) => setArticles(data as Article[])
    });
    const addStats = () => addTask({
      key: 'stats',
      load: () => api.public.getStats({ limit: 50 }),
      apply: (data) => setStats(data as ImpactStat[])
    });

    if (routeGroup === '/') {
      addPrograms();
      addArticles();
      addStats();
      addTask({
        key: 'partners',
        load: () => api.public.getPartners({ limit: 24 }),
        apply: (data) => setPartners(data as Partner[])
      });
      addTask({
        key: 'testimonials',
        load: () => api.public.getTestimonials({ limit: 12 }),
        apply: (data) => setTestimonials(data as Testimonial[])
      });
    } else if (routeGroup === '/programs') {
      addPrograms();
      addStats();
    } else if (routeGroup === '/blog') {
      addArticles();
    } else if (routeGroup === '/about') {
      addTask({ key: 'team', load: () => api.public.getTeam({ limit: 100 }), apply: (data) => setTeamMembers(data as TeamMember[]) });
      addTask({ key: 'founders', load: () => api.public.getFounders({ limit: 50 }), apply: (data) => setFounders(data as Founder[]) });
      addTask({ key: 'field-staff', load: () => api.public.getFieldStaff({ limit: 100 }), apply: (data) => setFieldStaff(data as FieldAgent[]) });
      addTask({ key: 'governance', load: () => api.public.getGovernance({ limit: 50 }), apply: (data) => setGovernance(data as GovernanceMember[]) });
      addTask({ key: 'policies', load: () => api.public.getPolicies({ limit: 50 }), apply: (data) => setPolicies(data as PolicyDocument[]) });
      addTask({ key: 'field-notes', load: () => api.public.getFieldNotes({ limit: 24 }), apply: (data) => setFieldNotes(data as FieldNote[]) });
    } else if (routeGroup === '/admin') {
      addPrograms();
      addArticles();
      addStats();
      addTask({ key: 'team', load: () => api.public.getTeam({ limit: 100 }), apply: (data) => setTeamMembers(data as TeamMember[]) });
      addTask({ key: 'founders', load: () => api.public.getFounders({ limit: 50 }), apply: (data) => setFounders(data as Founder[]) });
      addTask({ key: 'field-staff', load: () => api.public.getFieldStaff({ limit: 100 }), apply: (data) => setFieldStaff(data as FieldAgent[]) });
      addTask({ key: 'governance', load: () => api.public.getGovernance({ limit: 50 }), apply: (data) => setGovernance(data as GovernanceMember[]) });
      addTask({ key: 'partners', load: () => api.public.getPartners({ limit: 100 }), apply: (data) => setPartners(data as Partner[]) });
      addTask({ key: 'testimonials', load: () => api.public.getTestimonials({ limit: 100 }), apply: (data) => setTestimonials(data as Testimonial[]) });
    }

    setIsLoading(tasks.length > 0);
    if (tasks.length > 0) {
      setDataState((previous) => ({ status: 'loading', error: null, updatedAt: previous.updatedAt }));
    }

    let successes = 0;
    let failures = 0;

    // Three concurrent requests keeps the small Loopia connection pool stable
    // while avoiding the previous eleven-request global waterfall.
    for (let index = 0; index < tasks.length; index += 3) {
      const batch = tasks.slice(index, index + 3);
      const results = await Promise.allSettled(batch.map((task) => task.load()));
      results.forEach((result, resultIndex) => {
        const task = batch[resultIndex];
        if (result.status === 'fulfilled' && result.value.success) {
          task.apply(result.value.data);
          loadedDatasetKeys.current.add(task.key);
          successes += 1;
        } else {
          failures += 1;
        }
      });
    }

    if (routeGroup === '/admin' && (adminUser || getAuthToken())) {
      const adminTasks: PublicLoadTask[] = [
        { key: 'admin:pages', load: () => api.admin.list<PageItem>('pages', { page: 1, limit: 200 }), apply: (data) => setPages(data as PageItem[]) },
        { key: 'admin:banners', load: () => api.admin.list<BannerSlide>('banners', { page: 1, limit: 200 }), apply: (data) => setBanners(data as BannerSlide[]) },
        { key: 'admin:programs', load: () => api.admin.list<ProgramPillar>('programs', { page: 1, limit: 200 }), apply: (data) => setPrograms(data as ProgramPillar[]) },
        { key: 'admin:team', load: () => api.admin.list<TeamMember>('team', { page: 1, limit: 200 }), apply: (data) => setTeamMembers(data as TeamMember[]) },
        { key: 'admin:founders', load: () => api.admin.list<Founder>('founders', { page: 1, limit: 200 }), apply: (data) => setFounders(data as Founder[]) },
        { key: 'admin:fieldStaff', load: () => api.admin.list<FieldAgent>('fieldStaff', { page: 1, limit: 200 }), apply: (data) => setFieldStaff(data as FieldAgent[]) },
        { key: 'admin:governance', load: () => api.admin.list<GovernanceMember>('governance', { page: 1, limit: 200 }), apply: (data) => setGovernance(data as GovernanceMember[]) },
        { key: 'admin:articles', load: () => api.admin.list<Article>('articles', { page: 1, limit: 200 }), apply: (data) => setArticles(data as Article[]) },
        { key: 'admin:media', load: () => api.admin.list<MediaItem>('media', { page: 1, limit: 200 }), apply: (data) => setMedia(data as MediaItem[]) },
        { key: 'admin:partners', load: () => api.admin.list<Partner>('partners', { page: 1, limit: 200 }), apply: (data) => setPartners(data as Partner[]) },
        { key: 'admin:donors', load: () => api.admin.list<Donor>('donors', { page: 1, limit: 200 }), apply: (data) => setDonors(data as Donor[]) },
        { key: 'admin:testimonials', load: () => api.admin.list<Testimonial>('testimonials', { page: 1, limit: 200 }), apply: (data) => setTestimonials(data as Testimonial[]) },
        { key: 'admin:stats', load: () => api.admin.list<ImpactStat>('stats', { page: 1, limit: 200 }), apply: (data) => setStats(data as ImpactStat[]) },
        { key: 'admin:contacts', load: () => api.admin.list<ContactSubmission>('contactSubmissions', { page: 1, limit: 200 }), apply: (data) => setContactSubmissions(data as ContactSubmission[]) },
        { key: 'admin:audit', load: () => api.admin.list<AuditLog>('auditLogs', { page: 1, limit: 200 }), apply: (data) => setAuditLogs(data as AuditLog[]) },
        { key: 'admin:settings', load: () => api.admin.list<SiteSettings>('siteSettings', { page: 1, limit: 1 }), apply: (data) => {
          const settings = (data as SiteSettings[])[0];
          if (settings) setSiteSettings((previous) => ({ ...previous, ...settings }));
        } },
        { key: 'admin:policies', load: () => api.admin.list<PolicyDocument>('policies', { page: 1, limit: 200 }), apply: (data) => setPolicies(data as PolicyDocument[]) },
        { key: 'admin:fieldNotes', load: () => api.admin.list<FieldNote>('fieldNotes', { page: 1, limit: 200 }), apply: (data) => setFieldNotes(data as FieldNote[]) }
      ];
      if (adminUser?.role === 'super-admin') {
        adminTasks.push({ key: 'admin:users', load: () => api.admin.list<AdminUser>('users', { page: 1, limit: 200 }), apply: (data) => setAdminUsers(data as AdminUser[]) });
      }

      for (let index = 0; index < adminTasks.length; index += 3) {
        const batch = adminTasks.slice(index, index + 3);
        const results = await Promise.allSettled(batch.map((task) => task.load()));
        results.forEach((result, resultIndex) => {
          if (result.status === 'fulfilled' && result.value.success) {
            batch[resultIndex].apply(result.value.data);
          } else {
            failures += 1;
          }
        });
      }

      try {
        const dashboard = await api.dashboard.getStats();
        if (dashboard.success) setDashboardStats(dashboard.data);
      } catch (error) {
        console.warn('Admin dashboard hydration deferred:', error);
      }
    }

    const partialMessage = failures > 0
      ? language === 'fr'
        ? 'Certaines données n’ont pas pu être actualisées. Le contenu disponible reste affiché.'
        : 'Some data could not be refreshed. Available content remains visible.'
      : null;
    setDataState({
      status: failures > 0 && successes === 0 ? 'error' : 'success',
      error: partialMessage,
      updatedAt: Date.now()
    });
    setIsLoading(false);
  }, [adminUser, language]);

  const retryData = useCallback(
    async () => hydrateFromApi(String(currentRoute), true),
    [currentRoute, hydrateFromApi]
  );

  useEffect(() => {
    void hydrateFromApi(String(currentRoute));
  }, [currentRoute, hydrateFromApi]);

  const refreshDashboardStats = async () => {
    try {
      const res = await api.dashboard.getStats();
      if (res.success) {
        setDashboardStats(res.data);
      }
    } catch (err) {
      console.error('Failed to refresh dashboard stats:', err);
    }
  };

  // Auth methods
  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.auth.login(email, pass);
      if (res.success && res.user) {
        setAdminUser(res.user);
        localStorage.setItem('acv_admin_session', JSON.stringify(res.user));
        await refreshDashboardStats();
        return true;
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return false;
      throw err;
    }

    return false;
  };

  const logoutAdmin = () => {
    api.auth.logout();
    setAdminUser(null);
    localStorage.removeItem('acv_admin_session');
  };

  const login = async (email: string, pass: string) => {
    const ok = await loginAdmin(email, pass);
    return { success: ok, error: ok ? undefined : 'Identifiants invalides' };
  };

  // Device file upload
  const uploadMedia = async (files: File[] | FileList): Promise<MediaItem[]> => {
    const res = await api.upload.uploadFiles(files);
    if (!res.success || !res.data) {
      throw new Error('Le serveur n’a pas confirmé le téléversement.');
    }
    const items = Array.isArray(res.data) ? res.data : [res.data];
    setMedia((prev) => [...items, ...prev]);
    return items;
  };

  // CRUD state changes are applied only after the API confirms persistence.

  // Pages
  const addPage = async (item: Partial<PageItem>): Promise<PageItem> => {
    const newItem = {
      id: `page_${Date.now()}`,
      route: item.route || '/new-page',
      slug: item.slug || 'new-page',
      titleEn: item.titleEn || 'New Page',
      titleFr: item.titleFr || 'Nouvelle Page',
      status: item.status || 'published',
      order: pages.length + 1,
      ...item
    } as PageItem;
    const response = await api.admin.create<PageItem>('pages', newItem);
    setPages((prev) => [...prev, response.data]);
    await refreshDashboardStats();
    return response.data;
  };

  const updatePage = async (id: string, partial: Partial<PageItem>): Promise<void> => {
    const response = await api.admin.update<PageItem>('pages', id, partial);
    setPages((prev) => prev.map((page) => (page.id === id ? response.data : page)));
  };

  const deletePage = async (id: string): Promise<void> => {
    await api.admin.delete('pages', id);
    setPages((prev) => prev.filter((page) => page.id !== id));
    await refreshDashboardStats();
  };

  // Banners
  const addBanner = async (b: BannerSlide | Omit<BannerSlide, 'id'>): Promise<void> => {
    const newB: BannerSlide =
      'id' in b
        ? b
        : {
            ...b,
            id: `banner_${Date.now()}`
          };
    const response = await api.admin.create<BannerSlide>('banners', newB);
    setBanners((prev) => [...prev, response.data]);
    await refreshDashboardStats();
  };

  const updateBanner = async (arg1: BannerSlide | string, partial?: Partial<BannerSlide>): Promise<void> => {
    const id = typeof arg1 === 'string' ? arg1 : arg1.id;
    const patch = typeof arg1 === 'string' ? partial || {} : arg1;
    const response = await api.admin.update<BannerSlide>('banners', id, patch);
    setBanners((prev) => prev.map((banner) => (banner.id === id ? response.data : banner)));
    await refreshDashboardStats();
  };

  const deleteBanner = async (id: string): Promise<void> => {
    await api.admin.delete('banners', id);
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
    await refreshDashboardStats();
  };

  // Programs
  const addProgram = async (item: Partial<ProgramPillar>): Promise<ProgramPillar> => {
    const newP: ProgramPillar = {
      id: `pillar_${Date.now()}`,
      slug: item.slug || 'new-pillar',
      titleEn: item.titleEn || 'New Pillar',
      titleFr: item.titleFr || 'Nouveau Pilier',
      shortDescEn: item.shortDescEn || '',
      shortDescFr: item.shortDescFr || '',
      fullDescEn: item.fullDescEn || '',
      fullDescFr: item.fullDescFr || '',
      image: item.image || '/assets/aistudio/4_289670c0.PNG',
      icon: item.icon || 'leaf',
      order: programs.length + 1,
      status: item.status || 'published',
      metrics: item.metrics || [{ value: '100+', labelEn: 'beneficiaries', labelFr: 'bénéficiaires' }],
      objectivesEn: item.objectivesEn || ['Empower communities'],
      objectivesFr: item.objectivesFr || ['Renforcer les communautés'],
      ...item
    };
    const response = await api.admin.create<ProgramPillar>('programs', newP);
    setPrograms((prev) => [...prev, response.data]);
    await refreshDashboardStats();
    return response.data;
  };

  const updateProgram = async (arg1: ProgramPillar | string, partial?: Partial<ProgramPillar>): Promise<void> => {
    const id = typeof arg1 === 'string' ? arg1 : arg1.id;
    const patch = typeof arg1 === 'string' ? partial || {} : arg1;
    const response = await api.admin.update<ProgramPillar>('programs', id, patch);
    setPrograms((prev) => prev.map((program) => (program.id === id ? response.data : program)));
    await refreshDashboardStats();
  };

  const deleteProgram = async (id: string): Promise<void> => {
    await api.admin.delete('programs', id);
    setPrograms((prev) => prev.filter((program) => program.id !== id));
    await refreshDashboardStats();
  };

  // Team
  const addTeamMember = async (m: TeamMember | Omit<TeamMember, 'id'>): Promise<void> => {
    const newM: TeamMember =
      'id' in m
        ? m
        : {
            ...m,
            id: `tm_${Date.now()}`
          };
    const response = await api.admin.create<TeamMember>('team', newM);
    setTeamMembers((prev) => [...prev, response.data]);
    await refreshDashboardStats();
  };

  const updateTeamMember = async (arg1: TeamMember | string, partial?: Partial<TeamMember>): Promise<void> => {
    const id = typeof arg1 === 'string' ? arg1 : arg1.id;
    const patch = typeof arg1 === 'string' ? partial || {} : arg1;
    const response = await api.admin.update<TeamMember>('team', id, patch);
    setTeamMembers((prev) => prev.map((member) => (member.id === id ? response.data : member)));
    await refreshDashboardStats();
  };

  const deleteTeamMember = async (id: string): Promise<void> => {
    await api.admin.delete('team', id);
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
    await refreshDashboardStats();
  };

  // Founders
  const addFounder = async (item: Partial<Founder>): Promise<Founder> => {
    const newF: Founder = {
      id: `founder_${Date.now()}`,
      fullName: item.fullName || 'Co-Founder',
      roleEn: item.roleEn || 'Co-Founder',
      roleFr: item.roleFr || 'Co-Fondateur',
      bioEn: item.bioEn || '',
      bioFr: item.bioFr || '',
      photoUrl: item.photoUrl || '/assets/brand/acv-logo.jpeg',
      yearsActive: item.yearsActive || '2023 - Présent',
      order: founders.length + 1,
      status: 'visible',
      ...item
    };
    const response = await api.admin.create<Founder>('founders', newF);
    setFounders((prev) => [...prev, response.data]);
    await refreshDashboardStats();
    return response.data;
  };

  const updateFounder = async (id: string, partial: Partial<Founder>): Promise<void> => {
    const response = await api.admin.update<Founder>('founders', id, partial);
    setFounders((prev) => prev.map((founder) => (founder.id === id ? response.data : founder)));
  };

  const deleteFounder = async (id: string): Promise<void> => {
    await api.admin.delete('founders', id);
    setFounders((prev) => prev.filter((founder) => founder.id !== id));
    await refreshDashboardStats();
  };

  // Field Staff
  const addFieldStaff = async (item: Partial<FieldAgent>): Promise<FieldAgent> => {
    const newA: FieldAgent = {
      id: `agent_${Date.now()}`,
      name: item.name || 'Field Agent',
      positionEn: item.positionEn || 'Field Monitor',
      positionFr: item.positionFr || 'Agent Terrain',
      zone: item.zone || 'Goma',
      programId: item.programId || 'nature-biodiversity',
      photoUrl: item.photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      entryDate: item.entryDate || new Date().toISOString().split('T')[0],
      status: 'active',
      ...item
    };
    const response = await api.admin.create<FieldAgent>('fieldStaff', newA);
    setFieldStaff((prev) => [...prev, response.data]);
    await refreshDashboardStats();
    return response.data;
  };

  const updateFieldStaff = async (id: string, partial: Partial<FieldAgent>): Promise<void> => {
    const response = await api.admin.update<FieldAgent>('fieldStaff', id, partial);
    setFieldStaff((prev) => prev.map((member) => (member.id === id ? response.data : member)));
  };

  const deleteFieldStaff = async (id: string): Promise<void> => {
    await api.admin.delete('fieldStaff', id);
    setFieldStaff((prev) => prev.filter((member) => member.id !== id));
    await refreshDashboardStats();
  };

  // Governance
  const addGovernance = async (item: Partial<GovernanceMember>): Promise<GovernanceMember> => {
    const newG: GovernanceMember = {
      id: `gov_${Date.now()}`,
      name: item.name || 'Council Member',
      roleEn: item.roleEn || 'Board Member',
      roleFr: item.roleFr || 'Membre du Conseil',
      mandateYears: item.mandateYears || '2024 - 2027',
      bioEn: item.bioEn || '',
      bioFr: item.bioFr || '',
      photoUrl: item.photoUrl || '/assets/aistudio/10_702700e4.PNG',
      order: governance.length + 1,
      status: 'active',
      ...item
    };
    const response = await api.admin.create<GovernanceMember>('governance', newG);
    setGovernance((prev) => [...prev, response.data]);
    return response.data;
  };

  const updateGovernance = async (id: string, partial: Partial<GovernanceMember>): Promise<void> => {
    const response = await api.admin.update<GovernanceMember>('governance', id, partial);
    setGovernance((prev) => prev.map((member) => (member.id === id ? response.data : member)));
  };

  const deleteGovernance = async (id: string): Promise<void> => {
    await api.admin.delete('governance', id);
    setGovernance((prev) => prev.filter((member) => member.id !== id));
  };

  // Policies
  const updatePolicy = async (arg1: PolicyDocument | string, partial?: Partial<PolicyDocument>): Promise<void> => {
    const id = typeof arg1 === 'string' ? arg1 : arg1.id;
    const patch = typeof arg1 === 'string' ? partial || {} : arg1;
    const response = await api.admin.update<PolicyDocument>('policies', id, patch);
    setPolicies((prev) => prev.map((policy) => (policy.id === id ? response.data : policy)));
  };

  // Articles / Blog
  const addBlogPost = async (b: Article | Omit<Article, 'id'>): Promise<void> => {
    const newB: Article =
      'id' in b
        ? b
        : {
            ...b,
            id: `art_${Date.now()}`
          };
    const response = await api.admin.create<Article>('articles', newB);
    setArticles((prev) => [response.data, ...prev]);
    await refreshDashboardStats();
  };

  const updateBlogPost = async (arg1: Article | string, partial?: Partial<Article>): Promise<void> => {
    const id = typeof arg1 === 'string' ? arg1 : arg1.id;
    const patch = typeof arg1 === 'string' ? partial || {} : arg1;
    const response = await api.admin.update<Article>('articles', id, patch);
    setArticles((prev) => prev.map((article) => (article.id === id ? response.data : article)));
    await refreshDashboardStats();
  };

  const deleteBlogPost = async (id: string): Promise<void> => {
    await api.admin.delete('articles', id);
    setArticles((prev) => prev.filter((article) => article.id !== id));
    await refreshDashboardStats();
  };

  // Field Notes
  const addFieldNote = async (n: FieldNote | Omit<FieldNote, 'id'>): Promise<void> => {
    const newN: FieldNote = 'id' in n ? n : { ...n, id: `fn_${Date.now()}` };
    const response = await api.admin.create<FieldNote>('fieldNotes', newN);
    setFieldNotes((prev) => [response.data, ...prev]);
  };

  const deleteFieldNote = async (id: string): Promise<void> => {
    await api.admin.delete('fieldNotes', id);
    setFieldNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Media
  const deleteMedia = async (id: string): Promise<void> => {
    await api.admin.delete('media', id);
    setMedia((prev) => prev.filter((item) => item.id !== id));
    await refreshDashboardStats();
  };

  // Partners
  const addPartner = async (item: Partial<Partner>): Promise<Partner> => {
    const newP: Partner = {
      id: `part_${Date.now()}`,
      name: item.name || 'Partner Org',
      logoUrl: item.logoUrl || '/assets/aistudio/8_a0add9a7.PNG',
      type: item.type || 'Technique',
      order: partners.length + 1,
      status: 'active',
      ...item
    };
    const response = await api.admin.create<Partner>('partners', newP);
    setPartners((prev) => [...prev, response.data]);
    await refreshDashboardStats();
    return response.data;
  };

  const updatePartner = async (id: string, partial: Partial<Partner>): Promise<void> => {
    const response = await api.admin.update<Partner>('partners', id, partial);
    setPartners((prev) => prev.map((partner) => (partner.id === id ? response.data : partner)));
  };

  const deletePartner = async (id: string): Promise<void> => {
    await api.admin.delete('partners', id);
    setPartners((prev) => prev.filter((partner) => partner.id !== id));
    await refreshDashboardStats();
  };

  // Donors
  const addDonation = async (d: Donor | Omit<Donor, 'id'>): Promise<void> => {
    const newD: Donor =
      'id' in d
        ? d
        : {
            ...d,
            id: `DON-${Date.now().toString().slice(-6)}`,
            donationDate: new Date().toISOString().split('T')[0],
            amount: Number(d.amount) || 50,
            currency: d.currency || 'USD'
          };
    const response = await api.public.submitDonation(newD);
    setDonors((prev) => [response.data, ...prev]);
    await refreshDashboardStats();
  };

  // Testimonials
  const addTestimonial = async (item: Partial<Testimonial>): Promise<Testimonial> => {
    const newT: Testimonial = {
      id: `test_${Date.now()}`,
      quoteEn: item.quoteEn || 'Empowerment on the ground.',
      quoteFr: item.quoteFr || 'Action concrète sur le terrain.',
      author: item.author || 'Community Member',
      roleEn: item.roleEn || 'Local resident',
      roleFr: item.roleFr || 'Habitant local',
      status: 'visible',
      order: testimonials.length + 1,
      ...item
    };
    const response = await api.admin.create<Testimonial>('testimonials', newT);
    setTestimonials((prev) => [...prev, response.data]);
    return response.data;
  };

  const updateTestimonial = async (id: string, partial: Partial<Testimonial>): Promise<void> => {
    const response = await api.admin.update<Testimonial>('testimonials', id, partial);
    setTestimonials((prev) => prev.map((testimonial) => (testimonial.id === id ? response.data : testimonial)));
  };

  const deleteTestimonial = async (id: string): Promise<void> => {
    await api.admin.delete('testimonials', id);
    setTestimonials((prev) => prev.filter((testimonial) => testimonial.id !== id));
  };

  // Stats / KPIs
  const addStat = async (item: Partial<ImpactStat>): Promise<ImpactStat> => {
    const newS: ImpactStat = {
      id: `stat_${Date.now()}`,
      labelEn: item.labelEn || 'Impact Metric',
      labelFr: item.labelFr || 'Indicateur d’Impact',
      value: item.value || '100+',
      iconName: item.iconName || 'sparkles',
      displayPage: item.displayPage || 'home',
      order: stats.length + 1,
      status: 'active',
      ...item
    };
    const response = await api.admin.create<ImpactStat>('stats', newS);
    setStats((prev) => [...prev, response.data]);
    return response.data;
  };

  const updateStat = async (id: string, partial: Partial<ImpactStat>): Promise<void> => {
    const response = await api.admin.update<ImpactStat>('stats', id, partial);
    setStats((prev) => prev.map((stat) => (stat.id === id ? response.data : stat)));
  };

  const deleteStat = async (id: string): Promise<void> => {
    await api.admin.delete('stats', id);
    setStats((prev) => prev.filter((stat) => stat.id !== id));
  };

  // Site Settings
  const updateSiteSettings = async (partial: Partial<SiteSettings>): Promise<void> => {
    const response = await api.admin.update<SiteSettings>('siteSettings', siteSettings.id || 'settings_main', partial);
    setSiteSettings((prev) => ({ ...prev, ...response.data }));
  };

  // Contact Submissions
  const addContactSubmission = async (sub: ContactSubmission | Omit<ContactSubmission, 'id'>): Promise<void> => {
    const newSub: ContactSubmission =
      'id' in sub
        ? sub
        : {
            ...sub,
            id: `sub_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            read: false,
            status: 'new'
          };
    const response = await api.public.submitContact(newSub);
    setContactSubmissions((prev) => [response.data, ...prev]);
    await refreshDashboardStats();
  };

  const markContactRead = async (id: string): Promise<void> => {
    const response = await api.admin.update<ContactSubmission>('contactSubmissions', id, { read: true, status: 'reviewed' });
    setContactSubmissions((prev) => prev.map((submission) => (submission.id === id ? response.data : submission)));
    await refreshDashboardStats();
  };

  const updateContactStatus = async (id: string, status: ContactSubmission['status']): Promise<void> => {
    const response = await api.admin.update<ContactSubmission>('contactSubmissions', id, { status, read: true });
    setContactSubmissions((prev) => prev.map((submission) => (submission.id === id ? response.data : submission)));
    await refreshDashboardStats();
  };

  // Admin Users
  const addAdminUser = async (item: Partial<AdminUser>): Promise<AdminUser> => {
    const newU: AdminUser = {
      id: `user_${Date.now()}`,
      name: item.name || 'New Admin',
      email: item.email || 'admin@acv-drc.org',
      role: item.role || 'editor',
      status: 'active',
      ...item
    };
    const response = await api.admin.create<AdminUser>('users', newU);
    setAdminUsers((prev) => [...prev, response.data]);
    return response.data;
  };

  const updateAdminUser = async (id: string, partial: Partial<AdminUser>): Promise<void> => {
    const response = await api.admin.update<AdminUser>('users', id, partial);
    setAdminUsers((prev) => prev.map((user) => (user.id === id ? response.data : user)));
  };

  const deleteAdminUser = async (id: string): Promise<void> => {
    await api.admin.delete('users', id);
    setAdminUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const resetToDefaults = async () => {
    setBanners(fallbackBanners);
    setPrograms([]);
    setTeamMembers([]);
    setArticles([]);
    setFieldNotes([]);
    setSiteSettings(fallbackSiteSettings);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentRoute,
        navigateTo,

        isAdminModalOpen,
        setAdminModalOpen,
        isAdminAuthenticated: !!adminUser,
        adminUser,
        currentUser: adminUser,
        loginAdmin,
        logoutAdmin,
        login,
        logout: logoutAdmin,

        uploadMedia,
        dashboardStats,
        refreshDashboardStats,

        pages,
        addPage,
        updatePage,
        deletePage,

        banners,
        addBanner,
        updateBanner,
        deleteBanner,

        programs,
        addProgram,
        updateProgram,
        deleteProgram,

        teamMembers,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,

        founders,
        addFounder,
        updateFounder,
        deleteFounder,

        fieldStaff,
        addFieldStaff,
        updateFieldStaff,
        deleteFieldStaff,

        governance,
        addGovernance,
        updateGovernance,
        deleteGovernance,

        policies,
        updatePolicy,

        blogPosts: articles,
        articles,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,

        fieldNotes,
        addFieldNote,
        deleteFieldNote,

        media,
        deleteMedia,

        partners,
        addPartner,
        updatePartner,
        deletePartner,

        donors,
        donations: donors,
        addDonation,

        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        stats,
        addStat,
        updateStat,
        deleteStat,

        siteSettings,
        updateSiteSettings,

        auditLogs,

        contactSubmissions,
        addContactSubmission,
        markContactRead,
        updateContactStatus,

        adminUsers,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,

        resetToDefaults,
        isLoading,
        dataState,
        retryData,
        actionLoading,
        triggerActionLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
