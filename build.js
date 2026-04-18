#!/usr/bin/env node
// ============================================
// BUILD SCRIPT — Generates EVERYTHING
// Run: node build.js
// ============================================
// Generates: homepage, all tool pages, all blog posts, blog index, sitemap

const fs = require('fs');
const path = require('path');
const DEALS = require('./deals.js');
const BLOG_POSTS = require('./blog-posts.js');

const OUT = path.join(__dirname, 'dist');

// Clean & recreate output
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

// ── Shared Pieces ───────────────────────────
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">`;
const BANNER = `<div id="promo-banner"><a href="https://www.oddsshopper.com/?via=flash50" target="_blank" rel="noopener">🔥 EXCLUSIVE: Get 50% Off OddsShopper with code FLASH50</a><button onclick="document.getElementById('promo-banner').style.display='none'">&times;</button></div>`;
const NAV = BANNER + `<nav class="nav"><div class="nav-inner"><a class="logo" href="/">get<span>codes</span></a><div class="nav-links"><a href="/blog/">Blog</a><a href="https://instagram.com/bedanta.exp" target="_blank" rel="noopener">Instagram</a><a href="https://x.com/bedanta" target="_blank" rel="noopener">X</a><a href="https://youtube.com/@bedanta" target="_blank" rel="noopener">YouTube</a></div></div></nav>`;
const TOAST = `<div class="toast" id="toast"></div>`;
const FOOTER = `<footer class="footer"><div>&copy; 2026 GetCodes by Bedanta</div><div class="footer-links"><a href="/blog/">Blog</a><a href="https://instagram.com/bedanta.exp" target="_blank" rel="noopener">Instagram</a><a href="https://x.com/bedanta" target="_blank" rel="noopener">X</a><a href="https://youtube.com/@bedanta" target="_blank" rel="noopener">YouTube</a></div></footer>`;
const JS_CODE = `function revealCode(btn,code){btn.textContent=code;btn.classList.add('revealed');navigator.clipboard.writeText(code).then(()=>{setTimeout(()=>{btn.textContent='Copied!';btn.classList.remove('revealed');btn.classList.add('copied');showToast('Code "'+code+'" copied!');setTimeout(()=>{btn.textContent=code;btn.classList.remove('copied');btn.classList.add('revealed')},2000)},300)}).catch(()=>{showToast('Code revealed!')})}function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}`;

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

