#!/usr/bin/env node
/**
 * M.U.S.C.L.E. Figure Image Downloader
 *
 * Scrapes figure images from musclefigures.com and uofmuscle.com,
 * saving them to muscle-catalog/images/figure-NNN.jpg
 *
 * Usage:
 *   node scripts/download-images.js
 *
 * Requires:
 *   npm install node-fetch@2 cheerio
 */

'use strict';

const https = require('https');
const http  = require('http');
const path  = require('path');
const fs    = require('fs');
const url   = require('url');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const DELAY_MS   = 800;   // polite delay between requests
const TIMEOUT_MS = 15000;

const HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control':   'no-cache',
  'Pragma':          'no-cache',
};

const IMG_HEADERS = {
  'User-Agent': HEADERS['User-Agent'],
  'Accept':     'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Referer':    'http://www.musclefigures.com/',
};

// All 236 figures (num → name mapping for filename fallback)
const FIGURES = [
  {num:1},{num:2},{num:3},{num:4},{num:5},{num:6},{num:7},{num:8},{num:9},{num:10},
  {num:11},{num:12},{num:13},{num:14},{num:15},{num:16},{num:17},{num:18},{num:19},{num:20},
  {num:21},{num:22},{num:23},{num:24},{num:25},{num:26},{num:27},{num:28},{num:29},{num:30},
  {num:31},{num:32},{num:33},{num:34},{num:35},{num:36},{num:37},{num:38},{num:39},{num:40},
  {num:41},{num:42},{num:43},{num:44},{num:45},{num:46},{num:47},{num:48},{num:49},{num:50},
  {num:51},{num:52},{num:53},{num:54},{num:55},{num:56},{num:57},{num:58},{num:59},{num:60},
  {num:61},{num:62},{num:63},{num:64},{num:65},{num:66},{num:67},{num:68},{num:69},{num:70},
  {num:71},{num:72},{num:73},{num:74},{num:75},{num:76},{num:77},{num:78},{num:79},{num:80},
  {num:81},{num:82},{num:83},{num:84},{num:85},{num:86},{num:87},{num:88},{num:89},{num:90},
  {num:91},{num:92},{num:93},{num:94},{num:95},{num:96},{num:97},{num:98},{num:99},{num:100},
  {num:101},{num:102},{num:103},{num:104},{num:105},{num:106},{num:107},{num:108},{num:109},{num:110},
  {num:111},{num:112},{num:113},{num:114},{num:115},{num:116},{num:117},{num:118},{num:119},{num:120},
  {num:121},{num:122},{num:123},{num:124},{num:125},{num:126},{num:127},{num:128},{num:129},{num:130},
  {num:131},{num:132},{num:133},{num:134},{num:135},{num:136},{num:137},{num:138},{num:139},{num:140},
  {num:141},{num:142},{num:143},{num:144},{num:145},{num:146},{num:147},{num:148},{num:149},{num:150},
  {num:151},{num:152},{num:153},{num:154},{num:155},{num:156},{num:157},{num:158},{num:159},{num:160},
  {num:161},{num:162},{num:163},{num:164},{num:165},{num:166},{num:167},{num:168},{num:169},{num:170},
  {num:171},{num:172},{num:173},{num:174},{num:175},{num:176},{num:177},{num:178},{num:179},{num:180},
  {num:181},{num:182},{num:183},{num:184},{num:185},{num:186},{num:187},{num:188},{num:189},{num:190},
  {num:191},{num:192},{num:193},{num:194},{num:195},{num:196},{num:197},{num:198},{num:199},{num:200},
  {num:201},{num:202},{num:203},{num:204},{num:205},{num:206},{num:207},{num:208},{num:209},{num:210},
  {num:211},{num:212},{num:213},{num:214},{num:215},{num:216},{num:217},{num:218},{num:219},{num:220},
  {num:221},{num:222},{num:223},{num:224},{num:225},{num:226},{num:227},{num:228},{num:229},{num:230},
  {num:231},{num:232},{num:233},{num:234},{num:235},{num:236},
];

const pad = n => String(n).padStart(3, '0');

/* ── HTTP helpers ─────────────────────────────────────────────── */

