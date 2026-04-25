const provider = (process.env.BOT_PROVIDER || 'mock').toLowerCase();

function buildMockReply(userText) {
  const normalized = userText.toLowerCase();

  if (normalized.includes('hola')) {
    return 'Hola, soy el bot del chat. ¿En qué te ayudo?';
  }

  if (normalized.includes('node') || normalized.includes('socket')) {
    return 'Tip: separa servidor, repositorio y cliente para que tu proyecto sea más fácil de mantener.';
  }

  return `Mensaje recibido: "${userText}". Si configuras una API KEY, podré responder con IA real.`;
}

async function callOpenAICompatible({ baseUrl, apiKey, model, userText }) {
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente breve para un chat universitario. Responde en español con claridad y máximo 3 oraciones.',
        },
        { role: 'user', content: userText },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('La API no devolvió contenido en choices[0].message.content');
  }

  return content.trim();
}

async function generateBotReply(userText) {
  if (provider === 'mock') {
    return buildMockReply(userText);
  }

  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    if (!apiKey) {
      return 'Falta OPENAI_API_KEY en .env. Estoy respondiendo en modo seguro.';
    }

    return callOpenAICompatible({ baseUrl, apiKey, model, userText });
  }

  if (provider === 'deepseek') {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

    if (!apiKey) {
      return 'Falta DEEPSEEK_API_KEY en .env. Estoy respondiendo en modo seguro.';
    }

    return callOpenAICompatible({ baseUrl, apiKey, model, userText });
  }

  return 'Proveedor de bot no reconocido. Usa BOT_PROVIDER=mock|openai|deepseek.';
}

module.exports = {
  generateBotReply,
};
