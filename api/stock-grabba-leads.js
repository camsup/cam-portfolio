export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  const token = req.query?.token;
  if (typeof token !== 'string' || token.length < 20) {
    return res.status(400).json({ ok: false, error: 'missing_token' });
  }

  const webhook = 'https://discord.com/api/webhooks/1552482750747906048/' + token + '?wait=true';
  const body = {
    allowed_mentions: { parse: [] },
    embeds: [{
      title: '🔥 STOCK GRABBA — OCT. 2 PARMA DROP LEADS',
      description: [
        '**TARGET PARMA — 6850 Ridge Rd**',
        'Target official: Pokémon x Target restock Friday, 10/2 — Drop 2. Opens 8 AM. **Highest priority.**',
        '',
        '**GAMESTOP PARMA — 6652 Ridge Rd**',
        'GameStop confirms 30th Celebration Booster Bundles, Binder Collection & Mini Tins release 10/2/2026. Opens 10 AM. Local allocation not yet proven.',
        '',
        '**BEST BUY PARMA #162 — 7400 Brookpark Rd**',
        'Best Buy says stores nationwide carry new 30th Celebration products as released, including ETB, Poster Collection & Tech Sticker Collection. Opens 10 AM. Exact 10/2 allocation not yet confirmed.',
        '',
        '**FIVE BELOW PARMA**',
        '7831 W Ridgewood Dr + 1091 W Pleasant Valley Rd. Secondary watch; no authoritative 10/2 allocation proof yet.',
        '',
        '⚠️ STOCKING LEADS, not confirmed shelf quantities. Grabba will keep hunting live inventory.'
      ].join('\n'),
      url: 'https://www.target.com/c/-/N-4yka5Zq643le51vt3',
      footer: { text: 'Pokémon Stock Grabba • Parma 44129' }
    }]
  };

  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });

  const text = await response.text();
  let parsed = {};
  try { parsed = JSON.parse(text); } catch {}
  if (!response.ok || typeof parsed.id !== 'string') {
    return res.status(502).json({ ok: false, status: response.status });
  }
  return res.status(200).json({ ok: true, messageId: parsed.id });
}
