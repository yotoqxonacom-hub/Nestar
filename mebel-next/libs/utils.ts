import { ProductLocation, ProductMaterial, ProductType } from './enums/product.enum';
import { OrderStatus, PaymentType } from './enums/order.enum';
import { BoardArticleCategory } from './enums/board-article.enum';
import { Product } from './types/product';

export const formatSum = (n: number) => `${Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ')} so'm`;

export const finalPrice = (p: Pick<Product, 'productPrice' | 'productDiscount'>) =>
	Math.round((p.productPrice * (100 - (p.productDiscount || 0))) / 100 / 1000) * 1000;

/** 12 oyga bo'lib to'lash (ustamasiz) */
export const monthly = (p: Pick<Product, 'productPrice' | 'productDiscount'>) => Math.ceil(finalPrice(p) / 12 / 1000) * 1000;

export const typeLabel: Record<ProductType, string> = {
	[ProductType.SOFA]: 'Divan',
	[ProductType.CORNER_SOFA]: 'Burchak divan',
	[ProductType.ARMCHAIR]: 'Kreslo',
	[ProductType.BED]: 'Yumshoq karavot',
	[ProductType.POUF]: 'Puf',
	[ProductType.MATTRESS]: 'Matras',
	[ProductType.KIDS]: 'Bolalar mebeli',
};

export const materialLabel: Record<ProductMaterial, string> = {
	[ProductMaterial.FABRIC]: 'Mato',
	[ProductMaterial.VELVET]: 'Velur',
	[ProductMaterial.MICROFIBER]: 'Mikrofibra',
	[ProductMaterial.LEATHER]: 'Tabiiy charm',
	[ProductMaterial.ECO_LEATHER]: 'Eko-charm',
};

export const locationLabel: Record<ProductLocation, string> = {
	[ProductLocation.TASHKENT]: 'Toshkent',
	[ProductLocation.SAMARKAND]: 'Samarqand',
	[ProductLocation.BUKHARA]: 'Buxoro',
	[ProductLocation.ANDIJAN]: 'Andijon',
	[ProductLocation.FERGANA]: "Farg'ona",
	[ProductLocation.NAMANGAN]: 'Namangan',
	[ProductLocation.NAVOI]: 'Navoiy',
	[ProductLocation.KASHKADARYA]: 'Qashqadaryo',
	[ProductLocation.SURKHANDARYA]: 'Surxondaryo',
	[ProductLocation.KHOREZM]: 'Xorazm',
	[ProductLocation.JIZZAKH]: 'Jizzax',
	[ProductLocation.SIRDARYA]: 'Sirdaryo',
	[ProductLocation.KARAKALPAKSTAN]: "Qoraqalpog'iston",
};

export const orderStatusLabel: Record<OrderStatus, string> = {
	[OrderStatus.PAUSE]: 'Kutilmoqda',
	[OrderStatus.PROCESS]: 'Tayyorlanmoqda',
	[OrderStatus.DELIVERY]: "Yo'lda",
	[OrderStatus.FINISH]: 'Yetkazildi',
	[OrderStatus.CANCEL]: 'Bekor qilindi',
	[OrderStatus.DELETE]: "O'chirilgan",
};

export const paymentLabel: Record<PaymentType, string> = {
	[PaymentType.CASH]: 'Naqd',
	[PaymentType.CARD]: 'Karta',
	[PaymentType.INSTALLMENT]: "Bo'lib to'lash",
};

export const categoryLabel: Record<BoardArticleCategory, string> = {
	[BoardArticleCategory.FREE]: 'Erkin mavzu',
	[BoardArticleCategory.RECOMMEND]: 'Tavsiyalar',
	[BoardArticleCategory.NEWS]: 'Yangiliklar',
	[BoardArticleCategory.INTERIOR]: 'Interyer',
};

const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];
export const formatDate = (iso: string) => {
	const d = new Date(iso);
	return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
};

/** Demo ma'lumotlar 2026-09-25 holatiga yozilgan, shuning uchun hisob shu sanadan */
export const daysAgo = (iso: string) => {
	const diff = Math.max(0, Math.floor((Date.UTC(2026, 8, 25) - new Date(iso).getTime()) / 86400000));
	return diff === 0 ? 'bugun' : `${diff} kun oldin`;
};

/** "SOFA:#7b8f74" ko'rinishidagi demo rasm kalitini ajratadi */
export const parseArtKey = (key: string) => {
	const [type, color] = key.split(':');
	return { type, color: color || '#999999' };
};

export const isRealImage = (src?: string) => !!src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('uploads'));
