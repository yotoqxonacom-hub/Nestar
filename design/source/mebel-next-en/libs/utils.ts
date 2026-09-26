import { ProductLocation, ProductMaterial, ProductType } from './enums/product.enum';
import { OrderStatus, PaymentType } from './enums/order.enum';
import { BoardArticleCategory } from './enums/board-article.enum';
import { Product } from './types/product';

export const formatSum = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export const finalPrice = (p: Pick<Product, 'productPrice' | 'productDiscount'>) =>
	Math.round((p.productPrice * (100 - (p.productDiscount || 0))) / 100);

/** 12 monthly installments, interest free */
export const monthly = (p: Pick<Product, 'productPrice' | 'productDiscount'>) => Math.ceil(finalPrice(p) / 12);

export const typeLabel: Record<ProductType, string> = {
	[ProductType.SOFA]: 'Sofa',
	[ProductType.CORNER_SOFA]: 'Corner sofa',
	[ProductType.ARMCHAIR]: 'Armchair',
	[ProductType.BED]: 'Upholstered bed',
	[ProductType.POUF]: 'Pouf',
	[ProductType.MATTRESS]: 'Mattress',
	[ProductType.KIDS]: 'Kids',
};

export const materialLabel: Record<ProductMaterial, string> = {
	[ProductMaterial.FABRIC]: 'Fabric',
	[ProductMaterial.VELVET]: 'Velvet',
	[ProductMaterial.MICROFIBER]: 'Microfiber',
	[ProductMaterial.LEATHER]: 'Leather',
	[ProductMaterial.ECO_LEATHER]: 'Eco leather',
};

export const locationLabel: Record<ProductLocation, string> = {
	[ProductLocation.SEOUL]: 'Seoul',
	[ProductLocation.BUSAN]: 'Busan',
	[ProductLocation.INCHEON]: 'Incheon',
	[ProductLocation.DAEGU]: 'Daegu',
	[ProductLocation.GYEONGJU]: 'Gyeongju',
	[ProductLocation.GWANGJU]: 'Gwangju',
	[ProductLocation.CHONJU]: 'Chonju',
	[ProductLocation.DAEJON]: 'Daejon',
	[ProductLocation.JEJU]: 'Jeju',
};

export const orderStatusLabel: Record<OrderStatus, string> = {
	[OrderStatus.PAUSE]: 'Pending',
	[OrderStatus.PROCESS]: 'Processing',
	[OrderStatus.DELIVERY]: 'On the way',
	[OrderStatus.FINISH]: 'Delivered',
	[OrderStatus.CANCEL]: 'Cancelled',
	[OrderStatus.DELETE]: 'Deleted',
};

export const paymentLabel: Record<PaymentType, string> = {
	[PaymentType.CASH]: 'Cash',
	[PaymentType.CARD]: 'Card',
	[PaymentType.INSTALLMENT]: 'Installments',
};

export const categoryLabel: Record<BoardArticleCategory, string> = {
	[BoardArticleCategory.FREE]: 'Free board',
	[BoardArticleCategory.RECOMMEND]: 'Recommend',
	[BoardArticleCategory.NEWS]: 'News',
	[BoardArticleCategory.INTERIOR]: 'Interior',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (iso: string) => {
	const d = new Date(iso);
	return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

/** Demo data is dated 2026-09-25, so relative dates are counted from there */
export const daysAgo = (iso: string) => {
	const diff = Math.max(0, Math.floor((Date.UTC(2026, 8, 25) - new Date(iso).getTime()) / 86400000));
	return diff === 0 ? 'today' : `${diff} days ago`;
};

export const parseArtKey = (key: string) => {
	const [type, color] = key.split(':');
	return { type, color: color || '#999999' };
};

export const isRealImage = (src?: string) => !!src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('uploads'));

export const reportReasonLabel: Record<string, string> = {
	WRONG_DESCRIPTION: 'Wrong description or photos',
	POOR_QUALITY: 'Poor quality',
	FAKE_PRODUCT: 'Fake or copied product',
	RUDE_AGENT: 'Rude or unresponsive agent',
	NOT_DELIVERED: 'Order not delivered',
	OTHER: 'Other',
};

export const reportStatusLabel: Record<string, string> = {
	PENDING: 'Pending review',
	RESOLVED: 'Resolved',
	REJECTED: 'Rejected',
};

export const reportGroupLabel: Record<string, string> = {
	PRODUCT: 'Furniture',
	MEMBER: 'Agent',
	ARTICLE: 'Article',
};
