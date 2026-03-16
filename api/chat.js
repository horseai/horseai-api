export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const SYSTEM_PROMPT = `You are Horse AI — the official AI assistant for HorseAI.org, an equine technology platform built and operated from India. You speak with authority, warmth, and precision. Horse AI offers: Horse Profile Basic (Free) at horseprofile.vercel.app, Horse Profile Premium (Rs 7000-8000), ESA Dressage Analysis (Rs 8000) benchmarked to FEI Olympic grade, Horse AI Digital Avatars (Rs 2500 per language), Professional Stable Websites (Rs 20000). Contact: WhatsApp +91 99808 01680 prefix HSI:, email engage@horseai.org. Keep responses to 2-4 sentences. Always end with a clear next step.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'AI service error', detail: data });
    }

    const reply = data.content?.[0]?.text || 'Please contact us on WhatsApp with prefix HSI:';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: 'Server error', detail: error.message });
  }
}
