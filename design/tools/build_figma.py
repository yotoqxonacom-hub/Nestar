"""Builds a single Figma-like HTML file from frames/*.jpg + frames/manifest.json."""
import base64, io, json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
FR = os.path.join(HERE, 'frames')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'nestar-furniture-design.html')

manifest = json.load(open(os.path.join(FR, 'manifest.json')))

def b64(data):
    return 'data:image/jpeg;base64,' + base64.b64encode(data).decode()

def thumb(path, width):
    im = Image.open(path).convert('RGB')
    h = round(im.height * width / im.width)
    im = im.resize((width, h), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=70, optimize=True)
    return buf.getvalue()

SECTION_ORDER = ['Home', 'Furniture', 'Agents', 'Cart', 'My Page', 'Community', 'Reports', 'CS', 'Account', 'Admin', 'Mobile UI']

pages = {}
for m in manifest:
    key = m['id']
    p = pages.setdefault(key, {'id': key, 'section': m['section'], 'title': m['title']})
    path = os.path.join(FR, m['file'])
    p[m['mode']] = {
        'w': m['w'],
        'h': m['h'],
        'full': b64(open(path, 'rb').read()),
        'thumb': b64(thumb(path, 300 if m['mode'] == 'pc' else 130)),
    }

sections = []
for name in SECTION_ORDER:
    items = [p for p in pages.values() if p['section'] == name]
    if items:
        sections.append({'name': name, 'pages': items})

data = json.dumps(sections, separators=(',', ':'))
screens = sum(1 for p in pages.values() for k in ('pc', 'mobile') if k in p)

html = open(os.path.join(HERE, 'figma_template.html')).read()
html = html.replace('__DATA__', data).replace('__SCREENS__', str(screens)).replace('__PAGES__', str(len(pages)))
open(OUT, 'w').write(html)
print(OUT, round(os.path.getsize(OUT) / 1e6, 2), 'MB', screens, 'screens')
