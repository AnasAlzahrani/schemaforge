# Google Search Console Setup — SchemaForge

## What This Does
Gets SchemaForge indexed by Google so it shows up in search results. Takes ~5 minutes.

---

## Step-by-Step

### 1. Go to Google Search Console
- Open [https://search.google.com/search-console](https://search.google.com/search-console)
- Sign in with your Google account

### 2. Add Property
- Click the dropdown in the top-left → **"Add property"**
- Choose **"URL prefix"** (not Domain)
- Enter: `https://schemaforge-seven.vercel.app`
- Click **Continue**

### 3. Verify Ownership
The easiest method for Vercel:

**Option A — HTML Tag (Recommended)**
1. Google will show you a meta tag like:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXXX" />
   ```
2. Copy that entire tag
3. Add it to the `<head>` section of `index.html` in the SchemaForge repo
4. Commit, push, wait for Vercel to deploy (~30 seconds)
5. Go back to GSC and click **Verify**

**Option B — HTML File Upload**
1. Google will give you an HTML file (like `google1234567890abcdef.html`)
2. Download it and add it to the root of the SchemaForge repo
3. Commit, push, wait for deploy
4. Click **Verify** in GSC

### 4. Submit Sitemap
Once verified:
1. In the left sidebar, click **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**

> ⚠️ If we don't have a sitemap.xml yet, we need to create one. See below.

### 5. Request Indexing (Optional but speeds things up)
1. In the top search bar of GSC, paste: `https://schemaforge-seven.vercel.app/`
2. Click **Request Indexing**
3. Repeat for key pages:
   - `/faq.html`
   - `/local-business.html`
   - `/product.html`
   - `/article.html`
   - `/event.html`
   - `/howto.html`
   - `/organization.html`
   - `/recipe.html`

---

## Sitemap (if not already created)

Save this as `sitemap.xml` in the repo root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://schemaforge-seven.vercel.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://schemaforge-seven.vercel.app/faq.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://schemaforge-seven.vercel.app/local-business.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://schemaforge-seven.vercel.app/product.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://schemaforge-seven.vercel.app/article.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://schemaforge-seven.vercel.app/event.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://schemaforge-seven.vercel.app/howto.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://schemaforge-seven.vercel.app/organization.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://schemaforge-seven.vercel.app/recipe.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## After Verification — What to Monitor
- **Performance tab** — see which queries bring clicks (check weekly)
- **Coverage tab** — make sure all pages get indexed without errors
- **Enhancements** — GSC will flag structured data issues (relevant since this is literally a schema tool)

## Timeline
- Verification: instant once the meta tag deploys
- Initial crawl: usually within 24-48 hours
- Showing up in results: 3-7 days for a new domain
- Meaningful ranking data: 2-4 weeks
