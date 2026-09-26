import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Rating } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import TextureIcon from '@mui/icons-material/Texture';
import CachedIcon from '@mui/icons-material/Cached';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ReportDialog from '../../libs/components/common/ReportDialog';
import { ReportGroup } from '../../libs/enums/report.enum';
import ProductImage from '../../libs/components/common/ProductImage';
import ProductCard from '../../libs/components/common/ProductCard';
import Carousel from '../../libs/components/common/Carousel';
import SectionHead from '../../libs/components/common/SectionHead';
import { Avatar } from '../../libs/components/common/AgentCard';
import { findProduct, productComments, products } from '../../libs/data/mock';
import { useCart, useLikes, pushRecent } from '../../libs/hooks/useStore';
import { userVar } from '../../apollo/store';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Comment } from '../../libs/types/comment';
import { daysAgo, finalPrice, formatDate, formatSum, locationLabel, materialLabel, monthly, typeLabel } from '../../libs/utils';
import { ProductStatus } from '../../libs/enums/product.enum';
import { DELIVERY_PRICE, FREE_DELIVERY_FROM } from '../../libs/config';

const ProductDetail: NextPage = () => {
	const router = useRouter();
	const product = findProduct(router.query.id) ?? (router.isReady ? undefined : products[0]);
	const user = useReactiveVar(userVar);
	const { isLiked, toggle } = useLikes();
	const { add, has } = useCart();
	const [slide, setSlide] = useState(0);
	const [qty, setQty] = useState(1);
	const [tab, setTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
	const [comments, setComments] = useState<Comment[]>([]);
	const [draft, setDraft] = useState('');
	const [rating, setRating] = useState<number | null>(5);

	useEffect(() => {
		if (!product) return;
		pushRecent(product._id);
		setComments(productComments.filter((c) => c.commentRefId === product._id));
		setSlide(0);
		setQty(1);
	}, [product?._id]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!product) {
		return (
			<div className="product-detail container empty-list">
				<strong>Furniture not found</strong>
				<Link href="/product" className="btn-dark">
					Back to furniture
				</Link>
			</div>
		);
	}

	const liked = isLiked(product._id);
	const sold = product.productStatus === ProductStatus.SOLD || product.productLeftCount === 0;
	const avg = comments.length ? comments.reduce((s, c) => s + (c.rating ?? 5), 0) / comments.length : 0;
	const similar = products.filter((p) => p._id !== product._id && (p.productType === product.productType || p.memberId === product.memberId)).slice(0, 8);
	const price = finalPrice(product);

	const submitComment = (e: React.FormEvent) => {
		e.preventDefault();
		if (!draft.trim()) return;
		setComments([
			{
				_id: `local-${Date.now()}`,
				commentStatus: CommentStatus.ACTIVE,
				commentGroup: CommentGroup.PRODUCT,
				commentContent: draft.trim(),
				commentRefId: product._id,
				memberId: user._id as string,
				createdAt: new Date(Date.UTC(2026, 8, 25)).toISOString(),
				updatedAt: new Date().toISOString(),
				memberData: user as Comment['memberData'],
				rating: rating ?? 5,
			},
			...comments,
		]);
		setDraft('');
	};

	return (
		<div className="product-detail">
			<div className="container col">
				<div className="detail-top">
					<div className="gallery">
						<div className="main-image">
							<ProductImage product={product} index={slide} />
							{product.productDiscount > 0 && <span className="sale">-{product.productDiscount}%</span>}
						</div>
						<div className="thumbs">
							{[0, 1, 2, 3].map((i) => (
								<button key={i} className={slide === i ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`Image ${i + 1}`}>
									<ProductImage product={product} index={i} />
								</button>
							))}
						</div>
					</div>

					<div className="buy-box">
						<div className="tags">
							<span>{typeLabel[product.productType]}</span>
							<span>{materialLabel[product.productMaterial]}</span>
							{product.productFoldable && <span>Sofa bed</span>}
							<span className={`status-chip ${sold ? 'SOLD' : 'ACTIVE'}`}>{sold ? 'Sold out' : `In stock: ${product.productLeftCount}`}</span>
						</div>
						<h1>{product.productName}</h1>
						<div className="sub">
							<span className="rating">
								<Rating value={avg || 5} precision={0.5} readOnly size="small" /> {avg ? avg.toFixed(1) : '—'} ({comments.length} reviews)
							</span>
							<span>
								<PlaceOutlinedIcon /> {locationLabel[product.productLocation]}
							</span>
							<span>
								<RemoveRedEyeOutlinedIcon /> {product.productViews}
							</span>
							<span>{daysAgo(product.createdAt)}</span>
						</div>

						<div className="price-box">
							<div>
								{product.productDiscount > 0 && <s>{formatSum(product.productPrice)}</s>}
								<strong className="tabular">{formatSum(price)}</strong>
							</div>
							{product.productInstallment && (
								<div className="installment">
									<b>{formatSum(monthly(product))}</b> / month · 12 months, 0% interest
								</div>
							)}
						</div>

						<div className="color-row">
							<span>Color:</span>
							<i style={{ background: product.productColor }} />
							<small>Other colors available on request — contact the agent</small>
						</div>

						<div className="actions">
							<div className="qty" aria-label="Quantity">
								<button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
									<RemoveIcon />
								</button>
								<span className="tabular">{qty}</span>
								<button onClick={() => setQty(Math.min(product.productLeftCount || 1, qty + 1))} aria-label="Increase">
									<AddIcon />
								</button>
							</div>
							<button className="btn-dark grow" disabled={sold} onClick={() => add(product._id, qty)}>
								{has(product._id) ? 'Add one more' : 'Add to cart'}
							</button>
							<button
								className="btn-accent grow"
								disabled={sold}
								onClick={() => {
									if (!has(product._id)) add(product._id, qty);
									router.push('/cart');
								}}
							>
								Buy now
							</button>
							<button className={`like ${liked ? 'on' : ''}`} onClick={() => toggle(product._id)} aria-label="Favorites">
								{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							</button>
						</div>

						<ul className="delivery">
							<li>
								<LocalShippingOutlinedIcon />
								<span>
									<b>Delivery:</b>{' '}
									{price * qty >= FREE_DELIVERY_FROM ? 'Free in Seoul, 1–2 days' : `${formatSum(DELIVERY_PRICE)}, 1–2 days`}
								</span>
							</li>
							<li>
								<VerifiedOutlinedIcon />
								<span>
									<b>Warranty:</b> 3 years on the frame, 1 year on mechanisms
								</span>
							</li>
						</ul>

						{product.memberData && (
							<div className="seller">
								<Avatar member={product.memberData} size={48} />
								<div>
									<Link href={`/agent/detail?id=${product.memberId}`}>{product.memberData.memberFullName}</Link>
									<span>{product.memberData.memberAddress}</span>
								</div>
								<a className="call" href={`tel:${product.memberData.memberPhone.replace(/\s/g, '')}`}>
									<PhoneOutlinedIcon /> {product.memberData.memberPhone}
								</a>
							</div>
						)}
						<div className="report-row">
							<span>Something wrong with this listing?</span>
							<ReportDialog
								group={ReportGroup.PRODUCT}
								refId={product._id}
								targetName={product.productName}
								label="Report this furniture"
								defaultOpen={router.query.report === '1'}
							/>
						</div>
					</div>
				</div>

				<div className="options-config">
					<div className="option">
						<StraightenIcon />
						<span>Size (W×D×H)</span>
						<b>
							{product.productWidth}×{product.productDepth}×{product.productHeight} cm
						</b>
					</div>
					<div className="option">
						<WeekendOutlinedIcon />
						<span>Seats</span>
						<b>{product.productSeats}</b>
					</div>
					<div className="option">
						<TextureIcon />
						<span>Upholstery</span>
						<b>{materialLabel[product.productMaterial]}</b>
					</div>
					<div className="option">
						<CachedIcon />
						<span>Mechanism</span>
						<b>{product.productFoldable ? 'Yes' : 'No'}</b>
					</div>
					<div className="option">
						<ChairOutlinedIcon />
						<span>Type</span>
						<b>{typeLabel[product.productType]}</b>
					</div>
				</div>

				<div className="detail-tabs">
					<div className="pill-tabs" role="tablist">
						<button role="tab" aria-selected={tab === 'desc'} className={tab === 'desc' ? 'active' : ''} onClick={() => setTab('desc')}>
							Description
						</button>
						<button role="tab" aria-selected={tab === 'specs'} className={tab === 'specs' ? 'active' : ''} onClick={() => setTab('specs')}>
							Specifications
						</button>
						<button role="tab" aria-selected={tab === 'reviews'} className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>
							Reviews ({comments.length})
						</button>
					</div>

					{tab === 'desc' && (
						<div className="tab-body desc">
							<p>{product.productDesc}</p>
						</div>
					)}

					{tab === 'specs' && (
						<div className="tab-body">
							<table className="spec-table">
								<tbody>
									{[
										['Type', typeLabel[product.productType]],
										['Upholstery', materialLabel[product.productMaterial]],
										['Width', `${product.productWidth} cm`],
										['Depth', `${product.productDepth} cm`],
										['Height', `${product.productHeight} cm`],
										['Seats', product.productSeats],
										['Sofa bed mechanism', product.productFoldable ? 'Yes' : 'No'],
										['Installments', product.productInstallment ? 'Up to 12 months' : 'No'],
										['Location', locationLabel[product.productLocation]],
										['Listed on', formatDate(product.createdAt)],
									].map(([k, v]) => (
										<tr key={k as string}>
											<th>{k}</th>
											<td>{v}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{tab === 'reviews' && (
						<div className="tab-body reviews">
							{user?._id ? (
								<form className="review-form" onSubmit={submitComment}>
									<div className="row">
										<strong>Leave a review</strong>
										<Rating value={rating} onChange={(_, v) => setRating(v)} />
									</div>
									<textarea
										id="review-text"
										placeholder="How do you like it? Tell others about the quality and delivery"
										value={draft}
										onChange={(e) => setDraft(e.target.value)}
									/>
									<button className="btn-dark" type="submit" disabled={!draft.trim()}>
										Submit review
									</button>
								</form>
							) : (
								<div className="login-hint">
									<Link href="/account/join">Log in</Link> to write a review.
								</div>
							)}
							{comments.length === 0 && <div className="empty-list">No reviews yet — be the first to write one.</div>}
							{comments.map((c) => (
								<div className="review" key={c._id}>
									<Avatar member={c.memberData} size={44} />
									<div>
										<div className="head">
											<b>{c.memberData?.memberFullName || c.memberData?.memberNick}</b>
											<Rating value={c.rating ?? 5} readOnly size="small" />
											<span>{formatDate(c.createdAt)}</span>
										</div>
										<p>{c.commentContent}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{similar.length > 0 && (
					<div className="similar">
						<SectionHead title="Similar Furniture" desc="Same type or from the same agent" />
						<Carousel>
							{similar.map((p) => (
								<ProductCard key={p._id} product={p} />
							))}
						</Carousel>
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutBasic(ProductDetail);
