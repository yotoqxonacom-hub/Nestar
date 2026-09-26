import Link from 'next/link';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import { Product } from '../../types/product';
import { ProductStatus } from '../../enums/product.enum';
import { finalPrice, formatSum, locationLabel, materialLabel, monthly, typeLabel } from '../../utils';
import { useCart, useLikes } from '../../hooks/useStore';
import ProductImage from './ProductImage';

interface Props {
	product: Product;
	size?: 'normal' | 'wide';
}

const ProductCard = ({ product, size = 'normal' }: Props) => {
	const { isLiked, toggle } = useLikes();
	const { add, has } = useCart();
	const liked = isLiked(product._id);
	const sold = product.productStatus === ProductStatus.SOLD || product.productLeftCount === 0;
	const href = `/product/detail?id=${product._id}`;

	return (
		<article className={`product-card ${size}`}>
			<Link href={href} className="card-img">
				<ProductImage product={product} />
				<div className="badges">
					{product.productDiscount > 0 && <span className="badge sale">-{product.productDiscount}%</span>}
					{sold && <span className="badge sold">Sold out</span>}
					{product.productFoldable && <span className="badge">Sofa bed</span>}
				</div>
			</Link>
			<IconButton
				className={`like-btn ${liked ? 'on' : ''}`}
				aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
				onClick={() => toggle(product._id)}
			>
				{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
			</IconButton>
			<div className="info">
				<div className="meta">
					<span>{typeLabel[product.productType]}</span>
					<span className="dot" />
					<span>{materialLabel[product.productMaterial]}</span>
				</div>
				<Link href={href} className="title">
					{product.productName}
				</Link>
				<div className="specs">
					<span>
						{product.productWidth}×{product.productDepth} cm
					</span>
					<span>{product.productSeats} seats</span>
					<span>{locationLabel[product.productLocation]}</span>
				</div>
				<div className="bottom">
					<div className="price">
						{product.productDiscount > 0 && <s>{formatSum(product.productPrice)}</s>}
						<strong>{formatSum(finalPrice(product))}</strong>
						{product.productInstallment && <small>{formatSum(monthly(product))} /mo × 12</small>}
					</div>
					<button
						className={`cart-btn ${has(product._id) ? 'in' : ''}`}
						disabled={sold}
						onClick={() => add(product._id)}
						aria-label="Add to cart"
					>
						{has(product._id) ? <CheckIcon /> : <AddShoppingCartIcon />}
					</button>
				</div>
				<div className="stats">
					<span>
						<RemoveRedEyeOutlinedIcon /> {product.productViews}
					</span>
					<span>
						<FavoriteBorderIcon /> {product.productLikes + (liked ? 1 : 0)}
					</span>
				</div>
			</div>
		</article>
	);
};

export default ProductCard;
