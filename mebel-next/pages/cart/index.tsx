import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ProductImage from '../../libs/components/common/ProductImage';
import { useCart } from '../../libs/hooks/useStore';
import { findProduct } from '../../libs/data/mock';
import { userVar } from '../../apollo/store';
import { PaymentType } from '../../libs/enums/order.enum';
import { finalPrice, formatSum, materialLabel, paymentLabel, typeLabel } from '../../libs/utils';
import { DELIVERY_PRICE, FREE_DELIVERY_FROM } from '../../libs/config';

/** Savat + buyurtma (Order / OrderItem). Backend ulanganda CREATE_ORDER mutatsiyasi chaqiriladi. */
const Cart: NextPage = () => {
	const { cart, setQty, remove, clear } = useCart();
	const user = useReactiveVar(userVar);
	const [payment, setPayment] = useState<PaymentType>(PaymentType.CARD);
	const [address, setAddress] = useState('');
	const [phone, setPhone] = useState('');
	const [placed, setPlaced] = useState<string | null>(null);

	const items = cart.map((i) => ({ ...i, product: findProduct(i.productId) })).filter((i) => i.product);
	const subtotal = items.reduce((s, i) => s + finalPrice(i.product!) * i.quantity, 0);
	const saved = items.reduce((s, i) => s + (i.product!.productPrice - finalPrice(i.product!)) * i.quantity, 0);
	const delivery = subtotal >= FREE_DELIVERY_FROM || subtotal === 0 ? 0 : DELIVERY_PRICE;
	const total = subtotal + delivery;

	const placeOrder = (e: React.FormEvent) => {
		e.preventDefault();
		setPlaced(`#${Math.floor(1030 + Math.random() * 900)}`);
		clear();
	};

	if (placed) {
		return (
			<div className="cart-page">
				<div className="container col">
					<div className="order-done">
						<CheckCircleOutlineIcon />
						<h2>Buyurtma {placed} qabul qilindi</h2>
						<p>Operatorimiz 15 daqiqa ichida qo'ng'iroq qilib, yetkazib berish vaqtini kelishib oladi.</p>
						<div className="row">
							<Link href="/mypage?category=orders" className="btn-dark">
								Buyurtmalarim
							</Link>
							<Link href="/product" className="btn-outline">
								Xaridni davom ettirish
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="cart-page">
				<div className="container col">
					<div className="empty-list">
						<ShoppingBagOutlinedIcon />
						<strong>Savatingiz bo'sh</strong>
						<span>Katalogdan yoqqan mebelni tanlab, savatga qo'shing.</span>
						<Link href="/product" className="btn-accent">
							Katalogga o'tish
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="cart-page">
			<div className="container">
				<div className="cart-items">
					<div className="cart-head">
						<h2>Savatdagi mahsulotlar ({items.length})</h2>
						<button onClick={clear}>Savatni tozalash</button>
					</div>
					{items.map(({ product, quantity }) => (
						<div className="cart-item" key={product!._id}>
							<Link href={`/product/detail?id=${product!._id}`} className="img">
								<ProductImage product={product!} />
							</Link>
							<div className="info">
								<Link href={`/product/detail?id=${product!._id}`} className="title">
									{product!.productName}
								</Link>
								<span className="meta">
									{typeLabel[product!.productType]} · {materialLabel[product!.productMaterial]} · {product!.productWidth}×{product!.productDepth} sm
								</span>
								<span className="seller">Sotuvchi: {product!.memberData?.memberFullName}</span>
							</div>
							<div className="qty">
								<button onClick={() => setQty(product!._id, quantity - 1)} aria-label="Kamaytirish">
									<RemoveIcon />
								</button>
								<span className="tabular">{quantity}</span>
								<button onClick={() => setQty(product!._id, Math.min(product!.productLeftCount, quantity + 1))} aria-label="Ko'paytirish">
									<AddIcon />
								</button>
							</div>
							<div className="price tabular">
								{product!.productDiscount > 0 && <s>{formatSum(product!.productPrice * quantity)}</s>}
								<b>{formatSum(finalPrice(product!) * quantity)}</b>
							</div>
							<button className="remove" onClick={() => remove(product!._id)} aria-label="O'chirish">
								<DeleteOutlineIcon />
							</button>
						</div>
					))}
				</div>

				<form className="checkout" onSubmit={placeOrder}>
					<h3>Buyurtmani rasmiylashtirish</h3>
					<div className="form-field">
						<label htmlFor="order-phone">Telefon raqam</label>
						<input id="order-phone" required placeholder="+998 90 123 45 67" value={phone || user.memberPhone || ''} onChange={(e) => setPhone(e.target.value)} />
					</div>
					<div className="form-field">
						<label htmlFor="order-address">Yetkazib berish manzili</label>
						<input
							id="order-address"
							required
							placeholder="Shahar, tuman, ko'cha, uy"
							value={address || user.memberAddress || ''}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</div>
					<div className="form-field">
						<span>To'lov turi</span>
						<div className="pay-options">
							{Object.values(PaymentType).map((p) => (
								<label key={p} className={payment === p ? 'active' : ''}>
									<input type="radio" name="payment" value={p} checked={payment === p} onChange={() => setPayment(p)} />
									{paymentLabel[p]}
								</label>
							))}
						</div>
					</div>
					<dl className="sum tabular">
						<div>
							<dt>Mahsulotlar</dt>
							<dd>{formatSum(subtotal + saved)}</dd>
						</div>
						{saved > 0 && (
							<div className="saved">
								<dt>Chegirma</dt>
								<dd>−{formatSum(saved)}</dd>
							</div>
						)}
						<div>
							<dt>Yetkazib berish</dt>
							<dd>{delivery === 0 ? 'Bepul' : formatSum(delivery)}</dd>
						</div>
						{payment === PaymentType.INSTALLMENT && (
							<div>
								<dt>Oylik to'lov (12 oy)</dt>
								<dd>{formatSum(Math.ceil(total / 12 / 1000) * 1000)}</dd>
							</div>
						)}
						<div className="total">
							<dt>Jami</dt>
							<dd>{formatSum(total)}</dd>
						</div>
					</dl>
					{delivery > 0 && <p className="hint">Yana {formatSum(FREE_DELIVERY_FROM - subtotal)} lik xarid qilsangiz, yetkazib berish bepul.</p>}
					{user?._id ? (
						<button type="submit" className="btn-accent">
							Buyurtma berish
						</button>
					) : (
						<Link href="/account/join" className="btn-dark">
							Buyurtma uchun tizimga kiring
						</Link>
					)}
				</form>
			</div>
		</div>
	);
};

export default withLayoutBasic(Cart);
