import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed BeninExplore...\n');

  // ══════════════════════════════════════════════════════════════════════
  // 1. RÉGIONS
  // ══════════════════════════════════════════════════════════════════════
  const regionData = [
    { nomFr: 'Littoral',   nomEn: 'Littoral',   slug: 'littoral',   latitude: 6.3654,  longitude: 2.4183,  description: 'Région côtière avec Cotonou' },
    { nomFr: 'Atlantique', nomEn: 'Atlantic',   slug: 'atlantique', latitude: 6.3500,  longitude: 2.0833,  description: 'Région incluant Ouidah et Ganvié' },
    { nomFr: 'Zou',        nomEn: 'Zou',        slug: 'zou',        latitude: 7.2000,  longitude: 2.1000,  description: "Région historique d'Abomey" },
    { nomFr: 'Atacora',    nomEn: 'Atacora',    slug: 'atacora',    latitude: 10.3167, longitude: 1.3833,  description: 'Région montagneuse au nord' },
    { nomFr: 'Borgou',     nomEn: 'Borgou',     slug: 'borgou',     latitude: 9.3567,  longitude: 2.6234,  description: 'Région nord avec Parakou' },
    { nomFr: 'Ouémé',      nomEn: 'Ouémé',      slug: 'oueme',      latitude: 6.5000,  longitude: 2.6167,  description: 'Région de Porto-Novo, capitale' },
    { nomFr: 'Mono',       nomEn: 'Mono',       slug: 'mono',       latitude: 6.4833,  longitude: 1.7667,  description: 'Région côtière avec Grand-Popo et le lac Ahémé' },
  ];

  const regions = await Promise.all(
    regionData.map(r => prisma.region.upsert({ where: { slug: r.slug }, update: {}, create: r }))
  );
  const regionMap = Object.fromEntries(regions.map(r => [r.slug, r]));
  console.log(`✅ ${regions.length} régions`);

  // ══════════════════════════════════════════════════════════════════════
  // 2. CATÉGORIES
  // ══════════════════════════════════════════════════════════════════════
  const categoryData = [
    { nomFr: 'Sites historiques', nomEn: 'Historical Sites', nomEs: 'Sitios históricos', nomDe: 'Historische Stätten', slug: 'historique',   icone: 'landmark', couleur: '#C4622D', type: 'HISTORIQUE'   },
    { nomFr: 'Nature & Faune',    nomEn: 'Nature & Wildlife', nomEs: 'Naturaleza y Fauna', nomDe: 'Natur & Tierwelt', slug: 'naturel',      icone: 'trees',    couleur: '#1E5738', type: 'NATUREL'      },
    { nomFr: 'Culture & Arts',    nomEn: 'Culture & Arts',   nomEs: 'Cultura y Arte',     nomDe: 'Kultur & Kunst',   slug: 'culturel',     icone: 'palette',  couleur: '#7C3AED', type: 'CULTUREL'     },
    { nomFr: 'Plages & Côtes',    nomEn: 'Beaches & Coasts', nomEs: 'Playas y Costas',    nomDe: 'Strände & Küsten', slug: 'plage',        icone: 'waves',    couleur: '#0D3B5C', type: 'PLAGE'        },
    { nomFr: 'Sites religieux',   nomEn: 'Religious Sites',  nomEs: 'Sitios religiosos',  nomDe: 'Religiöse Stätten',slug: 'religieux',    icone: 'star',     couleur: '#E8982A', type: 'RELIGIEUX'    },
    { nomFr: 'Gastronomie',       nomEn: 'Gastronomy',       nomEs: 'Gastronomía',        nomDe: 'Gastronomie',      slug: 'gastronomique',icone: 'utensils', couleur: '#DC2626', type: 'GASTRONOMIQUE'},
  ];

  const categories = await Promise.all(
    categoryData.map(c => prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c }))
  );
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c]));
  console.log(`✅ ${categories.length} catégories`);

  // ══════════════════════════════════════════════════════════════════════
  // 3. SITES TOURISTIQUES
  // ══════════════════════════════════════════════════════════════════════
  const sitesData = [
    {
      slug: 'ganvie-cite-lacustre',
      nomFr: "Ganvié — La Venise d'Afrique", nomEn: 'Ganvié — Venice of Africa',
      nomEs: 'Ganvié — Venecia de África',   nomDe: 'Ganvié — Venedig Afrikas',
      descriptionFr: "Village lacustre unique au monde, construit entièrement sur pilotis au milieu du lac Nokoué. Fondé au XVIIe siècle par le peuple Tofinu pour échapper aux razzias des guerriers Fon, il abrite plus de 20 000 habitants vivant de la pêche.",
      descriptionEn: "A unique stilt village built over Lake Nokoué, founded in the 17th century by the Tofinu people. Over 20,000 inhabitants live here, sustained by fishing.",
      descriptionEs: "Aldea de pilotes única en el mundo, construida sobre el lago Nokoué.",
      descriptionDe: "Einzigartiges Pfahldorf auf dem Nokoué-See, gegründet im 17. Jahrhundert.",
      histoireFr: "Les ancêtres de Ganvié fuyaient les esclavagistes du Royaume de Danhomè. La tradition interdisant aux guerriers Fon de combattre sur l'eau, ils s'y installèrent définitivement.",
      adresse: 'Lac Nokoué, commune de So-Ava, Bénin',
      latitude: 6.4667, longitude: 2.4167,
      gratuit: false, enfants: true, avecGuide: true,
      tarifs: { pirogueAller: 3000, pirogue: 5000, devise: 'XOF' },
      horaires: { ouverture: '7h00', fermeture: '18h00' },
      imagesCouverture: ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ganvie_stilt_village%2C_Benin.jpg/1280px-Ganvie_stilt_village%2C_Benin.jpg'],
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ganvie_stilt_village%2C_Benin.jpg/1280px-Ganvie_stilt_village%2C_Benin.jpg'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      estVedette: true, popularite: 95,
      regionId: regionMap['atlantique'].id, categoryId: catMap['culturel'].id
    },
    {
      slug: 'palais-royaux-abomey',
      nomFr: "Palais Royaux d'Abomey", nomEn: 'Royal Palaces of Abomey',
      nomEs: 'Palacios Reales de Abomey', nomDe: 'Königspaläste von Abomey',
      descriptionFr: "Inscrit au Patrimoine Mondial de l'UNESCO, l'ensemble des Palais Royaux d'Abomey témoigne de la grandeur du Royaume du Danhomé (1600-1900). Douze rois se sont succédé, construisant chacun un palais.",
      descriptionEn: 'UNESCO World Heritage Site. The Royal Palaces of Abomey bear witness to the grandeur of the Kingdom of Dahomey (1600-1900).',
      descriptionEs: 'Patrimonio Mundial de la UNESCO, testigo de la grandeza del Reino de Dahomey.',
      descriptionDe: 'UNESCO-Welterbe, das Zeugnis von der Größe des Königreichs Dahomey ablegt.',
      histoireFr: "Fondé par Houégbadja au début du XVIIe siècle, le Royaume de Danhomè devint l'une des puissances les plus redoutées d'Afrique de l'Ouest.",
      adresse: 'Abomey, département du Zou, Bénin',
      latitude: 7.1833, longitude: 1.9833,
      gratuit: false, enfants: true, avecGuide: true,
      tarifs: { adulte: 2000, enfant: 1000, devise: 'XOF' },
      horaires: { lundi: 'Fermé', autres: '9h00-18h00' },
      imagesCouverture: ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Abomey_bas-relief.jpg/1280px-Abomey_bas-relief.jpg'],
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Abomey_bas-relief.jpg/1280px-Abomey_bas-relief.jpg'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      estVedette: true, popularite: 90,
      regionId: regionMap['zou'].id, categoryId: catMap['historique'].id
    },
    {
      slug: 'ouidah-route-esclaves',
      nomFr: 'Ouidah — Route des Esclaves', nomEn: 'Ouidah — Slave Route',
      nomEs: 'Ouidah — Ruta de los Esclavos', nomDe: 'Ouidah — Sklavenroute',
      descriptionFr: "Ouidah fut le principal port de traite négrière du Golfe de Guinée. La Route des Esclaves de 4 km relie l'ancienne maison des esclaves à la « Porte du Non-Retour » sur la plage.",
      descriptionEn: "Ouidah was the main slave trade port in the Gulf of Guinea. The 4 km Slave Route links the old slave house to the 'Door of No Return' on the beach.",
      descriptionEs: 'Ouidah fue el principal puerto del comercio de esclavos en el Golfo de Guinea.',
      descriptionDe: 'Ouidah war der wichtigste Sklavenhandelshafen im Golf von Guinea.',
      adresse: 'Ouidah, Atlantique, Bénin',
      latitude: 6.3631, longitude: 2.0889,
      gratuit: false, enfants: false, avecGuide: true,
      tarifs: { adulte: 1500, enfant: 750, devise: 'XOF' },
      horaires: { ouverture: '8h00', fermeture: '18h00' },
      imagesCouverture: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Porte_du_non_retour_-_Ouidah.jpg/1280px-Porte_du_non_retour_-_Ouidah.jpg'],
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Porte_du_non_retour_-_Ouidah.jpg/1280px-Porte_du_non_retour_-_Ouidah.jpg'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      estVedette: true, popularite: 88,
      regionId: regionMap['atlantique'].id, categoryId: catMap['historique'].id
    },
    {
      slug: 'parc-pendjari',
      nomFr: 'Parc National de la Pendjari', nomEn: 'Pendjari National Park',
      nomEs: 'Parque Nacional Pendjari', nomDe: 'Nationalpark Pendjari',
      descriptionFr: "L'un des derniers refuges de la faune sauvage en Afrique de l'Ouest. Avec ses 4 800 km², la Pendjari abrite lions, éléphants, hippopotames, buffles et guépards.",
      descriptionEn: "One of the last refuges for wildlife in West Africa. Covering 4,800 km², Pendjari is home to lions, elephants, hippos, buffaloes and cheetahs.",
      descriptionEs: 'Uno de los últimos refugios de vida salvaje en África Occidental.',
      descriptionDe: 'Eines der letzten Wildtierreservate in Westafrika.',
      adresse: 'Tanguiéta, Atacora, Bénin',
      latitude: 11.0000, longitude: 1.5000,
      gratuit: false, enfants: true, avecGuide: true,
      tarifs: { entree: 5000, vehicule: 3000, devise: 'XOF' },
      horaires: { saison: 'Décembre à Juin', ouverture: '6h00', fermeture: '18h00' },
      imagesCouverture: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/African_Elephant_at_Pendjari.jpg/1280px-African_Elephant_at_Pendjari.jpg'],
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/African_Elephant_at_Pendjari.jpg/1280px-African_Elephant_at_Pendjari.jpg'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      estVedette: true, popularite: 85,
      regionId: regionMap['atacora'].id, categoryId: catMap['naturel'].id
    },
    {
      slug: 'marche-dantokpa',
      nomFr: 'Marché Dantokpa', nomEn: 'Dantokpa Market',
      nomEs: 'Mercado Dantokpa', nomDe: 'Dantokpa-Markt',
      descriptionFr: "Le plus grand marché en plein air d'Afrique de l'Ouest. Dantokpa est un labyrinthe de plus de 10 000 étals où se côtoient tissus, épices, artisanat et fétiches vodoun.",
      descriptionEn: "The largest open-air market in West Africa — a fascinating labyrinth of over 10,000 stalls.",
      descriptionEs: 'El mayor mercado al aire libre de África Occidental.',
      descriptionDe: 'Der größte Freiluftmarkt Westafrikas mit über 10.000 Ständen.',
      adresse: 'Quartier Dantokpa, Cotonou, Bénin',
      latitude: 6.3583, longitude: 2.4389,
      gratuit: true, enfants: true, avecGuide: false,
      horaires: { lundi_samedi: '6h00-19h00', dimanche: '8h00-17h00' },
      imagesCouverture: ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Marche_Dantokpa_Cotonou.jpg/1280px-Marche_Dantokpa_Cotonou.jpg'],
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Marche_Dantokpa_Cotonou.jpg/1280px-Marche_Dantokpa_Cotonou.jpg'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      popularite: 80,
      regionId: regionMap['littoral'].id, categoryId: catMap['culturel'].id
    },
    {
      slug: 'plages-grand-popo',
      nomFr: 'Les Plages de Grand-Popo', nomEn: 'Grand-Popo Beaches',
      nomEs: 'Las Playas de Grand-Popo',  nomDe: 'Die Strände von Grand-Popo',
      descriptionFr: "Grand-Popo est l'une des plus belles stations balnéaires du Bénin, avec ses longues plages de sable doré bordées de cocotiers et ses couchers de soleil somptueux.",
      descriptionEn: "Grand-Popo is one of Benin's most beautiful beach resorts, with long golden sandy beaches and magnificent sunsets.",
      descriptionEs: 'Grand-Popo es uno de los balnearios más hermosos de Benín.',
      descriptionDe: 'Grand-Popo ist einer der schönsten Badeorte Benins.',
      adresse: 'Grand-Popo, Mono, Bénin',
      latitude: 6.2833, longitude: 1.8167,
      gratuit: true, enfants: true, avecGuide: false,
      horaires: { ouverture: '6h00', fermeture: '20h00' },
      imagesCouverture: ['https://images.partir.com/g0Hk8nXsvpa9v0dzyFYy4p8ucOs=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-plages-gran-popo.jpg'],
      images: ['https://images.partir.com/g0Hk8nXsvpa9v0dzyFYy4p8ucOs=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-plages-gran-popo.jpg'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      estVedette: true, popularite: 82,
      regionId: regionMap['mono'].id, categoryId: catMap['plage'].id
    },
    {
      slug: 'pays-tata-somba',
      nomFr: 'Le Pays des Tata Somba', nomEn: 'Land of the Tata Somba',
      nomEs: 'La Tierra de los Tata Somba', nomDe: 'Das Land der Tata Somba',
      descriptionFr: "Les Tata Somba sont des habitations-forteresses en banco typiques du peuple Bétamaribé dans l'Atacora, construites sur deux étages, protégées par l'UNESCO.",
      descriptionEn: 'The Tata Somba are mud-brick fortress dwellings of the Bétamaribé people, built on two floors and protected by UNESCO.',
      descriptionEs: 'Las Tata Somba son fortalezas de barro del pueblo Bétamaribé, protegidas por la UNESCO.',
      descriptionDe: 'Die Tata Somba sind Lehm-Festungshäuser des Bétamaribé-Volkes, von der UNESCO geschützt.',
      adresse: 'Région de Natitingou, Atacora, Bénin',
      latitude: 10.4000, longitude: 1.4000,
      gratuit: false, enfants: true, avecGuide: true,
      tarifs: { adulte: 1500, devise: 'XOF' },
      horaires: { ouverture: '7h00', fermeture: '18h00' },
      imagesCouverture: ['https://images.partir.com/1e4LbvKIWnAf6v6EwOGpBwM6xGE=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-pays-tata-somba.jpg'],
      images: ['https://images.partir.com/1e4LbvKIWnAf6v6EwOGpBwM6xGE=/520x366/filters:sharpen(0.3,0.3,true)/lieux-interet/benin/benin-pays-tata-somba.jpg'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      estVedette: true, popularite: 78,
      regionId: regionMap['atacora'].id, categoryId: catMap['culturel'].id
    },
  ];

  for (const s of sitesData) {
    await prisma.touristSite.upsert({
      where:  { slug: s.slug },
      update: { nomFr: s.nomFr, nomEn: s.nomEn, descriptionFr: s.descriptionFr, imagesCouverture: s.imagesCouverture, videoUrl: s.videoUrl ?? null, popularite: s.popularite, estVedette: s.estVedette ?? false },
      create: s
    });
  }
  const allSites = await prisma.touristSite.findMany({ take: 7 });
  console.log(`✅ ${allSites.length} sites touristiques`);

  // ══════════════════════════════════════════════════════════════════════
  // 4. UTILISATEURS
  // ══════════════════════════════════════════════════════════════════════
  const hash = async (pw) => bcrypt.hash(pw, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@beninexplore.bj' },
    update: {},
    create: { email: 'admin@beninexplore.bj', passwordHash: await hash('Admin@BeninExplore2024'), nom: 'Admin', prenom: 'BeninExplore', role: 'ADMIN', isActive: true }
  });

  const touriste1 = await prisma.user.upsert({
    where: { email: 'sophie.martin@email.com' },
    update: {},
    create: { email: 'sophie.martin@email.com', passwordHash: await hash('Test@1234'), nom: 'Martin', prenom: 'Sophie', role: 'TOURISTE', telephone: '+33612345678', pays: 'France', langue: 'fr', isActive: true }
  });

  const touriste2 = await prisma.user.upsert({
    where: { email: 'james.osei@email.com' },
    update: {},
    create: { email: 'james.osei@email.com', passwordHash: await hash('Test@1234'), nom: 'Osei', prenom: 'James', role: 'TOURISTE', telephone: '+23320112233', pays: 'Ghana', langue: 'en', isActive: true }
  });

  const prestUser1 = await prisma.user.upsert({
    where: { email: 'koffi.safaris@email.com' },
    update: {},
    create: { email: 'koffi.safaris@email.com', passwordHash: await hash('Test@1234'), nom: 'Adjovi', prenom: 'Koffi', role: 'PRESTATAIRE', telephone: '+22997112233', pays: 'Bénin', langue: 'fr', isActive: true }
  });

  const prestUser2 = await prisma.user.upsert({
    where: { email: 'amina.hebergement@email.com' },
    update: {},
    create: { email: 'amina.hebergement@email.com', passwordHash: await hash('Test@1234'), nom: 'Bello', prenom: 'Amina', role: 'PRESTATAIRE', telephone: '+22996223344', pays: 'Bénin', langue: 'fr', isActive: true }
  });

  console.log('✅ 5 utilisateurs (admin + 2 touristes + 2 prestataires)');

  // ══════════════════════════════════════════════════════════════════════
  // 5. PRESTATAIRES (Providers)
  // ══════════════════════════════════════════════════════════════════════
  const provider1 = await prisma.provider.upsert({
    where: { userId: prestUser1.id },
    update: {},
    create: {
      userId:       prestUser1.id,
      nomEntreprise: 'Koffi Safaris & Tours',
      descriptionFr: "Spécialiste des safaris et excursions au Bénin depuis 2015. Nous proposons des safaris sur mesure au Parc de la Pendjari, des circuits culturels et des visites guidées des sites historiques du Sud-Bénin. Notre équipe de guides certifiés garantit une expérience authentique et respectueuse de la nature.",
      descriptionEn: "Specialist in safaris and excursions in Benin since 2015. We offer tailored safaris in Pendjari Park, cultural tours and guided visits to southern Benin's historic sites.",
      telephone:    '+22997112233',
      email:        'koffi.safaris@email.com',
      adresse:      'Quartier Cadjèhoun, Cotonou, Bénin',
      siteWeb:      'https://koffi-safaris.bj',
      estVerifie:   true,
      images:       ['https://images.unsplash.com/photo-1516026672322-bc52d61a9a52?w=800'],
    }
  });

  const provider2 = await prisma.provider.upsert({
    where: { userId: prestUser2.id },
    update: {},
    create: {
      userId:       prestUser2.id,
      nomEntreprise: 'Éden Bénin Lodge',
      descriptionFr: "Lodge éco-responsable au bord du lac Ahémé. Chambres avec vue sur le lac, cuisine béninoise traditionnelle, excursions en pirogue et ateliers d'artisanat local. Idéal pour un séjour authentique loin de l'agitation urbaine.",
      descriptionEn: "Eco-friendly lodge on the shores of Lake Ahémé. Rooms with lake view, traditional Beninese cuisine, pirogue excursions and local craft workshops.",
      telephone:    '+22996223344',
      email:        'amina.hebergement@email.com',
      adresse:      'Possotomé, Mono, Bénin',
      siteWeb:      'https://eden-benin-lodge.com',
      estVerifie:   true,
      images:       ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    }
  });

  console.log('✅ 2 prestataires vérifiés');

  // ══════════════════════════════════════════════════════════════════════
  // 6. SERVICES
  // ══════════════════════════════════════════════════════════════════════
  // Nettoyer les réservations puis les services existants pour éviter les doublons
  await prisma.reservation.deleteMany({ where: { service: { providerId: { in: [provider1.id, provider2.id] } } } });
  await prisma.service.deleteMany({ where: { providerId: { in: [provider1.id, provider2.id] } } });

  const [svc1, svc2, svc3, svc4, svc5, svc6] = await Promise.all([
    // Koffi Safaris
    prisma.service.create({
      data: {
        providerId:   provider1.id,
        type:         'ACTIVITE',
        nomFr:        'Safari Pendjari 3 jours',
        nomEn:        '3-Day Pendjari Safari',
        descriptionFr: "Immersion totale dans le Parc National de la Pendjari. Observation de lions, éléphants, hippopotames et centaines d'espèces d'oiseaux. Transport 4x4, guide naturaliste certifié, hébergement en lodge et tous les repas inclus.",
        descriptionEn: "Total immersion in Pendjari National Park. Lion, elephant and hippo watching. 4x4 transport, certified naturalist guide, lodge accommodation and all meals included.",
        prix:         180000,
        devise:       'XOF',
        capacite:     8,
        duree:        4320,
        disponible:   true,
        images:       ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/African_Elephant_at_Pendjari.jpg/1280px-African_Elephant_at_Pendjari.jpg']
      }
    }),
    prisma.service.create({
      data: {
        providerId:   provider1.id,
        type:         'GUIDE',
        nomFr:        'Circuit historique Ouidah & Abomey',
        nomEn:        'Ouidah & Abomey Historic Tour',
        descriptionFr: "Journée complète sur les traces du Royaume du Danhomè. Visite des Palais Royaux d'Abomey (UNESCO) et de la Route des Esclaves à Ouidah, avec guide historien diplômé. Transport aller-retour depuis Cotonou, déjeuner inclus.",
        descriptionEn: "Full-day tour in the footsteps of the Dahomey Kingdom. Visit the Royal Palaces of Abomey (UNESCO) and the Slave Route in Ouidah, with a graduate historian guide.",
        prix:         45000,
        devise:       'XOF',
        capacite:     12,
        duree:        540,
        disponible:   true,
        images:       ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Abomey_bas-relief.jpg/1280px-Abomey_bas-relief.jpg']
      }
    }),
    prisma.service.create({
      data: {
        providerId:   provider1.id,
        type:         'TRANSPORT',
        nomFr:        'Transfert Cotonou ↔ Aéroport',
        nomEn:        'Cotonou ↔ Airport Transfer',
        descriptionFr: "Service de transfert privé entre l'aéroport international de Cotonou et votre hôtel. Véhicule climatisé, chauffeur professionnel, ponctualité garantie. Disponible 24h/24.",
        descriptionEn: "Private transfer between Cotonou international airport and your hotel. Air-conditioned vehicle, professional driver, punctuality guaranteed. Available 24/7.",
        prix:         15000,
        devise:       'XOF',
        capacite:     4,
        duree:        45,
        disponible:   true,
        images:       []
      }
    }),
    // Éden Bénin Lodge
    prisma.service.create({
      data: {
        providerId:   provider2.id,
        type:         'HEBERGEMENT',
        nomFr:        'Chambre Lac — Vue panoramique',
        nomEn:        'Lake Room — Panoramic View',
        descriptionFr: "Chambre double avec vue directe sur le lac Ahémé. Lit king-size, salle de bain privée, terrasse avec transat, ventilateur et moustiquaire. Petit-déjeuner béninois compris. Accès ponton privatif et pirogue incluse.",
        descriptionEn: "Double room with direct view of Lake Ahémé. King-size bed, private bathroom, terrace with lounger, fan and mosquito net. Beninese breakfast included. Private pontoon and pirogue access.",
        prix:         35000,
        devise:       'XOF',
        capacite:     2,
        duree:        1440,
        disponible:   true,
        videoUrl:     'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        images:       ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800']
      }
    }),
    prisma.service.create({
      data: {
        providerId:   provider2.id,
        type:         'RESTAURANT',
        nomFr:        'Dîner gastronomique béninois',
        nomEn:        'Beninese Gourmet Dinner',
        descriptionFr: "Dîner en 5 services mettant à l'honneur la cuisine traditionnelle béninoise : amiwo, sauce gluglú, poisson braisé du lac, ragoût d'igname et dessert aux fruits locaux. Cadre romantique au bord du lac à la tombée de la nuit.",
        descriptionEn: "5-course dinner celebrating traditional Beninese cuisine: amiwo, gluglú sauce, lake grilled fish, yam stew and local fruit dessert. Romantic lakeside setting at nightfall.",
        prix:         25000,
        devise:       'XOF',
        capacite:     20,
        duree:        120,
        disponible:   true,
        images:       ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800']
      }
    }),
    prisma.service.create({
      data: {
        providerId:   provider2.id,
        type:         'ACTIVITE',
        nomFr:        'Excursion pirogue lac Ahémé',
        nomEn:        'Lake Ahémé Pirogue Excursion',
        descriptionFr: "Excursion en pirogue traditionnelle de 3h sur le lac Ahémé. Découverte des acadjas (parcs à poissons), des villages de pêcheurs et de la mangrove. Guide local, équipement de sécurité fourni.",
        descriptionEn: "3-hour traditional pirogue excursion on Lake Ahémé. Discover acadjas (fish parks), fishing villages and mangroves. Local guide and safety equipment provided.",
        prix:         12000,
        devise:       'XOF',
        capacite:     6,
        duree:        180,
        disponible:   true,
        images:       ['https://images.unsplash.com/photo-1543159539-fb67fba23de1?w=800']
      }
    }),
  ]);
  console.log('✅ 6 services publiés');

  // ══════════════════════════════════════════════════════════════════════
  // 7. RÉSERVATIONS
  // ══════════════════════════════════════════════════════════════════════
  await prisma.reservation.deleteMany({ where: { userId: { in: [touriste1.id, touriste2.id] } } });

  const d = (offset) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000);

  const [resa1, resa2, resa3, resa4] = await Promise.all([
    // Sophie réserve le safari (CONFIRMEE)
    prisma.reservation.create({ data: {
      userId: touriste1.id, serviceId: svc1.id, providerId: provider1.id,
      dateDebut: d(7), dateFin: d(10), nombrePersonnes: 2, statut: 'CONFIRMEE',
      prixTotal: 360000, notes: "Nous sommes passionnés de faune sauvage. Peut-on espérer voir des lions ?", methodePaiement: 'MOBILE_MONEY'
    }}),
    // Sophie réserve le circuit historique (TERMINEE - pour les avis)
    prisma.reservation.create({ data: {
      userId: touriste1.id, serviceId: svc2.id, providerId: provider1.id,
      dateDebut: d(-14), dateFin: d(-14), nombrePersonnes: 2, statut: 'TERMINEE',
      prixTotal: 90000, notes: "Très intéressés par l'histoire du Danhomè.", methodePaiement: 'ESPECES'
    }}),
    // James réserve la chambre lodge (EN_ATTENTE)
    prisma.reservation.create({ data: {
      userId: touriste2.id, serviceId: svc4.id, providerId: provider2.id,
      dateDebut: d(14), dateFin: d(17), nombrePersonnes: 2, statut: 'EN_ATTENTE',
      prixTotal: 105000, notes: "Nous célébrons notre anniversaire de mariage. Avez-vous des décorations spéciales ?", methodePaiement: 'CARTE'
    }}),
    // James réserve la pirogue (EN_COURS)
    prisma.reservation.create({ data: {
      userId: touriste2.id, serviceId: svc6.id, providerId: provider2.id,
      dateDebut: d(0), dateFin: d(0), nombrePersonnes: 3, statut: 'EN_COURS',
      prixTotal: 36000, notes: "", methodePaiement: 'ESPECES'
    }}),
  ]);
  console.log('✅ 4 réservations (confirmée, terminée, en attente, en cours)');

  // ══════════════════════════════════════════════════════════════════════
  // 8. AVIS SUR LES SITES TOURISTIQUES
  // ══════════════════════════════════════════════════════════════════════
  const siteGanvie = allSites.find(s => s.slug === 'ganvie-cite-lacustre');
  const siteOuidah = allSites.find(s => s.slug === 'ouidah-route-esclaves');
  const sitePendjari = allSites.find(s => s.slug === 'parc-pendjari');

  if (siteGanvie) {
    await prisma.review.upsert({
      where: { userId_siteId: { userId: touriste1.id, siteId: siteGanvie.id } },
      update: {},
      create: {
        userId: touriste1.id, siteId: siteGanvie.id, note: 5,
        commentaire: "Une expérience inoubliable ! La traversée en pirogue au lever du soleil était magique. Les habitants sont accueillants et la pêche artisanale est fascinante. Incontournable au Bénin !",
        photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ganvie_stilt_village%2C_Benin.jpg/1280px-Ganvie_stilt_village%2C_Benin.jpg'],
        estApprouve: true
      }
    });
    await prisma.touristSite.update({ where: { id: siteGanvie.id }, data: { noteMoyenne: 4.8, nombreAvis: 12 } });
  }

  if (siteOuidah) {
    await prisma.review.upsert({
      where: { userId_siteId: { userId: touriste2.id, siteId: siteOuidah.id } },
      update: {},
      create: {
        userId: touriste2.id, siteId: siteOuidah.id, note: 5,
        commentaire: "The Door of No Return is one of the most powerful and moving monuments I have ever visited. A necessary journey to understand the history of the slave trade. The guide was excellent.",
        estApprouve: true
      }
    });
    await prisma.touristSite.update({ where: { id: siteOuidah.id }, data: { noteMoyenne: 4.9, nombreAvis: 18 } });
  }

  if (sitePendjari) {
    await prisma.review.upsert({
      where: { userId_siteId: { userId: touriste1.id, siteId: sitePendjari.id } },
      update: {},
      create: {
        userId: touriste1.id, siteId: sitePendjari.id, note: 4,
        commentaire: "Magnifique parc ! Nous avons vu des éléphants, des buffles et des hippos. Malheureusement pas de lions cette fois-ci. Le logement en lodge est très confortable. A recommander absolument !",
        estApprouve: false  // En attente de modération
      }
    });
    await prisma.touristSite.update({ where: { id: sitePendjari.id }, data: { noteMoyenne: 4.5, nombreAvis: 9 } });
  }

  console.log('✅ 3 avis (2 approuvés, 1 en attente modération)');

  // ══════════════════════════════════════════════════════════════════════
  // 9. AVIS SUR UN SERVICE
  // ══════════════════════════════════════════════════════════════════════
  await prisma.serviceReview.upsert({
    where: { userId_serviceId: { userId: touriste1.id, serviceId: svc2.id } },
    update: {},
    create: {
      userId: touriste1.id, serviceId: svc2.id, reservationId: resa2.id,
      note: 5,
      commentaire: "Guide absolument passionnant ! Jean-Baptiste connaît l'histoire du Danhomè sur le bout des doigts. La visite d'Abomey était émouvante et celle de la Route des Esclaves est un moment de recueillement nécessaire. Le déjeuner (amiwo et poisson) était délicieux. Je recommande vivement."
    }
  });
  await prisma.service.update({ where: { id: svc2.id }, data: { noteMoyenne: 5.0, nombreAvis: 1 } });
  console.log('✅ 1 avis service (circuit historique)');

  // ══════════════════════════════════════════════════════════════════════
  // 10. FAVORIS
  // ══════════════════════════════════════════════════════════════════════
  if (siteGanvie) {
    await prisma.favorite.upsert({
      where: { userId_siteId: { userId: touriste1.id, siteId: siteGanvie.id } },
      update: {},
      create: { userId: touriste1.id, siteId: siteGanvie.id }
    });
  }
  if (sitePendjari) {
    await prisma.favorite.upsert({
      where: { userId_siteId: { userId: touriste2.id, siteId: sitePendjari.id } },
      update: {},
      create: { userId: touriste2.id, siteId: sitePendjari.id }
    });
    await prisma.favorite.upsert({
      where: { userId_siteId: { userId: touriste1.id, siteId: sitePendjari.id } },
      update: {},
      create: { userId: touriste1.id, siteId: sitePendjari.id }
    });
  }
  console.log('✅ 3 favoris');

  // ══════════════════════════════════════════════════════════════════════
  // 11. BADGES
  // ══════════════════════════════════════════════════════════════════════
  const badgesData = [
    { nomFr: 'Découvreur',      nomEn: 'Explorer',      descriptionFr: 'A visité son premier site au Bénin',                              icone: '🗺️',  condition: 'first_visit'     },
    { nomFr: 'Ami du Bénin',    nomEn: 'Friend of Benin', descriptionFr: 'A laissé son premier avis',                                    icone: '⭐',  condition: 'first_review'    },
    { nomFr: 'Voyageur',        nomEn: 'Traveler',       descriptionFr: 'A effectué 3 réservations',                                     icone: '✈️',  condition: '3_reservations'  },
    { nomFr: 'Photographe',     nomEn: 'Photographer',   descriptionFr: 'A partagé 5 photos de sites',                                   icone: '📸',  condition: '5_photos'        },
    { nomFr: 'Ambassadeur',     nomEn: 'Ambassador',     descriptionFr: 'Membre actif depuis plus d\'un an avec 10+ avis approuvés',    icone: '🏆',  condition: 'ambassador'      },
  ];

  const badges = [];
  for (const b of badgesData) {
    let badge = await prisma.badge.findFirst({ where: { nomFr: b.nomFr } });
    if (!badge) badge = await prisma.badge.create({ data: b });
    badges.push(badge);
  }

  // Attribuer les 2 premiers badges à Sophie
  for (const badge of badges.slice(0, 2)) {
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId: touriste1.id, badgeId: badge.id } }
    });
    if (!existing) {
      await prisma.userBadge.create({ data: { userId: touriste1.id, badgeId: badge.id } });
    }
  }
  console.log(`✅ ${badges.length} badges, 2 attribués à Sophie`);

  // ══════════════════════════════════════════════════════════════════════
  // 12. ALERTES SÉCURITÉ
  // ══════════════════════════════════════════════════════════════════════
  await prisma.securityAlert.createMany({
    skipDuplicates: true,
    data: [
      {
        regionSlug: 'atacora',
        messageFr:  "Avis de vigilance renforcée dans la zone frontalière nord (région Atacora). Évitez de vous déplacer de nuit hors des zones urbanisées.",
        messageEn:  "Heightened vigilance advisory in the northern border area (Atacora region). Avoid traveling at night outside urban areas.",
        severite:   'MOYEN',
        estActive:  true,
        expireAt:   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        regionSlug: null,
        messageFr:  "Saison des pluies en cours (juin–octobre). Les routes secondaires peuvent être impraticables. Vérifiez les conditions météo avant tout déplacement.",
        messageEn:  "Rainy season in progress (June–October). Secondary roads may be impassable. Check weather conditions before any trip.",
        severite:   'FAIBLE',
        estActive:  true
      }
    ]
  });
  console.log('✅ 2 alertes sécurité');

  // ══════════════════════════════════════════════════════════════════════
  // 13. ARTICLES BLOG
  // ══════════════════════════════════════════════════════════════════════
  const blogData = [
    {
      slug:      '7-incontournables-benin-2024',
      titreFr:   'Les 7 sites incontournables du Bénin en 2024',
      titreEn:   'The 7 Must-See Sites in Benin in 2024',
      contenuFr: `Ganvié, Ouidah, Abomey, la Pendjari... Le Bénin regorge de trésors culturels et naturels d'exception. Voici notre sélection des 7 destinations à ne manquer sous aucun prétexte lors de votre visite dans le "Quartier Latin de l'Afrique".\n\n**1. Ganvié — La Venise d'Afrique**\nFondé au XVIIe siècle sur le lac Nokoué, Ganvié est le plus grand village lacustre d'Afrique. Une promenade en pirogue au lever du soleil est une expérience inoubliable.\n\n**2. Les Palais Royaux d'Abomey**\nInscrits au patrimoine UNESCO, ces palais racontent l'épopée du Royaume du Danhomè...`,
      contenuEn: `Ganvié, Ouidah, Abomey, Pendjari... Benin is full of exceptional cultural and natural treasures. Here is our selection of the 7 destinations not to be missed during your visit to the "Latin Quarter of Africa".\n\n**1. Ganvié — The Venice of Africa**\nFounded in the 17th century on Lake Nokoué, Ganvié is the largest stilt village in Africa. A pirogue ride at sunrise is an unforgettable experience.\n\n**2. The Royal Palaces of Abomey**\nListed as UNESCO heritage, these palaces tell the story of the Kingdom of Dahomey...`,
      imageCover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ganvie_stilt_village%2C_Benin.jpg/1280px-Ganvie_stilt_village%2C_Benin.jpg',
      auteur:     'Équipe BeninExplore',
      categorie:  'Itinéraires',
      estPublie:  true
    },
    {
      slug:      'voodoo-culture-spirituelle-benin',
      titreFr:   'Le Vodoun — Religion, art et culture au cœur du Bénin',
      titreEn:   'Voodoo — Religion, Art and Culture at the Heart of Benin',
      contenuFr: `Le Vodoun, ou Voodoo, est bien plus qu'une religion au Bénin : c'est une vision du monde, un art de vivre transmis depuis des générations. Le 10 janvier, la Fête du Voodoo à Ouidah rassemble des milliers de fidèles venus de tout le pays et de la diaspora pour célébrer cette tradition millénaire...`,
      contenuEn: `Voodoo is much more than a religion in Benin: it's a worldview, a way of life passed down through generations. On January 10th, the Voodoo Festival in Ouidah gathers thousands of faithful from across the country and the diaspora to celebrate this ancient tradition...`,
      imageCover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Porte_du_non_retour_-_Ouidah.jpg/1280px-Porte_du_non_retour_-_Ouidah.jpg',
      auteur:     'Maxime Houénou',
      categorie:  'Culture',
      estPublie:  true
    },
    {
      slug:      'gastronomie-beninoise-guide-complet',
      titreFr:   'Gastronomie béninoise : notre guide complet des saveurs',
      titreEn:   'Beninese Cuisine: Our Complete Flavor Guide',
      contenuFr: `La cuisine béninoise est un voyage en soi. Entre l'amiwo (pâte de maïs à la tomate), la sauce gluglú, le poisson braisé du lac Ahémé et les beignets akara, les saveurs du Bénin ont de quoi séduire les palais les plus exigeants. Suivez notre guide pour ne rien manquer des spécialités locales...`,
      contenuEn: `Beninese cuisine is a journey in itself. From amiwo (corn paste with tomato), gluglú sauce, Lake Ahémé grilled fish and akara fritters, Benin's flavors will captivate even the most demanding palates...`,
      imageCover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      auteur:     'Fatima Sossou',
      categorie:  'Gastronomie',
      estPublie:  true
    },
    {
      slug:      'conseils-pratiques-voyage-benin',
      titreFr:   'Voyager au Bénin : 10 conseils pratiques indispensables',
      titreEn:   'Traveling to Benin: 10 Essential Practical Tips',
      contenuFr: `**1. Le visa e-Bénin**\nLes ressortissants de la plupart des pays doivent obtenir un visa. Le visa e-Bénin se demande en ligne sur evisa.gouv.bj...\n\n**2. La santé**\nLa vaccination contre la fièvre jaune est obligatoire. Pensez aussi aux vaccins hépatite A, typhoïde et méningite. Emportez une prophylaxie antipaludéenne...\n\n**3. L'argent**\nLa monnaie est le Franc CFA (XOF). Les DAB se trouvent principalement dans les grandes villes...`,
      contenuEn: `**1. The e-Bénin visa**\nCitizens of most countries must obtain a visa. The e-Bénin visa can be applied for online at evisa.gouv.bj...\n\n**2. Health**\nYellow fever vaccination is mandatory. Also consider hepatitis A, typhoid and meningitis vaccines. Bring anti-malaria prophylaxis...\n\n**3. Money**\nThe currency is the CFA Franc (XOF). ATMs are mainly found in large cities...`,
      imageCover: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      auteur:     'Équipe BeninExplore',
      categorie:  'Conseils',
      estPublie:  false  // brouillon
    },
  ];

  for (const post of blogData) {
    await prisma.blogPost.upsert({
      where:  { slug: post.slug },
      update: { estPublie: post.estPublie },
      create: post
    });
  }
  console.log(`✅ ${blogData.length} articles blog (${blogData.filter(p => p.estPublie).length} publiés, 1 brouillon)`);

  // ══════════════════════════════════════════════════════════════════════
  // 14. NOTIFICATIONS
  // ══════════════════════════════════════════════════════════════════════
  await prisma.notification.createMany({
    data: [
      // Pour le prestataire 1 (koffi)
      { userId: prestUser1.id, type: 'NOUVELLE_RESERVATION', titre: 'Nouvelle réservation !', message: 'Sophie Martin vient de réserver "Safari Pendjari 3 jours" pour 2 personnes.', lien: '/profil/prestataire', lu: false },
      { userId: prestUser1.id, type: 'RESERVATION_TERMINEE', titre: 'Réservation terminée', message: 'La réservation du circuit historique par Sophie Martin est marquée comme terminée.', lien: '/profil/prestataire', lu: true },
      // Pour Sophie (touriste)
      { userId: touriste1.id, type: 'RESERVATION_CONFIRMEE', titre: 'Réservation confirmée ✓', message: 'Koffi Safaris & Tours a confirmé votre safari Pendjari. Préparez-vous !', lien: '/profil', lu: false },
      // Pour James
      { userId: touriste2.id, type: 'NOUVELLE_RESERVATION', titre: 'Demande reçue', message: "Votre réservation à l'Éden Bénin Lodge est bien reçue et en attente de confirmation.", lien: '/profil', lu: false },
      // Admin : alerte prestataire
      { userId: admin.id, type: 'NOUVEAU_PRESTATAIRE', titre: 'Nouveau prestataire inscrit', message: 'Koffi Adjovi (Koffi Safaris & Tours) vient de créer un compte prestataire.', lien: '/admin/prestataires', lu: false },
    ]
  });
  console.log('✅ 5 notifications');

  // ══════════════════════════════════════════════════════════════════════
  // RÉSUMÉ FINAL
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n🎉 Seed terminé avec succès !\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  COMPTES DE TEST');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  👑 ADMIN         : admin@beninexplore.bj       | Admin@BeninExplore2024');
  console.log('  🧳 TOURISTE 1    : sophie.martin@email.com      | Test@1234');
  console.log('  🧳 TOURISTE 2    : james.osei@email.com         | Test@1234');
  console.log('  🏢 PRESTATAIRE 1 : koffi.safaris@email.com      | Test@1234');
  console.log('  🏢 PRESTATAIRE 2 : amina.hebergement@email.com  | Test@1234');
  console.log('═══════════════════════════════════════════════════════\n');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
