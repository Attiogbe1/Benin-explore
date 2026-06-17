// Store chatbot BeninGuide — Svelte 5 runes + SSE streaming
import { v4 as uuidv4 } from 'uuid';

function getSessionId() {
  if (typeof localStorage === 'undefined') return uuidv4();
  let id = localStorage.getItem('benin_chat_session');
  if (!id) { id = uuidv4(); localStorage.setItem('benin_chat_session', id); }
  return id;
}

const welcomeMessages = {
  fr: "Bonjour ! Je suis **BeninGuide**, votre assistant pour découvrir le Bénin. Comment puis-je vous aider ?",
  en: "Hello! I'm **BeninGuide**, your assistant to explore Benin. How can I help you?",
  es: "¡Hola! Soy **BeninGuide**, tu asistente para explorar Benín. ¿Cómo puedo ayudarte?",
  de: "Hallo! Ich bin **BeninGuide**, Ihr Assistent für Benin. Wie kann ich Ihnen helfen?"
};

export const chatStore = (() => {
  let isOpen       = $state(false);
  let isLoading    = $state(false);
  let messages     = $state([]);
  let sessionId    = $state(getSessionId());
  let hasNewMessage = $state(false);
  let langue       = $state('fr');

  return {
    get isOpen()        { return isOpen; },
    get isLoading()     { return isLoading; },
    get messages()      { return messages; },
    get sessionId()     { return sessionId; },
    get hasNewMessage() { return hasNewMessage; },
    get langue()        { return langue; },

    setLangue(l) { langue = l; },

    open(lang = 'fr') {
      langue = lang;
      isOpen = true;
      hasNewMessage = false;
      if (messages.length === 0) {
        messages = [{
          id: uuidv4(), role: 'assistant',
          content: welcomeMessages[lang] || welcomeMessages.fr,
          timestamp: new Date()
        }];
      }
    },

    close()       { isOpen = false; },
    toggle(lang)  { isOpen ? this.close() : this.open(lang || langue); },

    async sendMessage(content) {
      if (!content.trim() || isLoading) return;

      // Ajouter le message utilisateur
      messages = [...messages, {
        id: uuidv4(), role: 'user', content, timestamp: new Date()
      }];
      isLoading = true;

      // Ajouter un message assistant vide qui va se remplir en streaming
      const assistantId = uuidv4();
      messages = [...messages, {
        id: assistantId, role: 'assistant',
        content: '', timestamp: new Date(),
        isStreaming: true
      }];

      try {
        const token = typeof localStorage !== 'undefined'
          ? localStorage.getItem('benin_token') : null;

        const res = await fetch('/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ message: content, sessionId, langue })
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let   buffer  = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? ''; // garder le fragment incomplet

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.text) {
                // Ajouter le token au message assistant en cours
                messages = messages.map(m =>
                  m.id === assistantId
                    ? { ...m, content: m.content + data.text }
                    : m
                );
              }

              if (data.error) {
                messages = messages.map(m =>
                  m.id === assistantId
                    ? { ...m, content: data.error, isError: true, isStreaming: false }
                    : m
                );
              }

              if (data.done) {
                messages = messages.map(m =>
                  m.id === assistantId ? { ...m, isStreaming: false } : m
                );
                if (!isOpen) hasNewMessage = true;
              }
            } catch { /* ligne SSE mal formée, on ignore */ }
          }
        }

      } catch (err) {
        messages = messages.map(m =>
          m.id === assistantId
            ? { ...m, content: "Désolé, je rencontre un problème technique. Réessayez dans un instant.", isError: true, isStreaming: false }
            : m
        );
      } finally {
        isLoading = false;
        // S'assurer que isStreaming est bien désactivé
        messages = messages.map(m =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        );
      }
    },

    clearHistory() {
      messages = [];
      sessionId = uuidv4();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('benin_chat_session', sessionId);
      }
    }
  };
})();