// ── Shared CSS ──────────────────────────────
const CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--surface:#0B0B0B;--surface-low:#131313;--surface-mid:#181818;--surface-high:#222;--surface-bright:#2E2E2E;--primary:#75FF9E;--primary-dim:#5CE080;--primary-container:#00E676;--on-primary:#003918;--on-primary-fixed:#00210B;--on-surface:#F0ECF0;--on-surface-var:#B8B3BD;--on-surface-dim:#7A7680;--font-display:'Manrope',system-ui,sans-serif;--font-body:'DM Sans','Manrope',system-ui,sans-serif;--radius:0.75rem}
html{scroll-behavior:smooth}body{background:var(--surface);color:var(--on-surface);font-family:var(--font-body);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
::selection{background:var(--primary-container);color:var(--on-primary)}a{color:var(--primary);text-decoration:none}a:hover{text-decoration:underline}
.nav{position:sticky;top:0;z-index:100;background:rgba(11,11,11,.75);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.04)}
#promo-banner{background:linear-gradient(270deg,#E50914,#B20710,#ff4b2b);background-size:200% 200%;animation:bgPulse 4s ease infinite;color:#fff;text-align:center;padding:.6rem 1rem;font-weight:600;font-size:.85rem;display:flex;justify-content:center;align-items:center;position:relative;font-family:var(--font-display)}#promo-banner a{color:#fff;text-decoration:none;flex:1;transition:opacity .2s}#promo-banner a:hover{opacity:.85}#promo-banner button{background:0 0;border:none;color:#fff;cursor:pointer;font-size:1.2rem;line-height:1;position:absolute;right:1rem}@keyframes bgPulse{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.nav-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 clamp(1rem,4vw,2.5rem)}
.logo{font-family:var(--font-display);font-weight:800;font-size:1.2rem;letter-spacing:-.03em;color:var(--on-surface);text-decoration:none}.logo span{color:var(--primary)}
.nav-links{display:flex;gap:1.2rem;align-items:center}.nav-links a{font-size:.8rem;color:var(--on-surface-dim);text-decoration:none;transition:color .2s}.nav-links a:hover{color:var(--primary)}
.wrap{max-width:1100px;margin:0 auto;padding:0 clamp(1rem,4vw,2.5rem)}
.sec-title{font-family:var(--font-display);font-size:1.15rem;font-weight:700;letter-spacing:-.02em;margin:2.5rem 0 .8rem;display:flex;align-items:center;gap:.5rem}
.sec-title .count{font-size:.75rem;font-weight:600;color:var(--on-surface-dim);background:var(--surface-mid);padding:.15rem .5rem;border-radius:2rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.65rem}
.card{background:var(--surface-mid);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:1.1rem;transition:all .2s;text-decoration:none;color:var(--on-surface);display:block;cursor:pointer;position:relative}
.card:hover{background:var(--surface-high);border-color:rgba(117,255,158,.1);transform:translateY(-1px);box-shadow:0 8px 32px rgba(0,0,0,.3);text-decoration:none}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.55rem}
.card-brand{display:flex;align-items:center;gap:.55rem}
.card-logo{width:36px;height:36px;background:var(--surface-bright);border-radius:.5rem;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:.7rem;color:var(--primary);flex-shrink:0}
.card-brand h3{font-family:var(--font-display);font-size:.85rem;font-weight:600;margin-bottom:.05rem}.card-brand .ccat{font-size:.68rem;color:var(--on-surface-dim)}
.badge{background:var(--primary-container);color:var(--on-primary-fixed);font-family:var(--font-display);font-weight:700;font-size:.7rem;padding:.15rem .45rem;border-radius:.35rem;white-space:nowrap}
.card-desc{font-size:.78rem;color:var(--on-surface-var);margin-bottom:.8rem;line-height:1.5}
.card-actions{display:flex;gap:.4rem}
.btn-code{flex:1;background:linear-gradient(135deg,var(--primary),var(--primary-container));color:var(--on-primary);border:none;border-radius:.55rem;padding:.5rem .6rem;font-family:var(--font-display);font-weight:600;font-size:.78rem;cursor:pointer;transition:opacity .15s}.btn-code:hover{opacity:.88}
.btn-code.revealed{background:var(--surface-bright);color:var(--primary);font-family:monospace;letter-spacing:.06em;font-weight:500;font-size:.75rem}
.btn-code.copied{background:var(--primary-container);color:var(--on-primary-fixed)}
.btn-visit{background:var(--surface-bright);color:var(--on-surface-var);border:none;border-radius:.55rem;padding:.5rem .6rem;font-size:.78rem;font-family:var(--font-body);cursor:pointer;text-decoration:none;text-align:center;transition:color .15s}.btn-visit:hover{color:var(--primary);text-decoration:none}
.card-meta{display:flex;align-items:center;gap:.35rem;margin-top:.45rem;font-size:.65rem;color:var(--on-surface-dim)}
.vdot{width:4px;height:4px;background:var(--primary-container);border-radius:50%;display:inline-block}
.footer{padding:2rem clamp(1rem,4vw,2.5rem) 1.5rem;max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem;font-size:.75rem;color:var(--on-surface-dim)}
.footer a{color:var(--on-surface-dim);text-decoration:none}.footer a:hover{color:var(--primary)}.footer-links{display:flex;gap:1rem}
.toast{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%) translateY(80px);background:var(--surface-bright);color:var(--primary);padding:.55rem 1rem;border-radius:.55rem;font-size:.8rem;box-shadow:0 12px 28px rgba(0,0,0,.5);z-index:200;transition:transform .3s cubic-bezier(.22,1,.36,1);pointer-events:none;border:1px solid rgba(117,255,158,.15)}.toast.show{transform:translateX(-50%) translateY(0)}
.brand-hero{padding:6rem 0 1.5rem}.brand-hero h1{font-family:var(--font-display);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:800;letter-spacing:-.03em;margin-bottom:.3rem}
.bcat{font-size:.85rem;color:var(--on-surface-dim);margin-bottom:1.2rem;display:block}
.brand-about{font-size:.88rem;color:var(--on-surface-var);line-height:1.8;margin-bottom:2rem;max-width:720px}
.brand-code{background:var(--surface-mid);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:1.3rem;margin-bottom:.7rem}.brand-code:hover{background:var(--surface-high);border-color:rgba(117,255,158,.1)}
.discount{font-family:var(--font-display);font-weight:700;font-size:1.05rem;margin-bottom:.25rem}
.bdesc{font-size:.85rem;color:var(--on-surface-var);margin-bottom:.8rem}
.tag-list{display:flex;flex-wrap:wrap;gap:.4rem;margin:1.5rem 0}.tag{background:var(--surface-low);border:1px solid rgba(255,255,255,.04);border-radius:2rem;padding:.35rem .85rem;font-size:.75rem;color:var(--on-surface-dim)}
.breadcrumb{font-size:.8rem;color:var(--on-surface-dim);margin-bottom:.8rem;padding-top:4.5rem}.breadcrumb a{color:var(--on-surface-dim)}.breadcrumb a:hover{color:var(--primary)}
.faq{margin:2rem 0}.faq-item{border-bottom:1px solid rgba(255,255,255,.05);padding:1rem 0}
.faq-q{font-family:var(--font-display);font-weight:600;font-size:.88rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:1rem}.faq-q::after{content:'+';font-size:1.1rem;color:var(--on-surface-dim);flex-shrink:0;transition:transform .2s}
.faq-item.open .faq-q::after{transform:rotate(45deg);color:var(--primary)}
.faq-a{font-size:.82rem;color:var(--on-surface-var);line-height:1.65;max-height:0;overflow:hidden;transition:max-height .3s,padding .3s}.faq-item.open .faq-a{max-height:200px;padding-top:.6rem}
/* Blog styles */
.blog-content{max-width:720px;margin:0 auto 3rem}
.blog-content h2{font-family:var(--font-display);font-size:1.2rem;font-weight:700;margin:2rem 0 .6rem;letter-spacing:-.02em}
.blog-content p{font-size:.9rem;color:var(--on-surface-var);line-height:1.8;margin-bottom:1rem}
.blog-content table{width:100%;border-collapse:collapse;margin:1.2rem 0;font-size:.82rem}
.blog-content th{background:var(--surface-mid);padding:.6rem .8rem;text-align:left;font-family:var(--font-display);font-weight:600;border:1px solid rgba(255,255,255,.06)}
.blog-content td{padding:.55rem .8rem;border:1px solid rgba(255,255,255,.06);color:var(--on-surface-var)}
.blog-content ul,.blog-content ol{margin:1rem 0;padding-left:1.5rem;color:var(--on-surface-var);font-size:.9rem}
.blog-content li{margin-bottom:.4rem;line-height:1.7}
.blog-content a{color:var(--primary)}
.blog-content strong{color:var(--on-surface);font-weight:600}
.blog-header{padding:5.5rem 0 2rem;max-width:720px;margin:0 auto}
.blog-header h1{font-family:var(--font-display);font-size:clamp(1.5rem,3.5vw,2.2rem);font-weight:800;letter-spacing:-.03em;line-height:1.2;margin-bottom:.6rem}
.blog-meta{font-size:.78rem;color:var(--on-surface-dim);display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:.3rem}
.blog-card{background:var(--surface-mid);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:1.2rem;transition:all .2s;text-decoration:none;color:var(--on-surface);display:block}
.blog-card:hover{background:var(--surface-high);border-color:rgba(117,255,158,.1);transform:translateY(-1px);text-decoration:none}
.blog-card h3{font-family:var(--font-display);font-size:.95rem;font-weight:700;margin-bottom:.35rem;letter-spacing:-.01em}
.blog-card p{font-size:.8rem;color:var(--on-surface-dim);line-height:1.5;margin-bottom:.5rem}
.blog-card .blog-card-meta{font-size:.7rem;color:var(--on-surface-dim);display:flex;gap:.8rem}
.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:.7rem;margin-bottom:3rem}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.card{animation:fadeUp .35s ease both}
@media(max-width:768px){.grid{grid-template-columns:1fr}.blog-grid{grid-template-columns:1fr}.footer{flex-direction:column;text-align:center}}`;

function cardHTML(deal) {
  const actionBtn = deal.codeType === 'link'
    ? `<a class="btn-code" href="${deal.url}" target="_blank" rel="noopener nofollow" onclick="event.stopPropagation()" style="text-align:center;text-decoration:none">Activate Deal</a>`
    : `<button class="btn-code" onclick="event.stopPropagation();revealCode(this,'${deal.code}')">Get Code</button>`;
  return `<div class="card" onclick="window.location.href='/${deal.slug}/'"><div class="card-top"><div class="card-brand"><div class="card-logo">${deal.abbr}</div><div><h3>${esc(deal.name)}</h3><span class="ccat">${esc(deal.category)}</span></div></div><div class="badge">${esc(deal.badge)}</div></div><p class="card-desc">${esc(deal.description)}</p><div class="card-actions">${actionBtn}<a class="btn-visit" href="${deal.url}" target="_blank" rel="noopener nofollow" onclick="event.stopPropagation()">Visit →</a></div><div class="card-meta"><span class="vdot"></span> Verified</div></div>`;
}

// ══════════════════════════════════════════════
// 1. BUILD TOOL PAGES
// ══════════════════════════════════════════════
console.log('Building tool pages...');
DEALS.forEach(deal => {
  const dir = path.join(OUT, deal.slug);
  fs.mkdirSync(dir, { recursive: true });
  const related = DEALS.filter(d => d.category === deal.category && d.slug !== deal.slug).slice(0, 3);

  const faqSchema = deal.faq?.length > 0 ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": deal.faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) })}` + '</script>' : '';
  const productSchema = deal.customSchema || `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Product", "name": deal.name, "description": deal.about, "offers": [{ "@type": "Offer", "name": `${deal.name} ${deal.badge}`, "description": deal.description, "url": deal.url }] })}</script>`;

  const faqHTML = deal.faq?.length > 0 ? `<h2 class="sec-title">Frequently asked questions</h2><div class="faq">${deal.faq.map(f => `<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">${esc(f.q)}</div><div class="faq-a">${esc(f.a)}</div></div>`).join('')}</div>` : '';

  const actionBtn = deal.codeType === 'link'
    ? `<a class="btn-code" href="${deal.url}" target="_blank" rel="noopener nofollow" style="text-align:center;text-decoration:none">Activate Deal</a>`
    : `<button class="btn-code" onclick="revealCode(this,'${deal.code}')">Get Code</button>`;

  const titleTag = deal.codeType === 'code' ? `${deal.name} Coupon Code 2026 — ${deal.badge} (Verified)` : `${deal.name} Deal 2026 — ${deal.badge} (Verified Link)`;

  const html = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(titleTag)}</title>
