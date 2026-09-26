# Nestar Furniture — loyiha eslatmasi

Bu branch (`claude/furniture-store-er-model-ezqtk7`) yumshoq mebel do'koni ishlarini saqlaydi.
`master` va `develop` (asl Nestar kodi) o'zgartirilmagan. 26-sentabr 2026 holati: `59fa9d8` commiti (dizayn + backend + ER model).

## Asosiy natijalar (oxirgi versiyalar)

| Nima | Yo'l | Izoh |
|---|---|---|
| ER model (hujjat) | `docs/ER-MODEL.md` | Mermaid diagramma, enumlar, indekslar, biznes qoidalari, `reports` bilan |
| ER diagramma | `docs/er-diagram.html`, `docs/er-diagram.png` | Datensen uslubidagi qorong'i diagramma, `reports` jadvali bilan |
| Figma uslubidagi dizayn | `design/nestar-furniture-design.html` | 36 sahifa / 70 ekran (Desktop 1440 + Mobile 390), ingliz tilida, Koreya shaharlari, agentlar, Reports bo'limi |
| Furniture backend | `Furniture/` | Nestar `develop` nusxasi: property → product, `furniture-api` + `furniture-batch`, report moduli |

## Furniture backend

- NestJS monorepo: `Furniture/apps/furniture-api` (GraphQL API) va `Furniture/apps/furniture-batch`.
- Nestar mantiqi o'zgarmagan; `property/Property/PROPERTY` → `product/Product/PRODUCT` (fayl, klass, maydon, API, kolleksiya).
- `ProductType`: SOFA, CORNER_SOFA, ARMCHAIR, BED, POUF, MATTRESS, KIDS. `BoardArticleCategory`: HUMOR → INTERIOR.
- `productRent` olib tashlangan, "(1)"/"(2)" dublikat fayllar o'chirilgan. `Message` enum o'zgarmagan.
- Report moduli: `createReport`, `getMyReports`, `getAllReportsByAdmin`, `updateReportByAdmin`;
  `ReportGroup` (MEMBER/PRODUCT/ARTICLE), `ReportReason`, `ReportStatus` (PENDING/RESOLVED/REJECTED);
  RESOLVED bo'lsa javobgar a'zoning `memberWarnings` +1.
- MongoDB ulanishi: `apps/*/src/database/database.module.ts`, `.env` dagi `MONGO_DEV` / `MONGO_PROD`
  (`.env` gitignore qilingan, `SECRET_TOKEN`, `PORT_API`, `PORT_BATCH` ham kerak).
- Tekshiruv: `npx nest build furniture-api` va `npx nest build furniture-batch` xatosiz.

## Boshqa papkalar

- `mebel-next/` — o'zbekcha Next.js frontend (demo ma'lumotlar bilan). Report hali qo'shilmagan.
- Dizayn faylidagi inglizcha ekranlar vaqtinchalik nusxadan olingan; ularning manba kodi repoda yo'q.

## Havolalar

- ER diagramma artifact: https://claude.ai/artifact/RiWJSUNMAK4kGwMtdLgnZ3
- Dizayn artifact: https://claude.ai/artifact/4CM5JKbZGynQg3zoUWiiMW
