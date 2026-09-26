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
						<span>Bepul qo'ng'iroq markazi</span>
						<b>{SUPPORT_PHONE}</b>
					</div>
					<div className="footer-box">
						<span>Shourum: har kuni 9:00 – 21:00</span>
						<b>Toshkent, Chilonzor 9-kvartal</b>
					</div>
					<div className="footer-box">
						<span className="strong">Ijtimoiy tarmoqlarda</span>
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
						<strong>Chegirmalardan birinchi bo'lib xabardor bo'ling</strong>
						<div className="subscribe-row">
							<input
								id="footer-email"
								type="email"
								placeholder="Email manzilingiz"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<button type="submit">{done ? 'Obuna bo‘ldingiz' : 'Obuna bo‘lish'}</button>
						</div>
					</form>
					<div className="links">
						<div>
							<strong>Katalog</strong>
							{[ProductType.SOFA, ProductType.CORNER_SOFA, ProductType.ARMCHAIR, ProductType.BED].map((t) => (
								<Link key={t} href={`/product?type=${t}`}>
									{typeLabel[t]}
								</Link>
							))}
						</div>
						<div>
							<strong>Xaridorlarga</strong>
							<Link href="/cs?tab=faq">Yetkazib berish</Link>
							<Link href="/cs?tab=faq">Bo'lib to'lash</Link>
							<Link href="/cs?tab=notice">Kafolat</Link>
							<Link href="/cs?tab=inquiry">Savol berish</Link>
						</div>
						<div>
							<strong>Kompaniya</strong>
							<Link href="/about">Biz haqimizda</Link>
							<Link href="/agent">Sotuvchilar</Link>
							<Link href="/community?articleCategory=NEWS">Yangiliklar</Link>
							<Link href="/account/join">Sotuvchi bo'lish</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="container footer-second">
				<span>© Nestar Mebel, 2026. Barcha huquqlar himoyalangan.</span>
				<span>Maxfiylik · Foydalanish shartlari · Sayt xaritasi</span>
			</div>
		</footer>
	);
};

export default Footer;
