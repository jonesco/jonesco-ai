#!/usr/bin/env python3
"""
M.U.S.C.L.E. Figure Image Downloader (Python version)

Scrapes figure images from musclefigures.com and saves them to
muscle-catalog/images/figure-NNN.jpg

Usage:
    pip install requests beautifulsoup4
    python3 scripts/download-images.py

Optional (for better anti-bot bypass):
    pip install requests-html playwright
    playwright install chromium
    python3 scripts/download-images.py --browser
"""

import argparse
import os
import re
import sys
import time
from pathlib import Path

SCRIPT_DIR  = Path(__file__).parent
IMAGES_DIR  = SCRIPT_DIR.parent / 'images'
DELAY       = 0.8   # seconds between requests
TOTAL_FIGS  = 236

HEADERS = {
    'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                       '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
    'Connection':      'keep-alive',
}

IMG_HEADERS = {
    'User-Agent': HEADERS['User-Agent'],
    'Accept':     'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer':    'http://www.musclefigures.com/',
}

def pad(n):
    return str(n).zfill(3)

def dest_path(num):
    return IMAGES_DIR / f'figure-{pad(num)}.jpg'

# ─── Requests-based scraper ────────────────────────────────────────────────

def scrape_with_requests():
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        print('Missing deps. Run: pip install requests beautifulsoup4')
        sys.exit(1)

    session = requests.Session()
    session.headers.update(HEADERS)

    url_map = {}   # figureNum → [urls]

    # Source 1: musclefigures.com gallery
    print('\n[Source 1] musclefigures.com figure gallery…')
    try:
        r = session.get('http://www.musclefigures.com/guides/figure-gallery/', timeout=15)
        print(f'  HTTP {r.status_code}')
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, 'html.parser')
            imgs = soup.find_all('img')
            gallery_urls = []
            for img in imgs:
                src = img.get('src', '') or img.get('data-src', '')
                if src and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    if not any(skip in src.lower() for skip in ['logo', 'banner', 'header', 'icon']):
                        if not src.startswith('http'):
                            src = 'http://www.musclefigures.com' + src
                        gallery_urls.append(src)
            print(f'  Found {len(gallery_urls)} image URLs')
            for u in gallery_urls:
                num = url_to_figure_num(u)
                if num:
                    url_map.setdefault(num, []).append(u)
    except Exception as e:
        print(f'  Error: {e}')

    time.sleep(DELAY)

    # Source 2: uofmuscle.com
    print('\n[Source 2] uofmuscle.com figure archive…')
    try:
        r = session.get('http://blog.uofmuscle.com/muscle-figure-archive/', timeout=15)
        print(f'  HTTP {r.status_code}')
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, 'html.parser')
            imgs = soup.find_all('img')
            uof_urls = []
            for img in imgs:
                src = img.get('src', '') or img.get('data-src', '')
                if src and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    if not any(skip in src.lower() for skip in ['logo', 'banner', 'gravatar']):
                        if not src.startswith('http'):
                            src = 'http://blog.uofmuscle.com' + src
                        uof_urls.append(src)
            print(f'  Found {len(uof_urls)} image URLs')
            for u in uof_urls:
                num = url_to_figure_num(u)
                if num:
                    url_map.setdefault(num, []).append(u)
    except Exception as e:
        print(f'  Error: {e}')

    time.sleep(DELAY)

    # Source 3: Wayback Machine CDX API
    print('\n[Source 3] Wayback Machine CDX API…')
    patterns = [
        'musclefigures.com/wp-content/uploads/*.jpg',
        'blog.uofmuscle.com/wp-content/uploads/*.jpg',
        'soupie.littlerubberguys.com/mcia/*.jpg',
    ]
    for pat in patterns:
        try:
            api_url = (
                f'http://web.archive.org/cdx/search/cdx'
                f'?url={requests.utils.quote(pat)}'
                f'&output=json&fl=original,timestamp&limit=500'
                f'&filter=statuscode:200&collapse=original'
            )
            r = session.get(api_url, timeout=20)
            if r.status_code == 200:
                data = r.json()
                for original, ts in data[1:]:   # skip header row
                    wb_url = f'https://web.archive.org/web/{ts}im_/{original}'
                    num = url_to_figure_num(original)
                    if num:
                        url_map.setdefault(num, []).insert(0, wb_url)
                print(f'  {pat}: {len(data)-1} entries')
        except Exception as e:
            print(f'  CDX error for {pat}: {e}')
        time.sleep(0.5)

    # Add guess URLs as fallback
    for n in range(1, TOTAL_FIGS + 1):
        url_map.setdefault(n, []).extend(build_guess_urls(n))

    # Download
    _download_loop(session, url_map)


# ─── Playwright-based scraper (better anti-bot bypass) ────────────────────

