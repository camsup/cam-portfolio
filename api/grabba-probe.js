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
  fullgrip_shopify: 'https://fullgripgames.com/products.json?limit=250',
  goldglory_fingerprint: 'https://www.goldandglorygaming.com/',
  gotz_fingerprint: 'https://www.gotzalotofgames.com/',
  goldglory_square: 'https://www.goldandglorygaming.com/sitemap.xml',
  gotz_talech: 'https://microsite.talech.com/shop/GOTZ-A-LOT-OF-GAMES-PARMA-OH/DOmkJw4Z7xxYpzb7'
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

    if (mode.endsWith('_square')) {
      const xml = html;
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replace(/&amp;/g,'&'));
      const candidateUrls = [...new Set(urls.filter(u =>
        /\/product\//i.test(u) &&
        /(pokemon|pok-mon|poke-mon)/i.test(u) &&
        /(booster|bundle|elite-trainer|etb|tin|collection|blister|pack|30th|mega|prismatic|destined|journey|surging|twilight|paradox|paldean|shrouded)/i.test(u)
      ))].slice(0,30);

      const products = [];
      for (const productUrl of candidateUrls) {
        try {
          const pr = await fetch(productUrl, {
            headers: {
              'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
              'accept-language': 'en-US,en;q=0.9'
            },
            redirect:'follow'
          });
          const page = await pr.text();
          const plain = strip(page);
          const titleMatch = page.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          const h1Match = page.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
          const title = strip((h1Match && h1Match[1]) || (titleMatch && titleMatch[1]) || productUrl);
          const prices = [...plain.matchAll(/\$\d{1,3}(?:\.\d{2})?/g)].map(m=>m[0]);
          const addToCart = /add to cart/i.test(plain);
          const pickup = /store pickup|in-store pickup|pickup/i.test(plain);
          const soldOut = /sold out|out of stock|unavailable/i.test(plain);
          const tcgLike = /(pokemon|pokémon)/i.test(title) && /(booster|bundle|elite trainer|\betb\b|tin|collection|blister|pack|30th|mega)/i.test(title);
          if (tcgLike) {
            products.push({
              title,
              url:productUrl,
              status:pr.status,
              addToCart,
              pickup,
              soldOut,
              prices:[...new Set(prices)].slice(0,8),
              snippet: plain.slice(0,900)
            });
          }
        } catch (e) {
          products.push({url:productUrl,error:String(e?.message||e)});
        }
      }
      return res.status(200).json({
        ok:true, mode, retailerStatus:r.status, finalUrl:r.url,
        candidateCount:candidateUrls.length,
        products
      });
    }

    if (mode.endsWith('_talech')) {
      const plain = strip(html);
      const urls = [...html.matchAll(/https?:\/\/[^"'<>\s]+/g)].map(m=>m[0].replace(/&amp;/g,'&'));
      const endpoints = [...new Set(urls.filter(u =>
        /(api|graphql|catalog|inventory|menu|product|shop|talech)/i.test(u)
      ))].slice(0,120);
      const scriptSrc = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m=>m[1]);
      const pokemonText = plain.match(/.{0,160}(?:pokemon|pokémon|tcg|trading card).{0,260}/ig)?.slice(0,40) || [];
      return res.status(200).json({
        ok:true, mode, retailerStatus:r.status, finalUrl:r.url,
        endpoints,
        scriptSrc:scriptSrc.slice(0,80),
        pokemonText,
        snippet:plain.slice(0,2500)
      });
    }

    if (mode.endsWith('_fingerprint')) {
      const base = new URL(url).origin;
      const lower = html.toLowerCase();
      const platform = lower.includes('squareup') || lower.includes('square.site') || lower.includes('weebly')
        ? 'square_weebly'
        : lower.includes('cdn.shopify.com') || lower.includes('shopify')
          ? 'shopify'
          : lower.includes('wixstatic') || lower.includes('wix.com')
            ? 'wix'
            : 'unknown';
      const commonSitemaps = ['/sitemap.xml','/sitemap_index.xml','/robots.txt'];
      const discovery = [];
      for (const path of commonSitemaps) {
        try {
          const sr = await fetch(base + path, {
            headers: {
              'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
              'accept-language': 'en-US,en;q=0.9'
            },
            redirect:'follow'
          });
          const text = await sr.text();
          discovery.push({path,status:sr.status,text:text.slice(0,60000)});
        } catch (e) {
          discovery.push({path,status:0,error:String(e?.message||e)});
        }
      }
      const joined = [html, ...discovery.map(x=>x.text||'')].join('\n');
      const urls = [...joined.matchAll(/https?:\/\/[^"'<>\s]+/g)].map(m=>m[0].replace(/&amp;/g,'&'));
      const productUrls = [...new Set(urls.filter(u => /(\/product\/|\/products\/|\/shop\/|pokemon|pok%C3%A9mon|poke-mon)/i.test(u)))].slice(0,80);
      const pokemonText = strip(joined).match(/.{0,120}(?:pokemon|pokémon).{0,220}/ig)?.slice(0,30) || [];
      return res.status(200).json({
        ok:true, mode, retailerStatus:r.status, finalUrl:r.url, platform,
        sitemapStatuses: discovery.map(x=>({path:x.path,status:x.status})),
        productUrls,
        pokemonText
      });
    }

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
