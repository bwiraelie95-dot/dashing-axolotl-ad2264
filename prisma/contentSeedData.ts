import type { PolicyDocument, FieldNote } from '../src/types';

export const initialPolicyDocuments: PolicyDocument[] = [
  {
    id: 'pol-1',
    titleEn: 'Safeguarding Policy',
    titleFr: 'Politique de Sauvegarde & Protection',
    descEn: 'Sets out how ACV prevents, identifies and responds to any risk of harm to the children, youth and community members it works with.',
    descFr: 'Définit nos protocoles stricts de protection des enfants et des bénéficiaires vulnérables contre tout abus ou préjudice.',
    icon: 'shield_person',
    updatedDate: 'January 2026',
    contentEn: 'Africa Community Village operates a zero-tolerance policy towards harassment, exploitation, and abuse. All personnel and volunteers undergo mandatory background checks and safeguarding training prior to field deployment.',
    contentFr: 'ACV applique une politique de tolérance zéro envers toute forme d\'exploitation ou d\'abus. Tous les membres du personnel sont soumis à une formation obligatoire.'
  },
  {
    id: 'pol-2',
    titleEn: 'Code of Conduct',
    titleFr: 'Code de Conduite Institutionnel',
    descEn: 'Defines the standards of behaviour expected of every staff member, volunteer and partner representing ACV in the field.',
    descFr: 'Fixe les règles éthiques et professionnelles applicables à tout agent, volontaire ou représentant d\'ACV.',
    icon: 'gavel',
    updatedDate: 'December 2025',
    contentEn: 'Sets the foundational expectations of integrity, political neutrality, respect for local customs, and protection of community assets in all interventions.',
    contentFr: 'Définit les impératifs d\'intégrité, de neutralité politique, de respect des autorités locales et de gestion transparente des biens communs.'
  },
  {
    id: 'pol-3',
    titleEn: 'Strategic Plan 2026–2030',
    titleFr: 'Plan Stratégique Quinquennal 2026–2030',
    descEn: 'Lays out ACV\'s five-year direction across the five program pillars, with targets, milestones and resourcing assumptions.',
    descFr: 'Cadre stratégique sur cinq ans fixant nos objectifs quantitatifs, nos jalons de reboisement et nos partenariats clés.',
    icon: 'explore',
    updatedDate: 'February 2026',
    contentEn: 'Roadmap outlining our expansion to 10 additional communities in South Kivu, targeted planting of 500,000 indigenous trees, and scaling of youth-led VSLAs.',
    contentFr: 'Feuille de route détaillant l\'expansion vers 10 nouvelles localités, la plantation de 500 000 arbres indigènes et la pérennisation des AVEC.'
  },
  {
    id: 'pol-4',
    titleEn: 'Monitoring & Evaluation Framework',
    titleFr: 'Cadre de Suivi & Évaluation (S&E)',
    descEn: 'The indicators, data-collection methods and review cycles ACV uses to track whether programs are achieving their intended outcomes.',
    descFr: 'Indicateurs de performance, méthodes de collecte numérique et cycles d\'audits participatifs vérifiant l\'impact réel.',
    icon: 'track_changes',
    updatedDate: 'November 2025',
    contentEn: 'Defines our peer-auditing mechanism where community assemblies independently verify project milestones before subsequent funding is released.',
    contentFr: 'Mécanisme d\'évaluation participative où les assemblées villageoises valident les livrables avant tout déblocage de tranche.'
  },
  {
    id: 'pol-5',
    titleEn: 'Risk Register & Security Protocols',
    titleFr: 'Registre des Risques & Protocoles Sécuritaires',
    descEn: 'A living document tracking operational, security, financial and reputational risks across program areas, with mitigation owners assigned.',
    descFr: 'Outil opérationnel dynamique recensant les risques sécuritaires et climatiques et fixant les mesures d\'atténuation immédiates.',
    icon: 'visibility',
    updatedDate: 'Monthly revision',
    contentEn: 'Detailed contingency plans for rapid displacement events around Sake and Rutshuru, ensuring continuous education and water pod operations.',
    contentFr: 'Plans de contingence permettant la continuité des cours et de l\'eau potable même en situation d\'insécurité soudaine.'
  }
];

