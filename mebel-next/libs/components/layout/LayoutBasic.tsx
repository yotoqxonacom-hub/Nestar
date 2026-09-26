import React, { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useHydrateStore } from '../../hooks/useStore';
import Top from '../Top';
import Footer from '../Footer';
import FurnitureArt from '../common/FurnitureArt';

const HEADERS: Record<string, { title: string; desc: string; art: [string, string] }> = {
	'/product': { title: 'Katalog', desc: "Divan, kreslo, karavot va matraslar — bir joyda", art: ['CORNER_SOFA', '#3f6b6a'] },
	'/product/detail': { title: 'Mahsulot', desc: 'Katalog', art: ['SOFA', '#7b8f74'] },
	'/agent': { title: 'Sotuvchilar', desc: 'Ishonchli shourum va ishlab chiqaruvchilar', art: ['ARMCHAIR', '#c9a27a'] },
	'/agent/detail': { title: 'Sotuvchi sahifasi', desc: 'Sotuvchilar', art: ['ARMCHAIR', '#c9a27a'] },
	'/cart': { title: 'Savat', desc: 'Buyurtmani rasmiylashtirish', art: ['POUF', '#d98b7e'] },
	'/mypage': { title: 'Mening sahifam', desc: 'Buyurtmalar, sevimlilar va profil', art: ['BED', '#5b6b8c'] },
	'/community': { title: 'Hamjamiyat', desc: "Interyer maslahatlari va xaridorlar tajribasi", art: ['SOFA', '#b9b2a5'] },
	'/community/detail': { title: 'Maqola', desc: 'Hamjamiyat', art: ['SOFA', '#b9b2a5'] },
	'/cs': { title: 'Yordam markazi', desc: "E'lonlar, ko'p so'raladigan savollar va murojaatlar", art: ['MATTRESS', '#9fb6c9'] },
	'/account/join': { title: 'Kirish / Ro‘yxatdan o‘tish', desc: 'JWT orqali xavfsiz autentifikatsiya', art: ['ARMCHAIR', '#4d4f55'] },
	'/about': { title: 'Biz haqimizda', desc: "2014 yildan beri uyingizga qulaylik", art: ['CORNER_SOFA', '#8a8f99'] },
};

/** Ichki sahifalar layouti: navbar + sarlavhali banner (Nestar: LayoutBasic) */
const withLayoutBasic = (Component: any) => {
	const Wrapped = (props: any) => {
		const router = useRouter();
		const device = useDeviceDetect();
		useHydrateStore();
		const header = useMemo(() => HEADERS[router.pathname] ?? HEADERS['/product'], [router.pathname]);
		const crumbParent = router.pathname.split('/').length > 2 ? `/${router.pathname.split('/')[1]}` : null;

		return (
			<>
				<Head>
					<title>{`${header.title} — Nestar Mebel`}</title>
				</Head>
				<div id={device === 'mobile' ? 'mobile-wrap' : 'pc-wrap'}>
					<div id="top">
						<Top />
					</div>
					<section className={`header-basic ${router.pathname === '/account/join' ? 'auth' : ''}`}>
						<div className="header-art">
							<FurnitureArt type={header.art[0]} color={header.art[1]} variant={1} />
						</div>
						<div className="container">
							<div className="crumbs">
								<Link href="/">Bosh sahifa</Link>
								{crumbParent && (
									<>
										<span>/</span>
										<Link href={crumbParent}>{header.desc}</Link>
									</>
								)}
								<span>/</span>
								<b>{header.title}</b>
							</div>
							<h1>{header.title}</h1>
							{!crumbParent && <p>{header.desc}</p>}
						</div>
					</section>
					<main id="main">
						<Component {...props} />
					</main>
					<div id="footer">
						<Footer />
					</div>
				</div>
			</>
		);
	};
	return Wrapped;
};

export default withLayoutBasic;
