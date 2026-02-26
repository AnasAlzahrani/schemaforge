// Vercel serverless function — captures lead emails
// Stores to Supabase leads table via REST API

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { email, source } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: email.split('@')[0],
          email,
          source: source || 'checklist',
          service: 'schemaforge',
          status: 'new',
          created_at: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error('Supabase insert failed:', e);
    }
  }

  // Always return success to not block UX
  res.status(200).json({ ok: true });
}
