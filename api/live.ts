export const config = {
  runtime: 'edge', // This forces Vercel to use the ultra-fast Edge runtime
};

export default async function handler(req: Request) {
  // 1. Get the Google AI Studio API Key safely from Vercel's environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  const geminiWsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

  // 2. Establish the secure bridge to Google
  try {
    const response = await fetch(geminiWsUrl, {
      headers: req.headers,
    });

    return response;
  } catch (error) {
    return new Response('Failed to connect to Google Live Stream', { status: 500 });
  }
}