<meta name="description" content="${esc(deal.description)}">
<link rel="canonical" href="https://getcodes.online/${deal.slug}/">
<meta property="og:title" content="${esc(titleTag)}"><meta property="og:description" content="${esc(deal.description)}"><meta property="og:url" content="https://getcodes.online/${deal.slug}/"><meta property="og:type" content="website">
${FONTS}${productSchema}${faqSchema}
<style>${CSS}</style></head><body>
${NAV}${TOAST}
<div class="wrap">
<div class="breadcrumb"><a href="/">GetCodes</a> &rsaquo; <a href="/#${deal.catSlug}">${esc(deal.category)}</a> &rsaquo; ${esc(deal.name)}</div>
<section class="brand-hero"><h1>${esc(titleTag.replace(/ \(Verified.*$/, ''))}</h1><span class="bcat">${esc(deal.category)}</span></section>
<p class="brand-about">${esc(deal.about)}</p>
<h2 class="sec-title">1 active ${deal.codeType === 'code' ? 'code' : 'deal'}</h2>
<div class="brand-code"><div class="discount">${esc(deal.badge)}</div><p class="bdesc">${esc(deal.description)}</p>
<div class="card-actions">${actionBtn}<a class="btn-visit" href="${deal.url}" target="_blank" rel="noopener nofollow">Visit ${esc(deal.name)} &rarr;</a></div>
<div class="card-meta" style="margin-top:.5rem"><span class="vdot"></span> Verified &bull; April 2026</div></div>
<div class="tag-list">${deal.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
${faqHTML}
${deal.relatedBlogs ? `<h2 class="sec-title">Related Guides</h2><div class="blog-grid" style="margin-bottom:1.5rem">${deal.relatedBlogs.map(s=>{const p=BLOG_POSTS.find(b=>b.slug===s);return p?`<a class="blog-card" href="/blog/${p.slug}/"><h3>${esc(p.title)}</h3><p>${esc(p.metaDescription)}</p><div class="blog-card-meta"><span>${p.category}</span><span>${p.date}</span></div></a>`:''}).join('')}</div>` : ''}
${related.length > 0 ? `<h2 class="sec-title">Related deals</h2><div class="grid">${related.map(cardHTML).join('')}</div>` : ''}
</div>${FOOTER}<script>${JS_CODE}</script></body></html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html);
});
console.log(`  ✅ ${DEALS.length} tool pages`);

