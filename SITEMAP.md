# 🗺️ Sitemap Generation Guide

## Overview

Sitemap untuk website ini di-generate secara otomatis menggunakan Node.js script yang mengambil data dari API dan menyimpan file `sitemap.xml` di folder `public`.

## 📋 How It Works

1. **Script Node.js** (`scripts/generate-sitemap.js`) mengambil data artikel dan kategori dari API
2. **Generate XML** sesuai dengan format sitemap protocol (sitemaps.org)
3. **Simpan file** `sitemap.xml` di folder `public`
4. **Vite** akan serve file tersebut sebagai static asset

## 🚀 Usage

### Manual Generation

Generate sitemap secara manual:

```bash
npm run generate:sitemap
```

atau dengan pnpm:

```bash
pnpm generate:sitemap
```

### Automatic on Build

Sitemap akan otomatis di-generate setiap kali build project:

```bash
npm run build
```

Script `prebuild` akan menjalankan `generate:sitemap` sebelum build dimulai.

## ⚙️ Configuration

### Environment Variables

Buat file `.env` di root project dengan konfigurasi berikut:

```env
# API Configuration
VITE_API_URL=https://api.ivd.my.id/api/v1
VITE_ROOT_API=https://api.ivd.my.id

# Site Configuration
VITE_SITE_URL=https://ivd.my.id
```

**Note:** File `.env.example` sudah tersedia sebagai template.

### Script Configuration

Edit `scripts/generate-sitemap.js` untuk mengubah:

- **API_BASE_URL**: Base URL untuk API (default: dari VITE_API_URL env)
- **SITE_URL**: Base URL untuk website (default: dari VITE_SITE_URL env)
- **OUTPUT_PATH**: Path untuk menyimpan sitemap.xml

## 📊 Sitemap Contents

### URL Types

1. **Static Pages** (Priority: 1.0 - 0.9)
   - Homepage: `/`
   - Blog listing: `/blogs`

2. **Article Pages** (Priority: 0.8)
   - Individual articles: `/blogs/{slug}`

3. **Category Pages** (Priority: 0.7)
   - Category filters: `/blogs?category={id}`

### Change Frequency

- **Weekly**: Homepage (content updates regularly)
- **Daily**: Blog listing (new articles published)
- **Monthly**: Individual articles (rarely updated)
- **Weekly**: Category pages

### Example Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ivd.my.id/</loc>
    <lastmod>2025-12-11T06:51:12.979Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ivd.my.id/blogs/article-slug</loc>
    <lastmod>2025-12-10T15:30:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 🔄 Update Process

### When to Regenerate

Regenerate sitemap ketika:
- ✅ Ada artikel baru yang dipublish
- ✅ Artikel existing di-update
- ✅ Kategori baru ditambahkan
- ✅ Before deploying to production

### Automated Updates

#### GitHub Actions (Recommended)

Tambahkan workflow untuk auto-generate sitemap saat deploy:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Generate sitemap
        run: pnpm generate:sitemap
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SITE_URL: ${{ secrets.VITE_SITE_URL }}

      - name: Build
        run: pnpm build

      - name: Deploy
        # Your deployment steps here
```

#### Cron Job (Server)

Setup cron job untuk regenerate sitemap secara berkala:

```bash
# Regenerate sitemap setiap hari jam 3 pagi
0 3 * * * cd /path/to/project && npm run generate:sitemap
```

## 🔍 Validation

### Test Locally

1. Generate sitemap:
   ```bash
   npm run generate:sitemap
   ```

2. Check output file:
   ```bash
   cat public/sitemap.xml
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Access sitemap:
   ```
   http://localhost:5173/sitemap.xml
   ```

### Validate with Google

1. Go to: https://search.google.com/test/rich-results
2. Enter sitemap URL or paste XML
3. Check for errors

### Validate with XML Validator

Online validators:
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- https://xmlvalidation.com/

## 📤 Submit to Search Engines

### Google Search Console

1. Go to: https://search.google.com/search-console
2. Select your property
3. Navigate to: **Sitemaps**
4. Enter: `https://ivd.my.id/sitemap.xml`
5. Click **Submit**

### Bing Webmaster Tools

1. Go to: https://www.bing.com/webmasters
2. Select your site
3. Navigate to: **Sitemaps**
4. Enter: `https://ivd.my.id/sitemap.xml`
5. Click **Submit**

### Robots.txt

Sitemap sudah didaftarkan di `public/robots.txt`:

```txt
Sitemap: https://ivd.my.id/sitemap.xml
```

## 🐛 Troubleshooting

### Error: Cannot fetch articles from API

**Solution:**
- Check API URL di `.env`
- Verify API is accessible
- Check network connectivity

### Error: Permission denied writing file

**Solution:**
```bash
chmod +w public/
npm run generate:sitemap
```

### Sitemap not updating

**Solution:**
1. Delete old sitemap: `rm public/sitemap.xml`
2. Regenerate: `npm run generate:sitemap`
3. Clear browser cache
4. Rebuild project: `npm run build`

### Missing articles in sitemap

**Solution:**
- Check API response includes all articles
- Verify `all_data=1` parameter works
- Check pagination settings (per_page: 1000)

## 📚 Resources

- [Sitemaps Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [XML Sitemap Best Practices](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#best-practices)

## 📝 Files

### Created Files

1. **`scripts/generate-sitemap.js`** - Main generation script
2. **`public/sitemap.xml`** - Generated sitemap (git ignored)
3. **`.env.example`** - Environment configuration template
4. **`SITEMAP.md`** - This documentation

### Modified Files

1. **`package.json`** - Added npm scripts
2. **`public/robots.txt`** - Added sitemap reference

## 🎯 Summary

- ✅ **Static File Generation** - Sitemap di-generate sebagai static file
- ✅ **Auto-generation on Build** - Otomatis generate saat build
- ✅ **SEO Optimized** - Format sesuai sitemap protocol
- ✅ **18 URLs Total** - 2 static + 13 articles + 3 categories
- ✅ **Fast & Efficient** - Served as static asset, no runtime overhead
- ✅ **Easy to Update** - Single command untuk regenerate

---

**Last Updated:** 2025-12-11
**Version:** 3.0.0
**Author:** Claude Code
