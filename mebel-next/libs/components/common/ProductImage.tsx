import { Product } from '../../types/product';
import { REACT_APP_API_URL } from '../../config';
import { isRealImage } from '../../utils';
import FurnitureArt from './FurnitureArt';

interface Props {
	product: Pick<Product, 'productImages' | 'productType' | 'productColor' | 'productMaterial' | 'productName'>;
	index?: number;
	className?: string;
}

/** Backend rasmi bo'lsa — uni, bo'lmasa demo illyustratsiyani ko'rsatadi */
const ProductImage = ({ product, index = 0, className = '' }: Props) => {
	const src = product.productImages?.[index];
	if (isRealImage(src)) {
		const url = src!.startsWith('http') || src!.startsWith('/') ? src! : `${REACT_APP_API_URL}/${src}`;
		return <img className={`product-image ${className}`} src={url} alt={product.productName} loading="lazy" />;
	}
	const type = product.productType === 'SOFA' && product.productMaterial === 'LEATHER' ? 'CHESTER' : product.productType;
	return <FurnitureArt className={`product-image ${className}`} type={type} color={product.productColor} variant={index} />;
};

export default ProductImage;