// ══════════════════════════════════════════════
// 2. BUILD BLOG POSTS
// ══════════════════════════════════════════════
console.log('Building blog posts...');
fs.mkdirSync(path.join(OUT, 'blog'), { recursive: true });

BLOG_POSTS.forEach(post => {
  const dir = path.join(OUT, 'blog', post.slug);
  fs.mkdirSync(dir, { recursive: true });

  const relatedDealCards = post.relatedDeals
    .map(slug => DEALS.find(d => d.slug === slug))
    .filter(Boolean)
    .map(cardHTML)
    .join('');

  const articleSchema = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": { "@type": "Person", "name": "Bedanta" },
    "publisher": { "@type": "Organization", "name": "GetCodes" },
    "mainEntityOfPage": `https://getcodes.online/blog/${post.slug}/`
  })}</script>`;

  const html = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(post.title)} — GetCodes</title>
<meta name="description" content="${esc(post.metaDescription)}">
<link rel="canonical" href="https://getcodes.online/blog/${post.slug}/">
<meta property="og:title" content="${esc(post.title)}"><meta property="og:description" content="${esc(post.metaDescription)}"><meta property="og:url" content="https://getcodes.online/blog/${post.slug}/"><meta property="og:type" content="article">
${FONTS}${articleSchema}
<style>${CSS}</style></head><body>
${NAV}${TOAST}
<div class="wrap">
<div class="breadcrumb"><a href="/">GetCodes</a> &rsaquo; <a href="/blog/">Blog</a> &rsaquo; ${esc(post.title.length > 50 ? post.title.slice(0, 50) + '...' : post.title)}</div>
<div class="blog-header">
<h1>${esc(post.title)}</h1>
<div class="blog-meta"><span>${post.category}</span><span>${post.date}</span></div>
</div>
<div class="blog-content">${post.content}</div>
${relatedDealCards ? `<h2 class="sec-title">Deals mentioned in this post</h2><div class="grid">${relatedDealCards}</div>` : ''}
</div>${FOOTER}<script>${JS_CODE}</script></body></html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html);
});
console.log(`  ✅ ${BLOG_POSTS.length} blog posts`);

// ── Blog Index Page ─────────────────────────
const blogIndexHTML = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Blog — GetCodes | AI Tool Comparisons, Guides & Deals</title>
<meta name="description" content="Comparisons, guides, and reviews for AI tools, SaaS, and trading platforms. Find the best tool for your needs and save with verified promo codes.">
<link rel="canonical" href="https://getcodes.online/blog/">
<meta property="og:title" content="Blog — GetCodes"><meta property="og:description" content="AI tool comparisons, guides, and reviews with verified promo codes."><meta property="og:url" content="https://getcodes.online/blog/"><meta property="og:type" content="website">
${FONTS}<style>${CSS}</style></head><body>
${NAV}
<div class="wrap">
<div class="blog-header" style="padding-top:6rem">
<h1>Blog</h1>
<p style="font-size:.92rem;color:var(--on-surface-dim);margin-top:.3rem">Tool comparisons, guides, and reviews to help you pick the right tools and save money.</p>
</div>
<div class="blog-grid">
${BLOG_POSTS.map(post => `<a class="blog-card" href="/blog/${post.slug}/">
<h3>${esc(post.title)}</h3>
<p>${esc(post.metaDescription)}</p>
<div class="blog-card-meta"><span>${post.category}</span><span>${post.date}</span></div>
</a>`).join('')}
</div>
</div>${FOOTER}</body></html>`;
fs.writeFileSync(path.join(OUT, 'blog', 'index.html'), blogIndexHTML);
console.log('  ✅ Blog index page');