def scrape_with_browser():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('Missing playwright. Run: pip install playwright && playwright install chromium')
        sys.exit(1)

    url_map = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page    = browser.new_page()
        page.set_extra_http_headers({'Accept-Language': 'en-US,en;q=0.9'})

        # Source 1: musclefigures.com gallery
        print('\n[Browser] Fetching musclefigures.com figure gallery…')
        try:
            page.goto('http://www.musclefigures.com/guides/figure-gallery/', timeout=30000)
            page.wait_for_load_state('networkidle', timeout=15000)
            imgs = page.query_selector_all('img')
            gallery_urls = []
            for img in imgs:
                src = img.get_attribute('src') or img.get_attribute('data-src') or ''
                if src and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    if not any(skip in src.lower() for skip in ['logo', 'banner', 'header', 'icon']):
                        gallery_urls.append(src)
            print(f'  Found {len(gallery_urls)} image URLs')
            for u in gallery_urls:
                num = url_to_figure_num(u)
                if num:
                    url_map.setdefault(num, []).append(u)
        except Exception as e:
            print(f'  Error: {e}')

        # Source 2: uofmuscle.com
        print('\n[Browser] Fetching uofmuscle.com figure archive…')
        try:
            page.goto('http://blog.uofmuscle.com/muscle-figure-archive/', timeout=30000)
            page.wait_for_load_state('networkidle', timeout=15000)
            imgs = page.query_selector_all('img')
            for img in imgs:
                src = img.get_attribute('src') or img.get_attribute('data-src') or ''
                if src and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    if not any(skip in src.lower() for skip in ['logo', 'banner', 'gravatar']):
                        num = url_to_figure_num(src)
                        if num:
                            url_map.setdefault(num, []).append(src)
        except Exception as e:
            print(f'  Error: {e}')

        browser.close()

    # Add guess URLs as fallback
    for n in range(1, TOTAL_FIGS + 1):
        url_map.setdefault(n, []).extend(build_guess_urls(n))

    import requests
    session = requests.Session()
    session.headers.update(HEADERS)
    _download_loop(session, url_map)


# ─── Helpers ──────────────────────────────────────────────────────────────

def url_to_figure_num(img_url):
    """Try to extract a figure number (1-236) from a URL."""
    basename = os.path.basename(img_url.split('?')[0])
    basename = os.path.splitext(basename)[0]

    # Match patterns like figure-001, fig001, MUSCLE-001, 001, etc.
    patterns = [
        r'(?:figure|fig|muscle|mf|fm)[-_]?(\d{1,3})',
        r'[-_](\d{1,3})[-_.]',
        r'^(\d{1,3})$',
        r'(\d{1,3})',
    ]
    for pat in patterns:
        m = re.search(pat, basename, re.IGNORECASE)
        if m:
            n = int(m.group(1))
            if 1 <= n <= 236:
                return n
    return None

def build_guess_urls(num):
    p = pad(num)
    base = 'http://www.musclefigures.com/wp-content/uploads'
    return [
        f'{base}/figure-{p}.jpg',
        f'{base}/figure{p}.jpg',
        f'{base}/MUSCLE-{p}.jpg',
        f'{base}/muscle-figure-{p}.jpg',
        f'{base}/fig{p}.jpg',
        f'{base}/{p}.jpg',
        f'http://blog.uofmuscle.com/wp-content/uploads/MUSCLE-Figure-{p}.jpg',
        f'http://blog.uofmuscle.com/wp-content/uploads/figure-{p}.jpg',
    ]

def _download_loop(session, url_map):
    import requests

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    needed  = [n for n in range(1, TOTAL_FIGS + 1) if not dest_path(n).exists()]
    print(f'\n[Downloading] {len(needed)} images needed')

    downloaded = 0
    failed     = []

    for num in needed:
        candidates = url_map.get(num, build_guess_urls(num))
        ok = False

        for cand in candidates:
            short = cand[:70]
            sys.stdout.write(f'  #{pad(num)} → {short}… ')
            sys.stdout.flush()
            try:
                r = session.get(cand, headers=IMG_HEADERS, timeout=15, stream=True)
                ct = r.headers.get('content-type', '')
                if r.status_code == 200 and ('image' in ct or len(r.content) > 1000):
                    dest_path(num).write_bytes(r.content)
                    print('✓')
                    downloaded += 1
                    ok = True
                    break
                else:
                    print(f'✗ ({r.status_code})')
            except Exception as e:
                print(f'✗ ({type(e).__name__})')
            time.sleep(0.2)

        if not ok:
            failed.append(num)
            print(f'  #{pad(num)} → ALL SOURCES FAILED')

        time.sleep(DELAY)

    print(f'\n✅ Downloaded: {downloaded} images')
    if failed:
        print(f'❌ Failed ({len(failed)}): {", ".join(pad(n) for n in failed)}')
        print('\nFor failed figures, manually save images as figure-NNN.jpg in:')
        print(f'  {IMAGES_DIR}')
        print('Good manual sources:')
        print('  http://www.musclefigures.com/guides/figure-gallery/')
        print('  http://blog.uofmuscle.com/muscle-figure-archive/')


# ─── Entry point ──────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Download M.U.S.C.L.E. figure images')
    parser.add_argument('--browser', action='store_true',
                        help='Use headless browser (Playwright) for better anti-bot bypass')
    args = parser.parse_args()

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    if args.browser:
        scrape_with_browser()
    else:
        scrape_with_requests()

if __name__ == '__main__':
    main()
