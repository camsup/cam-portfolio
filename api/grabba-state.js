const MODES = [
  { mode: 'microcenter_search', retailer: 'Micro Center', store: 'Mayfield Heights', kind: 'big_box', sourceLabel: 'first-party store search' },
  { mode: 'target_30th', retailer: 'Target', store: 'Parma / Cleveland watch', kind: 'big_box', sourceLabel: 'first-party product/search page' },
  { mode: 'bestbuy_30th', retailer: 'Best Buy', store: 'Parma / Cleveland watch', kind: 'big_box', sourceLabel: 'first-party product/search page' },
  { mode: 'walmart_30th', retailer: 'Walmart', store: 'Cleveland-area watch', kind: 'big_box', sourceLabel: 'first-party search page' },
  { mode: 'gamestop_parma', retailer: 'GameStop', store: 'Parma store watch', kind: 'big_box', sourceLabel: 'first-party store search' },
  { mode: 'cvs_pokemon', retailer: 'CVS', store: 'Parma / Cleveland watch', kind: 'big_box', sourceLabel: 'first-party search page' },
  { mode: 'geekpeek_shopify', retailer: 'The Geek Peek', store: 'Cleveland', kind: 'local_online', sourceLabel: 'first-party Shopify catalog' },
  { mode: 'gamershaven_shopify', retailer: 'Gamers Haven', store: 'Ohio', kind: 'local_online', sourceLabel: 'first-party Shopify catalog' },
  { mode: 'superscript_shopify', retailer: 'Superscript Comics', store: 'Lakewood', kind: 'local_online', sourceLabel: 'first-party Shopify catalog' },
  { mode: 'marzcardz_shopify', retailer: 'Marzcardz', store: 'Brunswick', kind: 'local_online', sourceLabel: 'first-party Shopify catalog' },
  { mode: 'fullgrip_shopify', retailer: 'Full Grip Games', store: 'Akron', kind: 'local_online', sourceLabel: 'first-party Shopify catalog' }
];

function cleanText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function displayName(value) {
  return String(value ?? '').replace(/pitch black/gi, 'Peanut Butter');
}

function classify(meta, data) {
  if (!data || data.ok !== true) {
    return { status: 'ERROR', confidence: 'LOW', detail: data?.error || 'probe failed' };
  }
  if (data.blocked || /\/blocked(?:\?|$)/i.test(String(data.finalUrl || '')) || Number(data.retailerStatus) === 403) {
    return { status: 'BLOCKED', confidence: 'LOW', detail: 'Retailer blocked the public probe.' };
  }
  if (Number(data.retailerStatus) >= 400) {
    return { status: 'ERROR', confidence: 'LOW', detail: 'First-party endpoint returned HTTP ' + data.retailerStatus + '.' };
  }

  if (meta.mode === 'microcenter_search') {
    const text = (data.snippets || []).map(x => x.text || '').join(' ');
    const m = text.match(/(\d+)\s+in stock/i);
    const storeBound = /mayfield heights/i.test(text) || /storeid=051/i.test(String(data.finalUrl || ''));
    if (m && storeBound) {
      return { status: 'CURRENT_STOCK', confidence: 'HIGH', quantity: Number(m[1]), detail: 'Exact first-party store-bound count detected.' };
    }
    return { status: 'UNKNOWN', confidence: 'MEDIUM', detail: 'First-party page reached, but no exact Mayfield quantity was proven.' };
  }

  if (meta.kind === 'local_online') {
    const products = Array.isArray(data.products) ? data.products : [];
    const available = products.filter(p => p.available === true);
    if (available.length) {
      return {
        status: 'ONLINE_AVAILABLE',
        confidence: 'MEDIUM',
        detail: available.length + ' desirable sealed product listing(s) available online.',
        products: available.slice(0, 12).map(p => ({
          title: displayName(p.title),
          rawTitle: p.title,
          url: p.url,
          price: p.minAvailablePrice,
          availableVariantCount: p.availableVariantCount
        }))
      };
    }
    return { status: 'WATCHING_EMPTY', confidence: 'MEDIUM', detail: 'Catalog reached; no qualifying available sealed listings found.' };
  }

  return {
    status: 'UNKNOWN',
    confidence: 'MEDIUM',
    detail: 'First-party page reached. No store-bound quantity proof, so Grabba refuses to call it current stock.'
  };
}

async function probe(base, meta) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000);
  try {
    const r = await fetch(base + '/api/grabba-probe?mode=' + encodeURIComponent(meta.mode), {
      headers: { 'user-agent': 'StockGrabba-ControlRoom/1.0' },
      signal: controller.signal
    });
    const data = await r.json().catch(() => ({ ok: false, error: 'invalid_json' }));
    const c = classify(meta, data);
    return {
      ...meta,
      ...c,
      retailerStatus: data.retailerStatus ?? null,
      sourceUrl: data.finalUrl || null,
      checkedAt: new Date().toISOString()
    };
  } catch (e) {
    return {
      ...meta,
      status: 'ERROR',
      confidence: 'LOW',
      detail: e?.name === 'AbortError' ? 'Probe timed out.' : cleanText(e?.message || e),
      sourceUrl: null,
      checkedAt: new Date().toISOString()
    };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = proto + '://' + host;

  const rows = await Promise.all(MODES.map(meta => probe(base, meta)));
  const counts = rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=240');
  return res.status(200).json({
    ok: true,
    name: 'Pokemon Stock Grabba Control Room',
    generatedAt: new Date().toISOString(),
    rules: {
      noFakeBaselines: true,
      missingDataIsNotOutOfStock: true,
      bigBoxRequiresStoreBoundEvidence: true
    },
    counts,
    rows
  });
}
