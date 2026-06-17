import { streamChatMessage, saveChatMessages, getOrCreateSession, sendChatMessage } from '../services/anthropic.service.js';
import { prisma } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export async function sendMessage(req, res) {
  const { message, sessionId, langue = 'fr' } = req.body;
  const userId = req.user?.id || null;

  if (!message?.trim()) return res.status(400).json({ error: 'Message vide' });

  const chatSessionId = sessionId || uuidv4();

  // SSE headers — le client reçoit les tokens au fil de l'eau
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    await getOrCreateSession(chatSessionId, userId, langue);
    const { stream, sessionDbId } = await streamChatMessage(chatSessionId, message, langue);

    let fullText = '';

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (text) {
        fullText += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Enregistrer en base après le streaming
    await saveChatMessages(sessionDbId, message, fullText);

    res.write(`data: ${JSON.stringify({ done: true, sessionId: chatSessionId })}\n\n`);
    res.end();

  } catch (err) {
    const msg = err?.status === 429
      ? 'Limite de messages atteinte. Réessayez dans une minute.'
      : 'Désolé, je rencontre un problème technique. Réessayez dans un instant.';

    console.error('[chat] stream error:', err?.message || err);
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
}

export async function getChatHistory(req, res) {
  try {
    const session = await prisma.chatSession.findUnique({
      where: { sessionId: req.params.sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } }
    });
    res.json({ messages: session?.messages || [] });
  } catch (err) {
    console.error('[chat] getChatHistory error:', err?.message || err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

export async function clearSession(req, res) {
  try {
    await prisma.chatMessage.deleteMany({
      where: { session: { sessionId: req.params.sessionId } }
    });
    res.json({ success: true });
  } catch (err) {
    console.error('[chat] clearSession error:', err?.message || err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
