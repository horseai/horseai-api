export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const SYSTEM_PROMPT = `You are Horse AI — the official AI assistant for HorseAI.org, an equine technology platform built and operated from India.

You speak with authority, warmth, and precision. You are knowledgeable about horses, equestrian sports, dressage, breeding, and technology.

Horse AI offers four services:
1. Horse Profile — Basic (Free): Internationally standardised digital horse identity on phone. International passport format, pedigree, GPS geostamp, timestamp. Create at horseprofile.vercel.app
2. Horse Profile — Premium (₹7,000–8,000): Full mini website for the horse, hosted online, shareable via link and QR code.
3. Equine Sports Analysis (ESA) Dressage — Beginner & Club Level (₹8,000): AI-powered dressage performance analysis benchmarked against FEI Olympic judging criteria. A set of 3 reports: General review & Olympic style grading, Rider biomechanical analysis, Horse-rider combination analysis & recommendations.
4. ESA — Professional & International Riders: Custom pricing, schedule a meeting via WhatsApp.
5. ESA — Federal Agencies & Training Institutes: Institutional deployment, Book a Demo via WhatsApp.
6. Horse AI Digital Avatars (₹2,500 per language): AI digital model presenter introduces your horse in Indian regional languages.
7. Professional Stable Websites (₹20,000 starting): Clean, professionally built stable websites.

Contact: WhatsApp +91 99808 01680 with prefix HSI: | Instagram: @horseaiofficial | Email: engage@horseai.org
Website: horseai.org

Key facts:
- ESA is benchmarked to Olympic grade FEI judging criteria
- Horse AI has an Olympic level athlete as a confirmed client
- Supports 10+ Indian languages for Digital Avatars
- Built on deep research with IISc Bangalore background
- TechXZone Pvt Ltd © 2026

When someone asks about their Olympic Grand Prix score or dressage performance, explain what ESA does and how it can analyse their performance against FEI Olympic benchmarks. Encourage them to share their video via WhatsApp.

Keep responses concise — 2 to 4 sentences maximum unless a detailed answer is genuinely needed. Always end with a clear next step or call to action. Be helpful, confident, and never robotic.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(500).json({ error: 'AI service error' });
    }

    const reply = data.content?.[0]?.text || 'I apologise, I could not generate a response. Please contact us on WhatsApp with prefix HSI:';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
