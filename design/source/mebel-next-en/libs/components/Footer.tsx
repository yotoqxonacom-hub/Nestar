import React, { useState } from 'react';
import Link from 'next/link';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Logo from './common/Logo';
import { SUPPORT_PHONE } from '../config';
import { ProductType } from '../enums/product.enum';
import { typeLabel } from '../utils';

const Footer = () => {
	const [email, setEmail] = useState('');
	const [done, setDone] = useState(false);

	return (
		<footer className="footer">
			<div className="container footer-main">
				<div className="left">
					<Logo light />
					<div className="footer-box">
						<span>Total free customer care</span>
						<b>{SUPPORT_PHONE}</b>
					</div>
					<div className="footer-box">
						<span>Showroom: daily 9:00 – 21:00</span>
						<b>Seoul, Gangnam-gu, Teheran-ro 152</b>
					</div>
					<div className="footer-box">
						<span className="strong">Follow us on social media</span>
						<div className="media-box">
							<a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">
								<TelegramIcon />
							</a>
							<a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
								<InstagramIcon />
							</a>
							<a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
								<FacebookOutlinedIcon />
							</a>
							<a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
								<YouTubeIcon />
							</a>
						</div>
					</div>
				</div>
				<div className="right">
					<form
						className="subscribe"
						onSubmit={(e) => {
							e.preventDefault();
							if (email.includes('@')) setDone(true);
						}}
					>
						<strong>Keep yourself up to date</strong>
						<div className="subscribe-row">
							<input
								id="footer-email"
								type="email"
								placeholder="Your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<button type="submit">{done ? 'Subscribed' : 'Subscribe'}</button>
						</div>
					</form>
					<div className="links">
						<div>
							<strong>Shop</strong>
							{[ProductType.SOFA, ProductType.CORNER_SOFA, ProductType.ARMCHAIR, ProductType.BED].map((t) => (
								<Link key={t} href={`/product?type=${t}`}>
									{typeLabel[t]}
								</Link>
							))}
						</div>
						<div>
							<strong>Customer help</strong>
							<Link href="/cs?tab=faq">Delivery</Link>
							<Link href="/cs?tab=faq">Installments</Link>
							<Link href="/cs?tab=notice">Warranty</Link>
							<Link href="/cs?tab=inquiry">Ask a question</Link>
						</div>
						<div>
							<strong>Company</strong>
							<Link href="/about">About us</Link>
							<Link href="/agent">Agents</Link>
							<Link href="/community?articleCategory=NEWS">News</Link>
							<Link href="/account/join">Become an agent</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="container footer-second">
				<span>© Nestar Furniture - All rights reserved. Nestar 2026</span>
				<span>Privacy · Terms · Sitemap</span>
			</div>
		</footer>
	);
};

export default Footer;
