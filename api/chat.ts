import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION_AMIT_PA } from '../src/data/aiPersona';

export const config = {
  maxDuration: 60,
};

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Edge & Web Standard handler for Vercel
export async function POST(req: Request): Promise<Response> {
  try {
    const { message, history, propertyContext } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY is not configured in Vercel environment variables. Please add GEMINI_API_KEY in Vercel Project Settings > Environment Variables.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let prompt = message;
    if (propertyContext) {
      prompt = `[Current Property Viewed by Client: "${propertyContext}"]\n\nClient Inquiry: ${message}`;
    }

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-8)) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_AMIT_PA,
        temperature: 0.7,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: any) {
    console.error('[Vercel Edge POST Error]:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to stream inquiry with Amit Sir’s PA.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Node.js Serverless fallback for Vercel
export default async function handler(req: any, res: any) {
  // If invoked with modern Web Request
  if (req instanceof Request || (req && !res && typeof req.json === 'function')) {
    return POST(req as Request);
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, history, propertyContext } = req.body || {};
    if (!message) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in Vercel environment variables.',
      });
      return;
    }

    let prompt = message;
    if (propertyContext) {
      prompt = `[Current Property Viewed by Client: "${propertyContext}"]\n\nClient Inquiry: ${message}`;
    }

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-8)) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_AMIT_PA,
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }

    res.end();
  } catch (error: any) {
    console.error('[Vercel Serverless Error]:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || 'Streaming failed' });
    } else {
      res.write(`\n\n[Error: ${error?.message || 'Stream interrupted'}]`);
      res.end();
    }
  }
}
