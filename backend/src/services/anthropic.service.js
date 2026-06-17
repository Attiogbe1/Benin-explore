import { prisma } from '../config/database.js';

async function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const { default: Groq } = await import('groq-sdk');
    return new Groq({ apiKey });
  } catch (err) {
    console.error('[chat] impossible d initialiser Groq:', err?.message || err);
    return null;
  }
}

const SYSTEM_PROMPT = `Tu es **BeninGuide**, l'assistant intelligent officiel de la plateforme BeninExplore.
Tu es un expert passionné du tourisme au Bénin, avec une connaissance approfondie de :

**Destinations & Sites**
- Ganvié (cité lacustre sur le lac Nokoué)
- Ouidah (porte de l'esclavage, Temple des Pythons, Route des Esclaves)
- Abomey (Palais Royaux, Musée Historique, UNESCO)
- Cotonou (marché Dantokpa, plages, vie nocturne)
- Natitingou & Tanougou (cascades, Atakora)
- Parc National de la Pendjari (lions, éléphants, hippopotames)
- Grand-Popo & Ouidah (plages, sunset)
- Porto-Novo (capitale, musées, architecture coloniale)

**Informations pratiques**
- Visa : e-visa disponible sur evisa.gouv.bj pour la plupart des nationalités
- Santé : vaccin fièvre jaune obligatoire, antipaludéens recommandés
- Monnaie : Franc CFA (XOF), 1€ ≈ 655 XOF
- Langue officielle : Français + langues locales (Fon, Yoruba, Bariba...)
- Meilleure période : novembre à mars (saison sèche)
- Sécurité : généralement sûr, prudence dans le nord (Pendjari)

**Culture & Traditions**
- Vodoun : religion traditionnelle, Festival Vodoun en janvier (Ouidah)
- Artisanat : broderies Yoruba, pagnes, masques, sculptures
- Cuisine : pâte de maïs, sauce gombo, poisson grillé, tchoukoutou

**Règles**
- Réponds toujours dans la langue de l'utilisateur (FR/EN/ES/DE)
- Sois précis, chaleureux et enthousiaste concernant le Bénin
- Si tu ne sais pas quelque chose, dis-le clairement
- Pour les urgences, donne immédiatement les numéros : Police 117, SAMU 161
- Limite tes réponses à 300 mots maximum, reste concis`;

export async function getOrCreateSession(sessionId, userId = null, langue = 'fr') {
  let session = await prisma.chatSession.findUnique({ where: { sessionId } });
  if (!session) {
    session = await prisma.chatSession.create({ data: { sessionId, userId, langue } });
  }
  return session;
}

// Streaming — renvoie un AsyncIterable de chunks texte
export async function streamChatMessage(sessionId, userMessage, langue = 'fr') {
  const client = await getGroqClient();
  if (!client) throw new Error('GROQ_API_KEY n\'est pas configurée. Le chat IA est indisponible.');

  const session = await prisma.chatSession.findUnique({
    where: { sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
  });

  if (!session) throw new Error('Session introuvable');

  const history = session.messages.map(m => ({ role: m.role, content: m.contenu }));

  const stream = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 500,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: userMessage }
    ]
  });

  return { stream, sessionDbId: session.id };
}

export async function saveChatMessages(sessionDbId, userMessage, assistantMessage) {
  await prisma.chatMessage.createMany({
    data: [
      { sessionId: sessionDbId, role: 'user',      contenu: userMessage      },
      { sessionId: sessionDbId, role: 'assistant', contenu: assistantMessage }
    ]
  });
}

// Fallback non-streaming (conservé pour compatibilité)
export async function sendChatMessage(sessionId, userMessage, langue = 'fr') {
  const client = await getGroqClient();
  if (!client) throw new Error('GROQ_API_KEY n\'est pas configurée. Le chat IA est indisponible.');

  const session = await prisma.chatSession.findUnique({
    where: { sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
  });
  if (!session) throw new Error('Session de chat introuvable');

  const history = session.messages.map(m => ({ role: m.role, content: m.contenu }));

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 500,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: userMessage }
    ]
  });

  const assistantMessage = response.choices[0].message.content;
  await saveChatMessages(session.id, userMessage, assistantMessage);
  return { message: assistantMessage, sessionId };
}