// ══════════════════════════════════════════════
// 3. BUILD HOMEPAGE
// ══════════════════════════════════════════════
console.log('Building homepage...');

const categories = [...new Set(DEALS.map(d => d.category))];
const catChips = categories.map(c => {
  const slug = c.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  return `<a class="cat-chip" href="#${slug}">${esc(c)}</a>`;
}).join('');

const featuredCards = DEALS.filter(d => d.featured).map(cardHTML).join('');

const categorySections = categories.map(cat => {
  const catDeals = DEALS.filter(d => d.category === cat);
  const slug = cat.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  return `<h2 class="sec-title" id="${slug}">${esc(cat)} <span class="count">${catDeals.length}</span></h2><div class="grid">${catDeals.map(cardHTML).join('')}</div>`;
}).join('');

const marqueeLinks = DEALS.map(d => `<a href="/${d.slug}/">${esc(d.name)}</a>`).join('<span class="sep">•</span>');

const blogSection = BLOG_POSTS.length > 0 ? `
<h2 class="sec-title">From the blog</h2>
<div class="blog-grid" style="margin-bottom:1.5rem">
${BLOG_POSTS.slice(0, 3).map(post => `<a class="blog-card" href="/blog/${post.slug}/">
<h3>${esc(post.title)}</h3>
<p>${esc(post.metaDescription)}</p>
<div class="blog-card-meta"><span>${post.category}</span><span>${post.date}</span></div>
</a>`).join('')}
</div>` : '';

