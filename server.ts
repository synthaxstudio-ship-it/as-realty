import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { SYSTEM_INSTRUCTION_AMIT_PA } from './src/data/aiPersona';
import { PROPERTIES } from './src/data/properties';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const server = http.createServer(app);

// Supabase Configuration
const SUPABASE_PROJECT_ID = 'dpadpxnkrvsntbruwohp';

function normalizeSupabaseUrl(rawUrl?: string | null): string {
  const FALLBACK = 'https://dpadpxnkrvsntbruwohp.supabase.co';
  if (!rawUrl || typeof rawUrl !== 'string') return FALLBACK;
  let cleaned = rawUrl.trim().replace(/^["']|["']$/g, '');
  if (!cleaned) return FALLBACK;
  if (/^[a-z0-9]{15,30}$/i.test(cleaned)) return `https://${cleaned}.supabase.co`;
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) cleaned = `https://${cleaned}`;
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.origin;
  } catch (e) {
    // fallback
  }
  return FALLBACK;
}

const SUPABASE_URL = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY?.trim().replace(/^["']|["']$/g, '') ||
  'sb_publishable_pWOhSjHo80ibN7z_kZSr_Q_Pb-En6E1';

let supabaseClient: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      });
    } catch (err) {
      console.warn('[Server Supabase] Primary client init error, using fallback:', err);
      supabaseClient = createClient('https://dpadpxnkrvsntbruwohp.supabase.co', 'sb_publishable_pWOhSjHo80ibN7z_kZSr_Q_Pb-En6E1', {
        auth: { persistSession: false },
      });
    }
  }
  return supabaseClient;
}

// In-memory fallback buffers in case tables are pending creation
const inMemoryBookings: any[] = [];
const inMemoryInquiries: any[] = [];

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
    supabase: {
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      status: 'configured',
    },
    streaming: true,
    timestamp: new Date().toISOString(),
  });
});

// Supabase Status & Connection check
app.get('/api/supabase/status', async (req, res) => {
  try {
    const sb = getSupabase();
    // Test connection with a lightweight probe
    const { error } = await sb.from('bookings').select('id').limit(1);

    res.json({
      status: 'connected',
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      tableBookings: error ? (error.code === 'PGRST205' ? 'pending_schema' : 'accessible') : 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.json({
      status: 'configured',
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      notice: err?.message,
    });
  }
});

// Supabase: VIP Site Visit Bookings Endpoint
app.post('/api/bookings', async (req, res) => {
  const { full_name, phone, property_name, booking_date, booking_time, notes } = req.body || {};
  if (!full_name || !property_name) {
    return res.status(400).json({ error: 'full_name and property_name are required' });
  }

  const record = {
    id: `booking-${Date.now()}`,
    full_name,
    phone: phone || '',
    property_name,
    booking_date: booking_date || new Date().toISOString().split('T')[0],
    booking_time: booking_time || '11:00 AM',
    notes: notes || '',
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  inMemoryBookings.unshift(record);

  try {
    const sb = getSupabase();
    const { data, error } = await sb.from('bookings').insert([record]).select();

    if (error) {
      console.warn('[Supabase Bookings Insert Note]:', error.message);
      return res.status(200).json({
        success: true,
        persisted: 'buffered',
        note: error.message,
        data: record,
      });
    }

    return res.status(200).json({ success: true, persisted: 'supabase', data: data?.[0] || record });
  } catch (e: any) {
    return res.status(200).json({
      success: true,
      persisted: 'buffered',
      data: record,
    });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from('bookings').select('*').order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return res.json({ success: true, data });
    }
  } catch (e) {
    // fallback
  }

  return res.json({ success: true, data: inMemoryBookings });
});

// Supabase: Client Advisory Inquiries Endpoint
app.post('/api/inquiries', async (req, res) => {
  const { name, phone, email, interest, message, source } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const record = {
    id: `inquiry-${Date.now()}`,
    name,
    phone: phone || '',
    email: email || '',
    interest: interest || 'General Advisory',
    message: message || '',
    source: source || 'Website Advisory Form',
    created_at: new Date().toISOString(),
  };

  inMemoryInquiries.unshift(record);

  try {
    const sb = getSupabase();
    const { data, error } = await sb.from('inquiries').insert([record]).select();

    if (error) {
      console.warn('[Supabase Inquiries Insert Note]:', error.message);
      return res.status(200).json({
        success: true,
        persisted: 'buffered',
        note: error.message,
        data: record,
      });
    }

    return res.status(200).json({ success: true, persisted: 'supabase', data: data?.[0] || record });
  } catch (e: any) {
    return res.status(200).json({
      success: true,
      persisted: 'buffered',
      data: record,
    });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from('inquiries').select('*').order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return res.json({ success: true, data });
    }
  } catch (e) {
    // fallback
  }

  return res.json({ success: true, data: inMemoryInquiries });
});

// Supabase: Properties Catalog Endpoint
app.get('/api/properties', async (req, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from('properties').select('*');

    if (!error && Array.isArray(data) && data.length > 0) {
      return res.json({ success: true, source: 'supabase', data });
    }
  } catch (e) {
    // fallback
  }

  return res.json({ success: true, source: 'catalog', data: PROPERTIES });
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
