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
				<strong>Mahsulot topilmadi</strong>
				<Link href="/product" className="btn-dark">
					Katalogga qaytish
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
								<button key={i} className={slide === i ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`${i + 1}-rasm`}>
									<ProductImage product={product} index={i} />
								</button>
							))}
						</div>
					</div>

					<div className="buy-box">
						<div className="tags">
							<span>{typeLabel[product.productType]}</span>
							<span>{materialLabel[product.productMaterial]}</span>
							{product.productFoldable && <span>Yig'iladigan</span>}
							<span className={`status-chip ${sold ? 'SOLD' : 'ACTIVE'}`}>{sold ? "Sotuvda yo'q" : `Omborda: ${product.productLeftCount} dona`}</span>
						</div>
						<h1>{product.productName}</h1>
						<div className="sub">
							<span className="rating">
								<Rating value={avg || 5} precision={0.5} readOnly size="small" /> {avg ? avg.toFixed(1) : '—'} ({comments.length} sharh)
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
									<b>{formatSum(monthly(product))}</b> / oyiga · 12 oy, ustamasiz
								</div>
							)}
						</div>

						<div className="color-row">
							<span>Rang:</span>
							<i style={{ background: product.productColor }} />
							<small>Boshqa rangda buyurtma berish mumkin — sotuvchiga yozing</small>
						</div>

						<div className="actions">
							<div className="qty" aria-label="Soni">
								<button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Kamaytirish">
									<RemoveIcon />
								</button>
								<span className="tabular">{qty}</span>
								<button onClick={() => setQty(Math.min(product.productLeftCount || 1, qty + 1))} aria-label="Ko'paytirish">
									<AddIcon />
								</button>
							</div>
							<button className="btn-dark grow" disabled={sold} onClick={() => add(product._id, qty)}>
								{has(product._id) ? 'Yana qo‘shish' : 'Savatga qo‘shish'}
							</button>
							<button
								className="btn-accent grow"
								disabled={sold}
								onClick={() => {
									if (!has(product._id)) add(product._id, qty);
									router.push('/cart');
								}}
							>
								Hozir sotib olish
							</button>
							<button className={`like ${liked ? 'on' : ''}`} onClick={() => toggle(product._id)} aria-label="Sevimlilar">
								{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							</button>
						</div>

						<ul className="delivery">
							<li>
								<LocalShippingOutlinedIcon />
								<span>
									<b>Yetkazib berish:</b>{' '}
									{price * qty >= FREE_DELIVERY_FROM ? 'Toshkent bo‘ylab bepul, 1–2 kun' : `${formatSum(DELIVERY_PRICE)}, 1–2 kun`}
								</span>
							</li>
							<li>
								<VerifiedOutlinedIcon />
								<span>
									<b>Kafolat:</b> karkasga 3 yil, mexanizmga 1 yil
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
					</div>
				</div>

				<div className="options-config">
					<div className="option">
						<StraightenIcon />
						<span>O'lcham (E×Ch×B)</span>
						<b>
							{product.productWidth}×{product.productDepth}×{product.productHeight} sm
						</b>
					</div>
					<div className="option">
						<WeekendOutlinedIcon />
						<span>O'rindiqlar</span>
						<b>{product.productSeats}</b>
					</div>
					<div className="option">
						<TextureIcon />
						<span>Qoplama</span>
						<b>{materialLabel[product.productMaterial]}</b>
					</div>
					<div className="option">
						<CachedIcon />
						<span>Mexanizm</span>
						<b>{product.productFoldable ? 'Bor' : "Yo'q"}</b>
					</div>
					<div className="option">
						<ChairOutlinedIcon />
						<span>Turi</span>
						<b>{typeLabel[product.productType]}</b>
					</div>
				</div>

				<div className="detail-tabs">
					<div className="pill-tabs" role="tablist">
						<button role="tab" aria-selected={tab === 'desc'} className={tab === 'desc' ? 'active' : ''} onClick={() => setTab('desc')}>
							Tavsif
						</button>
						<button role="tab" aria-selected={tab === 'specs'} className={tab === 'specs' ? 'active' : ''} onClick={() => setTab('specs')}>
							Xususiyatlar
						</button>
						<button role="tab" aria-selected={tab === 'reviews'} className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>
							Sharhlar ({comments.length})
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
										['Turi', typeLabel[product.productType]],
										['Qoplama', materialLabel[product.productMaterial]],
										['Kengligi', `${product.productWidth} sm`],
										['Chuqurligi', `${product.productDepth} sm`],
										['Balandligi', `${product.productHeight} sm`],
										["O'rindiqlar soni", product.productSeats],
										["Yig'iladigan mexanizm", product.productFoldable ? 'Bor' : "Yo'q"],
										["Bo'lib to'lash", product.productInstallment ? '12 oygacha' : "Yo'q"],
										['Shourum', locationLabel[product.productLocation]],
										["Sotuvga qo'yilgan", formatDate(product.createdAt)],
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
										<strong>Sharh qoldiring</strong>
										<Rating value={rating} onChange={(_, v) => setRating(v)} />
									</div>
									<textarea
										id="review-text"
										placeholder="Mahsulot sizga yoqdimi? Sifati, yetkazib berish haqida yozing"
										value={draft}
										onChange={(e) => setDraft(e.target.value)}
									/>
									<button className="btn-dark" type="submit" disabled={!draft.trim()}>
										Yuborish
									</button>
								</form>
							) : (
								<div className="login-hint">
									Sharh yozish uchun <Link href="/account/join">tizimga kiring</Link>.
								</div>
							)}
							{comments.length === 0 && <div className="empty-list">Hozircha sharh yo'q — birinchi bo'lib yozing.</div>}
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
						<SectionHead title="O'xshash mahsulotlar" desc="Shu turdagi va shu sotuvchidan" />
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
