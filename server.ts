import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';
import { SYSTEM_INSTRUCTION_AMIT_PA } from './src/data/aiPersona';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const server = http.createServer(app);

// Lazy Gemini client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY is not set in environment.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AS Realty AI Concierge & PA to Amit Sir',
    streaming: true,
    timestamp: new Date().toISOString(),
  });
});

// HTTP Streaming Chat endpoint (Vercel Serverless / Edge & Express compatible)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, propertyContext } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in environment variables.',
      });
    }

    let prompt = message;
    if (propertyContext) {
      prompt = `[Current Property Viewed by Client: "${propertyContext}"]\n\nClient Inquiry: ${message}`;
    }

    // Build chat contents
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

    // Set streaming HTTP headers
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
    console.error('[API Chat Streaming Error]:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: error?.message || 'Failed to stream inquiry with Amit Sir’s PA.',
      });
    } else {
      res.write(`\n\n[Error: ${error?.message || 'Stream interrupted'}]`);
      res.end();
    }
  }
});

// ============================================================================
// WebSocket Server for Live Voice Conversations (gemini-3.1-flash-live-preview)
// ============================================================================
const wss = new WebSocketServer({ server, path: '/api/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Live API] Client connected to live voice WebSocket');

  const ai = getGeminiClient();
  if (!ai) {
    clientWs.send(
      JSON.stringify({
        type: 'error',
        message: 'GEMINI_API_KEY is not configured on the server. Please check environment variables.',
      })
    );
    clientWs.close();
    return;
  }

  let session: any = null;
  let isClosing = false;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' }, // Professional executive tone
          },
        },
        systemInstruction: `${SYSTEM_INSTRUCTION_AMIT_PA}
IMPORTANT: You are on a real-time live two-way voice call. You MUST speak in polite, natural, executive HINGLISH (conversational Hindi-English blend). Introduce yourself briefly as Aryan, Amit Sir's Personal Assistant at AS Realty Nagpur. Keep your voice responses concise, warm, and around 2 to 3 sentences so the conversation flows seamlessly like a natural phone call.`,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (isClosing || clientWs.readyState !== WebSocket.OPEN) return;

          // Check for audio output (model audio is 24kHz raw PCM little-endian)
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }

          // Check if interrupted by user
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
          }

          // Check for text transcripts
          const parts = message.serverContent?.modelTurn?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.text) {
                clientWs.send(JSON.stringify({ type: 'text', text: part.text }));
              }
            }
          }
        },
        onerror: (err: any) => {
          console.error('[Live API Session Error]:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                type: 'error',
                message: err?.message || 'Live audio session encountered an error',
              })
            );
          }
        },
        onclose: () => {
          console.log('[Live API] Gemini Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'session_closed' }));
          }
        },
      },
    });

    clientWs.send(
      JSON.stringify({
        type: 'ready',
        message: 'Live voice connection established with Amit Sir’s Executive PA.',
      })
    );
  } catch (err: any) {
    console.error('[Live API Connection Failed]:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          message: err?.message || 'Failed to initialize Gemini Live voice session.',
        })
      );
      clientWs.close();
    }
    return;
  }

  // Handle client audio / messages from browser
  clientWs.on('message', (raw) => {
    if (!session) return;
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === 'audio' && data.audio) {
        // Send PCM 16kHz audio data to Gemini Live API
        session.sendRealtimeInput({
          audio: {
            data: data.audio,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      } else if (data.type === 'text' && data.text) {
        session.sendRealtimeInput({
          text: data.text,
        });
      }
    } catch (e) {
      console.error('[Live API] Failed to parse client message:', e);
    }
  });

  clientWs.on('close', () => {
    console.log('[Live API] Client disconnected from WebSocket');
    isClosing = true;
    if (session) {
      try {
        session.close();
      } catch (e) {
        // ignore
      }
    }
  });

  clientWs.on('error', (err) => {
    console.error('[Live API Client WebSocket Error]:', err);
  });
});

// Vite middleware in dev or static serving in production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`AS Realty Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
});
