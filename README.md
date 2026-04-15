# GetCodes — getcodes.online

## How to Use with Antigravity + GitHub + Vercel

This is a static HTML site. Same setup as Cloud9 Tawang.
Edit in Antigravity → auto-pushes to GitHub → Vercel auto-deploys.

### First-Time Setup

1. Open Antigravity
2. Create new project from this folder (or replace your existing getcodes folder contents)
3. Connect to a GitHub repo (create one called `getcodes-site` on github.com)
4. Go to vercel.com → New Project → import `getcodes-site`
5. Settings:
   - Framework: Other
   - Root Directory: `.` (leave default — NOT "public")
   - Build Command: leave empty
   - Output Directory: leave empty
6. Deploy
7. Add domain `getcodes.online` in Vercel → Settings → Domains
8. In Namecheap DNS: A Record `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`

### Editing Existing Pages

Just open any file in Antigravity and edit. Save → commit → auto-deploys.

### Adding a New Tool Page

1. Copy any existing tool folder (e.g. copy `submagic-coupon-code/`)
2. Rename the folder to `new-tool-coupon-code/`
3. Open the `index.html` inside and change: title, description, tool name, deal info, links
4. Add the new URL to `sitemap.xml`
5. Add a card for it on `index.html` (homepage)
6. Save all → commit → deploys

### Adding a New Blog Post

1. Copy any folder inside `blog/` (e.g. copy `blog/revid-ai-vs-klap/`)
2. Rename to `blog/your-new-post-slug/`
3. Edit the `index.html` inside — change title, content, related deals
4. Add it to `blog/index.html` (blog listing page)
5. Add the URL to `sitemap.xml`
6. Save all → commit → deploys

### Optional: Using the Build Script

If you want to auto-generate pages instead of manually copying:
- Edit `deals.js` to add/remove tools
- Edit `blog-posts.js` to add/remove blog posts
- Run `node build.js` in terminal
- It regenerates everything (homepage, tool pages, blog posts, sitemap)
- Then commit and push

### File Structure

```
getcodes-site/
├── index.html                    ← Homepage
├── vercel.json                   ← Vercel routing config
├── robots.txt                    ← SEO
├── sitemap.xml                   ← SEO — add new URLs here
├── google1038d475c843ced0.html   ← Google Search Console verification
│
├── submagic-coupon-code/         ← Tool pages (one folder each)
│   └── index.html
├── heygen-coupon-code/
│   └── index.html
├── ... (22 total tool folders)
│
├── blog/                         ← Blog section
│   ├── index.html                ← Blog listing page
│   ├── revid-ai-vs-klap/
│   │   └── index.html
│   ├── submagic-vs-captions-app/
│   │   └── index.html
│   ├── best-ai-video-editing-tools-2026/
│   │   └── index.html
│   └── how-i-save-on-ai-tools/
│       └── index.html
│
├── deals.js                      ← (Optional) Tool data for build script
├── blog-posts.js                 ← (Optional) Blog data for build script
└── build.js                      ← (Optional) Auto-generates everything
```
