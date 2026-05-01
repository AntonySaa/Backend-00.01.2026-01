import axios from "axios";

// ── Fallback simulado (sin API key) ──────────────────────────────────────────
const FALLBACK_RULES: Array<{ match: RegExp; reply: string }> = [
  { match: /hola|buenas|hey|hi\b/i, reply: "¡Hola! ¿En qué te puedo ayudar?" },
  { match: /cómo estás|como estas|qué tal/i, reply: "¡Muy bien, gracias por preguntar! ¿Y tú?" },
  { match: /ayuda|help/i, reply: "Claro, dime qué necesitas y haré lo posible." },
  { match: /gracias|thanks/i, reply: "¡De nada! Aquí estoy si necesitas algo más." },
  { match: /chiste|broma|joke/i, reply: "¿Por qué los programadores prefieren el oscuro? Porque la luz atrae bugs. 🐛" },
  { match: /hora|tiempo|fecha/i, reply: `Son las ${new Date().toLocaleTimeString("es")} del ${new Date().toLocaleDateString("es")}.` },
  { match: /quién eres|who are you/i, reply: "Soy el asistente de chat. Puedo responder preguntas básicas." },
  { match: /socket/i, reply: "Socket.io permite comunicación en tiempo real entre cliente y servidor." },
  { match: /mongodb|mongo/i, reply: "MongoDB es una base de datos NoSQL orientada a documentos. Usamos Mongoose como ODM." },
  { match: /node|express/i, reply: "Este proyecto usa Node.js con Express 5 y TypeScript." },
];

function fallbackReply(text: string): string {
  for (const rule of FALLBACK_RULES) {
    if (rule.match.test(text)) return rule.reply;
  }
  return `Recibí tu mensaje: "${text.slice(0, 60)}". No tengo API key configurada, pero puedo responder preguntas básicas.`;
}

// ── Bot principal ─────────────────────────────────────────────────────────────
export const askBot = async (userMessage: string): Promise<string> => {
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim();

  // Sin claves → fallback
  if (!openaiKey && !deepseekKey) {
    return fallbackReply(userMessage);
  }

  const useDeepSeek = !!deepseekKey && !openaiKey;
  const apiKey = useDeepSeek ? deepseekKey : openaiKey;
  const url = useDeepSeek
    ? "https://api.deepseek.com/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = useDeepSeek ? "deepseek-chat" : "gpt-4o-mini";

  try {
    const response = await axios.post(
      url,
      {
        model,
        messages: [
          { role: "system", content: "Eres un asistente de chat conciso. Responde en el idioma del usuario. Máximo 2 oraciones." },
          { role: "user", content: userMessage },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        timeout: 12000,
      },
    );
    return response.data.choices?.[0]?.message?.content?.trim() || fallbackReply(userMessage);
  } catch (err: any) {
    console.error("[bot] API error:", err?.response?.status, err?.message);
    return fallbackReply(userMessage);   // siempre responde algo
  }
};

// Compatibilidad con código existente
export const improveDescription = async (description: string): Promise<string> => {
  return askBot(`Mejora esta descripción sin agregar info nueva: "${description}"`);
};
