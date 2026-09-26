# Nestar Mebel — frontend

Yumshoq mebel do'koni uchun Next.js frontend. Tuzilishi `Nestar-next` (nestar.uz) bilan bir xil:
`pages/` + `libs/components` + `libs/enums|types` + `apollo/` + `scss/pc` va `scss/mobile`.
Ma'lumotlar modeli: [`../docs/ER-MODEL.md`](../docs/ER-MODEL.md).

## Ishga tushirish

```bash
cd mebel-next
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Backend manzili berilmasa sayt **demo rejimda** ishlaydi (`libs/data/mock.ts` dagi ma'lumotlar,
login istalgan nom + 6 belgili parol). Backend tayyor bo'lganda `.env.local` yarating:

```
REACT_APP_API_URL=http://localhost:3007
REACT_APP_API_GRAPHQL_URL=http://localhost:3007/graphql
```

GraphQL so'rov va mutatsiyalar `apollo/user/query.ts` va `apollo/user/mutation.ts` da tayyor.

## Sahifalar

| Yo'l | Sahifa |
|---|---|
| `/` | Bosh sahifa: hero + qidiruv, kategoriyalar, trend, ommabop, aksiya, top reyting, sotuvchilar, kolleksiyalar, hamjamiyat |
| `/product` | Katalog: filtr (turi, material, o'rindiq, imkoniyatlar, shahar, narx), saralash, sahifalash |
| `/product/detail?id=` | Mahsulot: galereya, narx va bo'lib to'lash, savat, xususiyatlar, sharhlar (comments), o'xshashlar |
| `/agent`, `/agent/detail?id=` | Sotuvchilar va sotuvchi sahifasi (follow) |
| `/cart` | Savat va buyurtma berish (Order / OrderItem) |
| `/mypage?category=` | Buyurtmalarim, sevimlilar, ko'rilganlar, maqolalarim, obunalar, profil |
| `/community`, `/community/detail?id=` | Hamjamiyat maqolalari, like va izohlar |
| `/cs?tab=notice\|faq\|inquiry` | Yordam markazi |
| `/account/join` | Kirish / ro'yxatdan o'tish (JWT) |
| `/about` | Biz haqimizda |
| `/_admin?category=` | Admin panel (faqat `memberType = ADMIN`) |

## PC va mobil

`libs/hooks/useDeviceDetect.ts` telefon user-agent'i yoki 768px dan tor oynada `mobile` qaytaradi.
Layoutlar `#pc-wrap` yoki `#mobile-wrap` ni tanlaydi:

- `scss/pc/*` — kompyuter uchun (1300px konteyner, fiksirlangan qorong'i navbar);
- `scss/mobile/main.scss` — telefon uchun (yuqorida ixcham sarlavha + menyu, pastda tab-bar,
  barmoq bilan suriladigan karusellar, filtr pastdan chiqadigan oynada).

## Autentifikatsiya

Sessiya ishlatilmaydi. `login` / `signup` javobidagi `accessToken` localStorage'da saqlanadi va
`apollo/client.ts` har so'rovga `Authorization: Bearer <token>` qo'shadi (`libs/auth/index.ts`).

## Rasmlar

Mahsulotda `productImages` bo'lmasa, `FurnitureArt` komponenti mebelni turi va rangiga qarab
vektor illyustratsiya qilib chizadi. Backend rasm yo'llarini qaytarsa, haqiqiy rasmlar ko'rinadi.
