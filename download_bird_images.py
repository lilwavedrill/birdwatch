# -*- coding: utf-8 -*-
"""Скачивает фото птиц через Wikipedia API в public/images/"""
import os
import json
import urllib.request

IMAGES_DIR = os.path.join(os.path.dirname(__file__), 'frontend', 'public', 'images')
os.makedirs(IMAGES_DIR, exist_ok=True)

# (filename, Wikipedia article title in English)
BIRDS = [
    ('bullfinch.jpg', 'Eurasian bullfinch'),
    ('tit.jpg', 'Great tit'),
    ('pigeon.jpg', 'Rock dove'),
    ('sparrow.jpg', 'House sparrow'),
    ('crow.jpg', 'Hooded crow'),
    ('starling.jpg', 'Common starling'),
    ('stork.jpg', 'White stork'),
    ('cuckoo.jpg', 'Common cuckoo'),
    ('bullfinch2.jpg', 'Eurasian bullfinch'),  # second bullfinch
    ('bluetit.jpg', 'Eurasian blue tit'),
]

headers = {
    'User-Agent': 'BirdWatchApp/1.0 (student coursework project)'
}

def get_wiki_image_url(title, width=600):
    """Get main image URL from Wikipedia article via REST API"""
    api_url = (
        f'https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.request.quote(title)}'
    )
    req = urllib.request.Request(api_url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))

    # Try thumbnail first (already resized), then original
    if 'thumbnail' in data:
        return data['thumbnail']['source']
    if 'originalimage' in data:
        return data['originalimage']['source']
    return None

for filename, title in BIRDS:
    path = os.path.join(IMAGES_DIR, filename)
    if os.path.exists(path):
        print(f'  SKIP {filename} (exists)')
        continue

    print(f'  {filename} <- "{title}"...')
    try:
        img_url = get_wiki_image_url(title)
        if not img_url:
            print(f'    FAIL: no image found')
            continue

        print(f'    URL: {img_url[:80]}...')
        req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp:
            img_data = resp.read()

        with open(path, 'wb') as f:
            f.write(img_data)
        print(f'    OK ({len(img_data) // 1024} KB)')
    except Exception as e:
        print(f'    FAIL: {e}')

print('\nDone! Check:', IMAGES_DIR)
