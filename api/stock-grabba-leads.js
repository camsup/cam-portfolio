function clean(value, max = 500) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const token = clean(req.query?.token, 200);
  if (token.length < 20) return res.status(400).json({ ok: false, error: 'missing_token' });

  const type = clean(req.query?.type, 32) || 'STOCKING_LEAD';
  if (!['STOCKING_LEAD', 'CURRENT_STOCK', 'NO_STOCK', 'PRANK_TEST'].includes(type)) {
    return res.status(400).json({ ok: false, error: 'invalid_type' });
  }

  const retailer = clean(req.query?.retailer, 80);
  const prankMessage = String(req.query?.message ?? '').slice(0, 3500);
  const store = clean(req.query?.store, 140);
  const product = clean(req.query?.product, 180) ||
    (type === 'NO_STOCK' ? 'No qualifying sealed Pokémon stock detected' : '');
  const details = clean(req.query?.details, 900);
  const source = clean(req.query?.source, 600);

  if (!retailer || !store || !product || !details || !/^https:\/\//.test(source)) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }

  const title = type === 'PRANK_TEST'
    ? '🚨 CURRENT STOCK — ' + retailer.toUpperCase() + ' 🚨'
    : type === 'CURRENT_STOCK'
      ? '🚨 CURRENT STOCK — ' + retailer
      : type === 'NO_STOCK'
        ? '💀 NO STOCK — ' + retailer
        : '🔥 STOCKING LEAD — ' + retailer;

  if (type === 'PRANK_TEST' && !/TROLL ALERT — THIS INVENTORY IS COMPLETELY MADE UP/i.test(prankMessage)) {
    return res.status(400).json({ ok: false, error: 'prank_disclosure_required' });
  }

  const statusLine = type === 'PRANK_TEST'
    ? ''
    : type === 'CURRENT_STOCK'
      ? '✅ Verified current-stock evidence. Check source before driving.'
    : type === 'NO_STOCK'
      ? '🐀 Scalper rats smoked this hoe. Waiting for new stock.'
      : '⚠️ Stocking lead — not confirmed shelf quantity.';

  const embed = {
    title,
    description: type === 'PRANK_TEST' ? prankMessage : [
      '**' + product + '**',
      '**Store:** ' + store,
      details,
      '',
      statusLine,
      '',
      '🔗 **Product/source page:** ' + source
    ].join('\n'),
    url: source,
    footer: { text: 'Pokémon Stock Grabba • Parma 44129' },
    timestamp: new Date().toISOString()
  };

  if (req.query?.dry === '1') {
    return res.status(200).json({ ok: true, dryRun: true, type, retailer, store, product, statusLine });
  }

  const webhook = webhookUrl
    ? webhookUrl + (webhookUrl.includes('?') ? '&wait=true' : '?wait=true')
    : 'https://discord.com/api/webhooks/1552482750747906048/' + token + '?wait=true';

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ allowed_mentions: { parse: [] }, embeds: [embed] })
    });

    const text = await response.text();
    let parsed = {};
    try { parsed = JSON.parse(text); } catch {}

    if (!response.ok) {
      return res.status(502).json({ ok: false, error: 'discord_http', status: response.status });
    }
    if (typeof parsed.id !== 'string') {
      return res.status(502).json({ ok: false, error: 'discord_confirmation_missing' });
    }

    return res.status(200).json({ ok: true, messageId: parsed.id, type });
  } catch {
    return res.status(500).json({ ok: false, error: 'relay_error' });
  }
}
