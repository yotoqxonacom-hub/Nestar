# Dizayn fayli

`nestar-furniture-design.html` — Figma uslubidagi yagona fayl: barcha sahifalar Desktop 1440 va
Mobile 390 skrinshotlari (ingliz tilida, Koreya shaharlari, agentlar, Reports bo'limi).

## Manba

- `source/mebel-next-en/` — skrinshotlar olingan inglizcha Next.js ilova (Report oynasi,
  My Page → My Reports, Admin → Reports shu yerda).
- `tools/capture.js` — barcha sahifalarni Playwright bilan suratga oladi (`frames/` papkasiga).
- `tools/build_figma.py` + `tools/figma_template.html` — suratlardan yagona HTML faylni yig'adi.

## Qayta yasash

```bash
cd design/source/mebel-next-en
npm install && npm run build && npx next start -p 3100   # alohida terminalda

cd design/tools
npm i playwright && npx playwright install chromium
node capture.js                     # frames/*.jpg + manifest.json
pip install pillow
python3 build_figma.py ../nestar-furniture-design.html
```
