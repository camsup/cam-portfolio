const targets = {
  gamestop_parma: 'https://www.gamestop.com/search/?q=Pokemon%2030th%20Celebration&store=0827',
  target_30th: 'https://www.target.com/c/-/N-4yka5Zq643le51vt3',
  bestbuy_30th: 'https://www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=Pokemon+TCG+30th+Celebration',
  microcenter_poster: 'https://www.microcenter.com/product/715609/nintendo-pokemon-tcg-30th-celebration-poster-collection?storeid=029',
  microcenter_search: 'https://www.microcenter.com/search/search_results.aspx?Ntt=Pokemon+30th+Celebration&storeid=029',
  walmart_30th: 'https://www.walmart.com/search?q=Pokemon+30th+Celebration',
  cvs_pokemon: 'https://www.cvs.com/search?searchTerm=Pokemon',
  cardsintheland_shopify: 'https://cardsintheland.com/products.json?limit=250',
  geekpeek_shopify: 'https://www.thegeekpeek.com/products.json?limit=250',
  gamershaven_shopify: 'https://gamershavenohio.shop/products.json?limit=250',
  superscript_shopify: 'https://www.superscriptohio.com/products.json?limit=250',
  marzcardz_shopify: 'https://marzcardz.shop/products.json?limit=250',
  sweetsgeeks_shopify: 'https://sweets-and-geeks.myshopify.com/products.json?limit=250',
  rozaypoke_shopify: 'https://shiprozaypoke.com/products.json?limit=250',
  empire_shopify: 'https://empiregamecenter.com/products.json?limit=250',
  fullgrip_shopify: 'https://fullgripgames.com/products.json?limit=250'
};

const terms = [
  '30th Celebration','Elite Trainer Box','Booster Bundle','Mini Tin','Poster Collection',
  'Tech Sticker','Knock Out','In Stock','IN STOCK','Sold Out','SOLD OUT','Out of Stock',
  'Pickup','pick up','Add to cart','Add To Cart','Coming Soon','Mayfield Heights','Parma'
];

function strip(s) {
  return s.replace(/<script[\s\S]*?<\/script>/gi,' ')
    .replace(/<style[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;/g,' ')
    .replace(/&amp;/g,'&')
    .replace(/&#x27;/g,"'")
    .replace(/&quot;/g,'"')
    .replace(/\s+/g,' ')
    .trim();
}

export default async function handler(req, res) {
  const mode = String(req.query?.mode || '');
  const url = targets[mode];
  if (!url) return res.status(400).json({ ok:false, error:'invalid_mode' });

  try {
    const r = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9'
      },
      redirect: 'follow'
    });
    const html = await r.text();

    if (mode.endsWith('_shopify')) {
      let parsed = {};
      try { parsed = JSON.parse(html); } catch {
        return res.status(200).json({ ok:true, mode, retailerStatus:r.status, finalUrl:r.url, parseError:true, products:[] });
      }
      const host = new URL(url).origin;
      const pokemonSignal = /(pokemon|pokémon|perfect order|chaos rising|pitch black|prismatic evolutions|destined rivals|black bolt|white flare|surging sparks|journey together|ascended heroes|30th celebration|first partner illustration|mega evolution|delta reign|phantasmal flames)/i;
      const wanted = /(elite trainer|\betb\b|booster|bundle|tin|collection|box|pack|blister|poster|tech sticker|premium|knock out|first partner|30th|mega evolution|chaos rising|pitch black|perfect order|delta reign)/i;
      const junk = /(blind pack|figure series|leisure time|plush|funko|binder page|deck box|playmat|card sleeve|toploader|single card|\bpsa\b|\bcgc\b|graded)/i;
      const pokemonOnlyStore = mode === 'rozaypoke_shopify';
      const products = (parsed.products || [])
        .filter(p => {
          const hay = String(p.title || '') + ' ' + String(p.tags || '');
          return (pokemonOnlyStore || pokemonSignal.test(hay)) && wanted.test(String(p.title || '')) && !junk.test(String(p.title || ''));
        })
        .map(p => {
          const variants = Array.isArray(p.variants) ? p.variants : [];
          const availableVariants = variants.filter(v => v.available === true);
          const prices = availableVariants.map(v => Number(v.price)).filter(Number.isFinite);
          return {
            id:p.id,
            title:p.title,
            handle:p.handle,
            url: host + '/products/' + p.handle,
            available: availableVariants.length > 0,
            availableVariantCount: availableVariants.length,
            minAvailablePrice: prices.length ? Math.min(...prices) : null,
            tags:p.tags || []
          };
        })
        .slice(0,120);
      return res.status(200).json({ ok:true, mode, retailerStatus:r.status, finalUrl:r.url, products });
    }

    const plain = strip(html);
    const lower = plain.toLowerCase();
    const snippets = [];
    for (const term of terms) {
      const idx = lower.indexOf(term.toLowerCase());
      if (idx >= 0) {
        const snippet = plain.slice(Math.max(0, idx - 180), Math.min(plain.length, idx + 520));
        if (!snippets.some(x => x.text === snippet)) snippets.push({ term, text: snippet });
      }
    }
    const priceMatches = [...plain.matchAll(/\$\d{1,3}(?:\.\d{2})?/g)].slice(0,30).map(m=>m[0]);
    return res.status(200).json({
      ok:true, mode, retailerStatus:r.status, finalUrl:r.url,
      blocked:/cloudflare|sorry, you have been blocked|attention required/i.test(plain),
      snippets:snippets.slice(0,24),
      prices:[...new Set(priceMatches)]
    });
  } catch (e) {
    return res.status(500).json({ok:false,error:String(e?.message||e)});
  }
}
