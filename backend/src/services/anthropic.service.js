import { prisma } from '../config/database.js';

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

async function* streamWithGroq(messages) {
  const { default: Groq } = await import('groq-sdk');
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY.trim() });

  const stream = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 500,
    stream: true,
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? '';
    if (text) yield text;
  }
}

async function* streamWithAnthropic(messages) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY.trim() });

  const stream = client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      const text = event.delta.text ?? '';
      if (text) yield text;
    }
  }
}

// Retourne un AsyncGenerator qui choisit le bon provider et gère le fallback
async function* buildStream(messages) {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY?.trim();
  const hasGroq      = !!process.env.GROQ_API_KEY?.trim();

  if (!hasAnthropic && !hasGroq) {
    throw new Error('Aucune clé IA configurée (ANTHROPIC_API_KEY ou GROQ_API_KEY).');
  }

  if (hasAnthropic) {
    try {
      // Inlining du loop pour que le try/catch fonctionne correctement
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY.trim() });

      const stream = client.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
          const text = event.delta.text ?? '';
          if (text) yield text;
        }
      }
      return; // succès Anthropic
    } catch (err) {
      const isCreditError = err?.status === 400 || err?.status === 402 || err?.status === 529;
      const isAuthError   = err?.status === 401;

      if ((isCreditError || isAuthError) && hasGroq) {
        console.warn('[chat] Anthropic indisponible (status:', err?.status, '), bascule sur Groq');
        // Fallback vers Groq
        for await (const text of streamWithGroq(messages)) {
          yield text;
        }
        return;
      }
      throw err;
    }
  }

  // Groq uniquement
  for await (const text of streamWithGroq(messages)) {
    yield text;
  }
}

export async function getOrCreateSession(sessionId, userId = null, langue = 'fr') {
  let session = await prisma.chatSession.findUnique({ where: { sessionId } });
  if (!session) {
    session = await prisma.chatSession.create({ data: { sessionId, userId, langue } });
  }
  return session;
}

export async function streamChatMessage(sessionId, userMessage) {
  const session = await prisma.chatSession.findUnique({
    where: { sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } },
  });
  if (!session) throw new Error('Session introuvable');

  const history  = session.messages.map(m => ({ role: m.role, content: m.contenu }));
  const messages = [...history, { role: 'user', content: userMessage }];

  return { stream: buildStream(messages), sessionDbId: session.id };
}

export async function saveChatMessages(sessionDbId, userMessage, assistantMessage) {
  await prisma.chatMessage.createMany({
    data: [
      { sessionId: sessionDbId, role: 'user',      contenu: userMessage      },
      { sessionId: sessionDbId, role: 'assistant', contenu: assistantMessage },
    ],
  });
}