const searchData = JSON.stringify(DEALS.map(d => ({ n: d.name, s: d.slug, c: d.category, b: d.badge, a: d.abbr })));

const faqSchemaHome = JSON.stringify({
  "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
    { "@type": "Question", "name": "Are GetCodes promo codes verified?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every code on GetCodes is manually tested and verified before listing. We update codes monthly and remove expired ones." } },
    { "@type": "Question", "name": "How do I use a coupon code from GetCodes?", "acceptedAnswer": { "@type": "Answer", "text": "Click 'Get Code' to reveal and copy the code, then paste it at checkout. For link-activated deals, click 'Activate Deal' and the discount applies automatically." } },
    { "@type": "Question", "name": "What types of tools does GetCodes cover?", "acceptedAnswer": { "@type": "Answer", "text": "GetCodes covers AI video tools, AI coding platforms, SEO tools, social media marketing, automation, hosting, website builders, and trading & finance platforms." } },
    { "@type": "Question", "name": "How often are codes updated?", "acceptedAnswer": { "@type": "Answer", "text": "All codes are verified at least once per month. Featured deals are checked weekly." } }
  ]
});

const homepageHTML = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>GetCodes — Verified Promo & Discount Codes for AI Tools, SaaS, Betting & Trading (2026)</title>
<meta name="description" content="GetCodes — verified promo codes and discount codes for AI tools, SaaS, sports betting, trading, and hosting. 22+ deals updated monthly. Every code tested.">
<link rel="canonical" href="https://getcodes.online/">
<meta property="og:title" content="GetCodes — Verified Promo Codes for AI Tools, SaaS & Trading"><meta property="og:description" content="Save on ${DEALS.length}+ AI tools and SaaS with verified promo codes."><meta property="og:url" content="https://getcodes.online/"><meta property="og:type" content="website">
${FONTS}
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"GetCodes","url":"https://getcodes.online/","description":"Verified promo codes for AI tools, SaaS, and trading platforms."}</script>
<script type="application/ld+json">${faqSchemaHome}</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GetCodes",
  "url": "https://www.getcodes.online",
  "description": "Verified promo codes for AI tools, SaaS, sports betting, trading and hosting",
  "sameAs": [
    "https://instagram.com/bedanta.exp",
    "https://x.com/bedanta",
    "https://youtube.com/@bedanta"
  ]
}
</script>
<style>${CSS}
.hero{padding:7rem 0 2.5rem;text-align:center;position:relative}.hero::before{content:'';position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(0,230,118,.06) 0%,transparent 70%);pointer-events:none}
.hero h1{font-family:var(--font-display);font-size:clamp(1.8rem,4.5vw,3rem);font-weight:800;letter-spacing:-.04em;line-height:1.12;margin-bottom:.8rem;position:relative}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,var(--primary),#00E676);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:.95rem;color:var(--on-surface-dim);max-width:480px;margin:0 auto 1.8rem;line-height:1.6}
.hero-stats{display:flex;gap:2rem;justify-content:center;margin-bottom:2rem;flex-wrap:wrap}
.hero-stat{text-align:center}.hero-stat strong{display:block;font-family:var(--font-display);font-size:1.4rem;font-weight:800;color:var(--primary)}.hero-stat span{font-size:.72rem;color:var(--on-surface-dim);text-transform:uppercase;letter-spacing:.06em}
.search-box{position:relative;max-width:480px;margin:0 auto 1rem}.search-box input{width:100%;background:var(--surface-low);border:1px solid rgba(255,255,255,.06);border-radius:var(--radius);padding:.85rem 1rem .85rem 2.8rem;color:var(--on-surface);font-size:.9rem;font-family:var(--font-body);outline:none;transition:border-color .2s,box-shadow .2s}.search-box input:focus{border-color:rgba(0,230,118,.3);box-shadow:0 0 0 3px rgba(0,230,118,.08)}.search-box input::placeholder{color:var(--on-surface-dim)}.search-box svg{position:absolute;left:.9rem;top:50%;transform:translateY(-50%);width:18px;height:18px;stroke:var(--on-surface-dim);fill:none;stroke-width:2}
.search-results{position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--surface-high);border:1px solid rgba(255,255,255,.06);border-radius:var(--radius);max-height:300px;overflow-y:auto;z-index:50;display:none;box-shadow:0 16px 48px rgba(0,0,0,.5)}.search-results.active{display:block}
.search-item{padding:.65rem .9rem;cursor:pointer;display:flex;align-items:center;gap:.6rem;transition:background .12s;text-decoration:none;color:var(--on-surface)}.search-item:hover{background:var(--surface-bright);text-decoration:none}
.si-logo{width:28px;height:28px;background:var(--surface-bright);border-radius:.4rem;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:.65rem;color:var(--primary);flex-shrink:0}.si-info{flex:1;min-width:0}.si-name{font-weight:600;font-size:.82rem}.si-cat{font-size:.68rem;color:var(--on-surface-dim)}.si-badge{background:var(--primary-container);color:var(--on-primary-fixed);font-size:.65rem;font-weight:700;padding:.15rem .4rem;border-radius:.3rem;font-family:var(--font-display);flex-shrink:0}
.cats{display:flex;gap:.45rem;flex-wrap:wrap;justify-content:center;margin:0 auto 2.5rem;max-width:700px}
.how{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;margin:1rem 0 2.5rem}.how-card{background:var(--surface-low);border:1px solid rgba(255,255,255,.04);border-radius:var(--radius);padding:1.2rem;text-align:center}
.how-num{font-family:var(--font-display);font-weight:800;font-size:2rem;background:linear-gradient(135deg,var(--primary),var(--primary-container));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;opacity:.4;margin-bottom:.1rem}.how-card h3{font-family:var(--font-display);font-weight:600;font-size:.85rem;margin-bottom:.2rem}.how-card p{font-size:.75rem;color:var(--on-surface-dim);line-height:1.45}
.marquee-wrap{overflow:hidden;margin:2rem 0;padding:.8rem 0;border-top:1px solid rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.04)}.marquee{display:flex;gap:1.5rem;animation:mscroll 40s linear infinite;width:max-content}.marquee a{font-size:.78rem;color:var(--on-surface-dim);white-space:nowrap;text-decoration:none;transition:color .15s}.marquee a:hover{color:var(--primary);text-decoration:none}.marquee .sep{color:rgba(255,255,255,.08)}@keyframes mscroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@media(max-width:768px){.how{grid-template-columns:1fr}.hero-stats{gap:1.2rem}}@media(max-width:480px){.hero h1{font-size:1.65rem}}
</style></head><body>
${NAV}${TOAST}
<div class="wrap">
<section class="hero">
<h1>Verified Promo Codes for AI Tools, SaaS & Betting (2026)</h1>
<p class="hero-sub">Verified promo codes &amp; referral deals for ${DEALS.length}+ AI tools, SaaS, trading platforms &amp; more. Every code tested.</p>
<div class="hero-stats"><div class="hero-stat"><strong>${DEALS.length}+</strong><span>Verified Deals</span></div><div class="hero-stat"><strong>${categories.length}</strong><span>Categories</span></div><div class="hero-stat"><strong>Apr 2026</strong><span>Last Updated</span></div></div>
<div class="search-box"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><input type="text" id="search" placeholder="Search tools — Submagic, HeyGen, Emergent..." autocomplete="off"><div class="search-results" id="sr"></div></div>
</section>
<div class="cats"><a class="cat-chip active" href="#featured">Featured</a>${catChips}</div>
<h2 class="sec-title" id="featured">Featured deals <span class="count">${DEALS.filter(d => d.featured).length}</span></h2>
<div class="grid">${featuredCards}</div>
${categorySections}
<h2 class="sec-title">How it works</h2>
<div class="how"><div class="how-card"><div class="how-num">01</div><h3>Find a deal</h3><p>Browse categories or search above.</p></div><div class="how-card"><div class="how-num">02</div><h3>Copy the code</h3><p>Click to reveal and copy instantly.</p></div><div class="how-card"><div class="how-num">03</div><h3>Save money</h3><p>Paste at checkout, enjoy the discount.</p></div></div>
${blogSection}
<h2 class="sec-title">Frequently asked questions</h2>
<div class="faq">
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">Are GetCodes promo codes verified?</div><div class="faq-a">Yes. Every code is manually tested before listing. We update codes monthly and remove expired ones.</div></div>
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">How do I use a coupon code from GetCodes?</div><div class="faq-a">Click "Get Code" to reveal and copy, then paste at checkout. For link-activated deals, click "Activate Deal" — the discount applies automatically.</div></div>
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">What types of tools does GetCodes cover?</div><div class="faq-a">AI video tools, coding platforms, SEO tools, social media, automation, hosting, website builders, and trading platforms.</div></div>
<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">How often are codes updated?</div><div class="faq-a">All codes are verified at least monthly. Featured deals are checked weekly.</div></div>
</div>
<div class="marquee-wrap"><div class="marquee">${marqueeLinks}<span class="sep">•</span><div aria-hidden="true" style="display:contents">${marqueeLinks}</div><span class="sep">•</span></div></div>
</div>${FOOTER}
<script>
const D=${searchData};
const si=document.getElementById('search'),sr=document.getElementById('sr');
si.addEventListener('input',function(){const q=this.value.toLowerCase().trim();if(!q){sr.classList.remove('active');sr.innerHTML='';return}const r=D.filter(d=>d.n.toLowerCase().includes(q)||d.c.toLowerCase().includes(q));if(!r.length){sr.classList.remove('active');return}sr.innerHTML=r.map(d=>\`<a class="search-item" href="/\${d.s}/"><div class="si-logo">\${d.a}</div><div class="si-info"><div class="si-name">\${d.n}</div><div class="si-cat">\${d.c}</div></div><div class="si-badge">\${d.b}</div></a>\`).join('');sr.classList.add('active')});
document.addEventListener('click',e=>{if(!e.target.closest('.search-box'))sr.classList.remove('active')});
${JS_CODE}
</script></body></html>`;

fs.writeFileSync(path.join(OUT, 'index.html'), homepageHTML);
console.log('  ✅ Homepage');

// ══════════════════════════════════════════════
// 4. STATIC FILES
// ══════════════════════════════════════════════
// Sitemap
const allURLs = [
  { loc: 'https://www.getcodes.online/', freq: 'daily', priority: '1.0' },
  { loc: 'https://www.getcodes.online/blog/', freq: 'weekly', priority: '0.7' },
  ...DEALS.map(d => ({ loc: `https://www.getcodes.online/${d.slug}/`, freq: 'weekly', priority: '0.8' })),
  ...BLOG_POSTS.map(p => ({ loc: `https://www.getcodes.online/blog/${p.slug}/`, freq: 'monthly', priority: '0.7' }))
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allURLs.map(u => `<url><loc>${u.loc}</loc><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);

fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://www.getcodes.online/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'google1038d475c843ced0.html'), 'google-site-verification: google1038d475c843ced0.html');
fs.writeFileSync(path.join(OUT, 'vercel.json'), JSON.stringify({ cleanUrls: true, trailingSlash: true, headers: [{ source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "X-Frame-Options", value: "DENY" }] }, { source: "/sitemap.xml", headers: [{ key: "Content-Type", value: "application/xml" }] }] }, null, 2));

console.log('  ✅ sitemap.xml, robots.txt, vercel.json, google verification');

// ── Summary ─────────────────────────────────
const totalFiles = 1 + DEALS.length + BLOG_POSTS.length + 1 + 4; // home + tools + posts + blog index + static
console.log(`\n🎉 Done! Built ${totalFiles} files into ./dist/`);
console.log(`   ${DEALS.length} tool pages + ${BLOG_POSTS.length} blog posts + homepage + blog index`);
console.log(`   ${allURLs.length} URLs in sitemap\n`);
