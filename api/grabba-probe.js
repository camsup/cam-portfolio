const targets = {
  gamestop_parma: 'https://www.gamestop.com/search/?q=Pokemon%2030th%20Celebration&store=0827',
  gamestop_parma_pokemon: 'https://www.gamestop.com/search/?q=Pokemon&store=0827',
  target_30th: 'https://www.target.com/c/-/N-4yka5Zq643le51vt3',
  bestbuy_30th: 'https://www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=Pokemon+TCG+30th+Celebration',
  microcenter_poster: 'https://www.microcenter.com/product/715609/nintendo-pokemon-tcg-30th-celebration-poster-collection?storeid=029'
};

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
    const text = await r.text();
    return res.status(200).json({
      ok:true,
      mode,
      status:r.status,
      finalUrl:r.url,
      body:text.slice(0, 120000)
    });
  } catch (e) {
    return res.status(500).json({ok:false,error:String(e?.message||e)});
  }
}