export const initialFieldNotes: FieldNote[] = [
  {
    id: 'fn-1',
    titleEn: 'Youth Leadership Academy',
    titleFr: 'Académie de Leadership Jeunesse',
    location: 'Himbi, Goma',
    date: 'February 2026',
    captionEn: 'A weekend cohort of young facilitators in training, co-designing neighborhood peace circles.',
    captionFr: 'Une cohorte de jeunes facilitateurs en formation, concevant des cercles de paix de quartier.',
    pillar: 'Education',
    icon: 'school',
    color: '#D97706'
  },
  {
    id: 'fn-2',
    titleEn: 'Miti Alliance School Programme',
    titleFr: 'Programme Scolaire Miti Alliance',
    location: 'Katindo, Goma',
    date: 'February 2026',
    captionEn: 'Pupils planting tree seedlings on their own school grounds to create green shade and windbreaks.',
    captionFr: 'Des écoliers repiquant de jeunes arbres dans leur cour pour créer ombre et brise-vent naturels.',
    pillar: 'Nature',
    icon: 'forest',
    color: '#14798B'
  },
  {
    id: 'fn-3',
    titleEn: 'Regenerative Agriculture Plot',
    titleFr: 'Parcelle Agro-Écologique Témoin',
    location: 'Kavumu, South Kivu',
    date: 'January 2026',
    captionEn: 'Mid-season demonstration plot shared between three farmer households practicing zero synthetic fertilizer.',
    captionFr: 'Parcelle de démonstration partagée entre trois familles pratiquant une fertilisation 100% organique.',
    pillar: 'Agriculture',
    icon: 'potted_plant',
    color: '#14798B'
  },
  {
    id: 'fn-4',
    titleEn: 'Community Health Household Visits',
    titleFr: 'Visites de Santé à Domicile',
    location: 'Beni, Mulekera',
    date: 'January 2026',
    captionEn: 'Community health volunteers preparing weekly household visit routes and oral rehydration supplies.',
    captionFr: 'Volontaires de santé préparant leurs tournées hebdomadaires et leurs stocks de réhydratation.',
    pillar: 'Health',
    icon: 'medical_services',
    color: '#991B1B'
  },
  {
    id: 'fn-5',
    titleEn: 'Savings & Livelihoods Cooperative',
    titleFr: 'Coopérative d\'Épargne & Métiers',
    location: 'Himbi, Goma',
    date: 'December 2025',
    captionEn: 'A savings & livelihoods cooperative weekly assembly reviewing loan requests for tailoring machines.',
    captionFr: 'Assemblée hebdomadaire d\'une AVEC validant l\'octroi d\'un micro-prêt pour machine à coudre.',
    pillar: 'Livelihoods',
    icon: 'handshake',
    color: '#2563EB'
  },
  {
    id: 'fn-6',
    titleEn: 'Forest-Edge Citizen Patrol',
    titleFr: 'Patrouille Citoyenne Lisière Virunga',
    location: 'Rutshuru Territory',
    date: 'November 2025',
    captionEn: 'A community patrol mapping forest-edge encroachment and native acacia growth near Virunga National Park.',
    captionFr: 'Jeunes patrouilleurs cartographiant les repousses d\'acacias indigènes en lisière des Virunga.',
    pillar: 'Nature',
    icon: 'park',
    color: '#16A34A'
  },
  {
    id: 'fn-7',
    titleEn: 'Youth Civic-Leadership Circle',
    titleFr: 'Cercle de Dialogue Citoyen',
    location: 'Goma Centre',
    date: 'October 2025',
    captionEn: 'A youth civic-leadership circle mapping local decision-makers and entry points for community action.',
    captionFr: 'Cartographie citoyenne des acteurs d\'influence locaux pour débloquer des initiatives communautaires.',
    pillar: 'Education',
    icon: 'groups',
    color: '#F59E0B'
  },
  {
    id: 'fn-8',
    titleEn: 'Water Quality Testing',
    titleFr: 'Contrôle Sanitaire de l\'Eau',
    location: 'Beni Rural',
    date: 'October 2025',
    captionEn: 'Testing water quality at a rural spring collection point ahead of the seasonal rainy period.',
    captionFr: 'Test bactériologique rapide de la source avant l\'arrivée de la saison des grandes pluies.',
    pillar: 'Health',
    icon: 'water_drop',
    color: '#0891B2'
  },
  {
    id: 'fn-9',
    titleEn: 'Safeguarding Refresher Session',
    titleFr: 'Session de Rappel en Sauvegarde',
    location: 'Goma Headquarters',
    date: 'September 2025',
    captionEn: 'A safeguarding refresher session for field staff, youth facilitators and community volunteers.',
    captionFr: 'Atelier de rappel des protocoles de protection et de respect de l\'intégrité des bénéficiaires.',
    pillar: 'Governance',
    icon: 'verified_user',
    color: '#EA580C'
  }
];
