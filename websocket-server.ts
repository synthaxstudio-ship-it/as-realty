/**
 * AS Realty - Dedicated Standalone WebSocket Server for Gemini Live API
 * 
 * Deployment Instructions:
 * - Deploy to Render, Railway, Fly.io, or Cloud Run (services that support persistent WebSockets)
 * - Set environment variable: GEMINI_API_KEY
 * - In Vercel frontend, set: VITE_WEBSOCKET_URL=wss://your-websocket-service.railway.app/api/live
 */

import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';
import { SYSTEM_INSTRUCTION_AMIT_PA } from './src/data/aiPersona.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'healthy',
        service: 'AS Realty Dedicated Gemini Live WebSocket Server',
        websocketEndpoint: '/api/live',
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server, path: '/api/live' });

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[WebSocket Server] GEMINI_API_KEY is not set in environment.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build-ws',
      },
    },
  });
}

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Live API] Client connected to live voice WebSocket');

  const ai = getGeminiClient();
  if (!ai) {
    clientWs.send(
      JSON.stringify({
        type: 'error',
        message: 'GEMINI_API_KEY is not configured on the WebSocket server. Please check environment variables.',
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
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
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

  clientWs.on('message', (raw) => {
    if (!session) return;
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === 'audio' && data.audio) {
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
      } catch (e) {}
    }
  });

  clientWs.on('error', (err) => {
    console.error('[Live API Client WebSocket Error]:', err);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`AS Realty Dedicated WebSocket Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://0.0.0.0:${PORT}/api/live`);
});