function get(targetUrl, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const parsed  = new URL(targetUrl);
    const lib     = parsed.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsed.hostname,
      path:     parsed.pathname + parsed.search,
      method:   'GET',
      headers:  { ...HEADERS, ...extraHeaders },
      timeout:  TIMEOUT_MS,
    };

    const req = lib.request(options, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : `${parsed.protocol}//${parsed.hostname}${res.headers.location}`;
        return get(redirectUrl, extraHeaders).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end',  () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
    });
    req.on('error',   reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ── Image download ───────────────────────────────────────────── */

async function downloadImage(imgUrl, destPath) {
  try {
    const res = await get(imgUrl, IMG_HEADERS);
    if (res.status === 200) {
      const ct = res.headers['content-type'] || '';
      if (ct.startsWith('image/') || res.body.length > 1000) {
        fs.writeFileSync(destPath, res.body);
        return true;
      }
    }
  } catch (_) {}
  return false;
}

/* ── Source: musclefigures.com gallery ───────────────────────── */

async function scrapeMuscleFiguresGallery() {
  console.log('\n[Source 1] Fetching musclefigures.com figure gallery…');
  let html;
  try {
    const res = await get('http://www.musclefigures.com/guides/figure-gallery/', {
      Referer: 'http://www.musclefigures.com/',
    });
    if (res.status !== 200) {
      console.log(`  → HTTP ${res.status}, skipping`);
      return [];
    }
    html = res.body.toString('utf8');
  } catch (e) {
    console.log(`  → Error: ${e.message}, skipping`);
    return [];
  }

  // Extract all jpg/png/webp image src values
  const imgRe = /src=["']([^"']*(?:wp-content|upload)[^"']*\.(?:jpg|jpeg|png|webp))["']/gi;
  const imgRe2 = /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  const found = new Set();
  let m;
  while ((m = imgRe.exec(html)))  found.add(m[1]);
  while ((m = imgRe2.exec(html))) found.add(m[1]);

  const urls = [...found].filter(u =>
    !u.includes('logo') && !u.includes('banner') && !u.includes('header')
    && !u.includes('footer') && !u.includes('icon') && !u.includes('bg')
  );

  console.log(`  → Found ${urls.length} candidate image URLs`);
  return urls.map(u => u.startsWith('http') ? u : `http://www.musclefigures.com${u}`);
}

/* ── Source: uofmuscle.com archive ───────────────────────────── */

async function scrapeUofMuscle() {
  console.log('\n[Source 2] Fetching uofmuscle.com figure archive…');
  let html;
  try {
    const res = await get('http://blog.uofmuscle.com/muscle-figure-archive/', {
      Referer: 'http://blog.uofmuscle.com/',
    });
    if (res.status !== 200) {
      console.log(`  → HTTP ${res.status}, skipping`);
      return [];
    }
    html = res.body.toString('utf8');
  } catch (e) {
    console.log(`  → Error: ${e.message}, skipping`);
    return [];
  }

  const imgRe = /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  const found = new Set();
  let m;
  while ((m = imgRe.exec(html))) found.add(m[1]);
  const urls = [...found].filter(u =>
    !u.includes('logo') && !u.includes('banner') && !u.includes('gravatar')
  );
  console.log(`  → Found ${urls.length} candidate image URLs`);
  return urls.map(u => u.startsWith('http') ? u : `http://blog.uofmuscle.com${u}`);
}

/* ── Source: Wayback Machine CDX API ─────────────────────────── */

async function getWaybackUrls(pattern) {
  const apiUrl = `http://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(pattern)}&output=json&fl=original,timestamp&limit=500&filter=statuscode:200&collapse=original`;
  try {
    const res = await get(apiUrl, { Referer: 'https://web.archive.org/' });
    if (res.status !== 200) return [];
    const data = JSON.parse(res.body.toString('utf8'));
    // data[0] is header row
    return data.slice(1).map(([original, ts]) => ({
      original,
      wayback: `https://web.archive.org/web/${ts}im_/${original}`,
    }));
  } catch (e) {
    console.log(`  Wayback CDX error: ${e.message}`);
    return [];
  }
}

async function scrapeWayback() {
  console.log('\n[Source 3] Querying Wayback Machine CDX API…');
  const patterns = [
    'musclefigures.com/wp-content/uploads/*.jpg',
    'musclefigures.com/wp-content/uploads/*.png',
    'blog.uofmuscle.com/wp-content/uploads/*.jpg',
    'soupie.littlerubberguys.com/mcia/*.jpg',
  ];

  const results = [];
  for (const pat of patterns) {
    console.log(`  Checking: ${pat}`);
    const r = await getWaybackUrls(pat);
    results.push(...r);
    await sleep(500);
  }

  // Filter to likely figure images (contain numbers in filename)
  const figureUrls = results.filter(({ original }) => {
    const basename = path.basename(original.split('?')[0]);
    return /\d/.test(basename) && !/\d{4}x\d{4}/.test(basename); // exclude thumbnails
  });

  console.log(`  → Found ${figureUrls.length} archived figure image URLs`);
  return figureUrls;
}

/* ── URL pattern fallbacks for musclefigures.com ─────────────── */

function buildGuessUrls(num) {
  const p = pad(num);
  const base = 'http://www.musclefigures.com/wp-content/uploads';
  return [
    `${base}/figure-${p}.jpg`,
    `${base}/figure${p}.jpg`,
    `${base}/MUSCLE-${p}.jpg`,
    `${base}/muscle-figure-${p}.jpg`,
    `${base}/fig${p}.jpg`,
    `${base}/MF${p}.jpg`,
    `${base}/${p}.jpg`,
  ];
}

/* ── Try to assign gallery URLs to figure numbers ────────────── */

function urlToFigureNum(imgUrl) {
  const basename = decodeURIComponent(path.basename(imgUrl.split('?')[0]));
  // Look for a 1-3 digit number in the filename
  const m = basename.match(/(?:^|[-_])(\d{1,3})(?:[-_.]|$)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 236) return n;
  }
  // Match standalone numbers
  const m2 = basename.match(/(\d{1,3})/);
  if (m2) {
    const n = parseInt(m2[1], 10);
    if (n >= 1 && n <= 236) return n;
  }
  return null;
}

