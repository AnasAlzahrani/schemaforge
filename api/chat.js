export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { messages, stream } = await req.json();
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'Messages array required' }), { status: 400 });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ error: 'API not configured' }), { status: 500 });
  }

  // Convert OpenAI-style messages to Gemini format
  const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
  const chatMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

  const body = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: chatMessages,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4000,
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ]
  };

  try {
    if (stream) {
      // Streaming response via Gemini streamGenerateContent
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok) {
        const err = await resp.text();
        return new Response(JSON.stringify({ error: err }), { status: 500 });
      }

      // Forward the SSE stream
      return new Response(resp.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming (backward compat)
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const data = await resp.json();
      if (data.error) {
        return new Response(JSON.stringify({ error: data.error.message }), { status: 500 });
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Couldn\'t generate a response. Please try again.';
      return new Response(JSON.stringify({ reply }));
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
