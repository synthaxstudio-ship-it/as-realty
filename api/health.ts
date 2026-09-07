export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    service: 'AS Realty AI Concierge & PA on Vercel Serverless',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    supabaseConfigured: !!process.env.SUPABASE_URL || !!process.env.VITE_SUPABASE_URL,
    timestamp: new Date().toISOString(),
  });
}