/* ── Main download loop ───────────────────────────────────────── */

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Which figures still need images
  const needed = FIGURES.filter(f => {
    const dest = path.join(IMAGES_DIR, `figure-${pad(f.num)}.jpg`);
    return !fs.existsSync(dest);
  });

  if (needed.length === 0) {
    console.log('All 236 figure images already downloaded!');
    return;
  }
  console.log(`Need to download ${needed.length} figure images.`);

  const downloaded = new Set(
    FIGURES.filter(f => fs.existsSync(path.join(IMAGES_DIR, `figure-${pad(f.num)}.jpg`)))
           .map(f => f.num)
  );

  /* ── Step 1: Scrape gallery pages ── */
  const galleryUrls = await scrapeMuscleFiguresGallery();
  await sleep(DELAY_MS);
  const uofUrls = await scrapeUofMuscle();

  // Build a map: figureNum → list of candidate URLs
  const urlMap = {};

  // Map gallery URLs by their embedded number
  for (const u of [...galleryUrls, ...uofUrls]) {
    const num = urlToFigureNum(u);
    if (num) {
      if (!urlMap[num]) urlMap[num] = [];
      urlMap[num].push(u);
    }
  }

  /* ── Step 2: Wayback Machine ── */
  const waybackData = await scrapeWayback();
  for (const { original, wayback } of waybackData) {
    const num = urlToFigureNum(original);
    if (num) {
      if (!urlMap[num]) urlMap[num] = [];
      urlMap[num].push(wayback);  // prefer wayback URL
    }
  }

  /* ── Step 3: Guess URL patterns ── */
  // Add pattern guesses as last-resort fallback
  for (const { num } of FIGURES) {
    if (!urlMap[num]) urlMap[num] = [];
    urlMap[num].push(...buildGuessUrls(num));
  }

  /* ── Step 4: Download ── */
  console.log('\n[Downloading images]');
  let count = 0;
  let failed = [];

  for (const { num } of FIGURES) {
    if (downloaded.has(num)) continue;

    const dest = path.join(IMAGES_DIR, `figure-${pad(num)}.jpg`);
    const candidates = urlMap[num] || buildGuessUrls(num);
    let ok = false;

    for (const candidate of candidates) {
      process.stdout.write(`  #${pad(num)} → ${candidate.slice(0, 70)}… `);
      ok = await downloadImage(candidate, dest);
      if (ok) {
        console.log('✓');
        count++;
        break;
      } else {
        console.log('✗');
      }
      await sleep(200);
    }

    if (!ok) {
      failed.push(num);
      console.log(`  #${pad(num)} → ALL SOURCES FAILED`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n✅ Downloaded: ${count} images`);
  if (failed.length > 0) {
    console.log(`❌ Failed (${failed.length}): ${failed.map(pad).join(', ')}`);
    console.log('\nFor failed figures, try manually saving images from:');
    console.log('  http://www.musclefigures.com/guides/figure-gallery/');
    console.log('  http://blog.uofmuscle.com/muscle-figure-archive/');
    console.log(`  Then name them figure-NNN.jpg and place in: ${IMAGES_DIR}`);
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
