export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'notice',
    message:
      'Vercel Serverless Functions do not support persistent stateful WebSockets. For live audio WebSockets with gemini-3.1-flash-live-preview, run the dedicated websocket-server.ts on Railway, Render, Fly.io, or Cloud Run, and set VITE_WEBSOCKET_URL in your Vercel environment variables. The AS Realty frontend automatically uses intelligent Voice Fallback Mode via /api/chat when WebSockets are unavailable.',
    recommendedWebsocketServer: 'websocket-server.ts',
    voiceFallbackAvailable: true,
  });
}
