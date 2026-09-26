import React from 'react';
import Head from 'next/head';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useHydrateStore } from '../../hooks/useStore';
import Top from '../Top';
import Footer from '../Footer';
import HeroFilter from '../homepage/HeroFilter';

/** Bosh sahifa layouti: navbar + katta hero va qidiruv filtri (Nestar: LayoutHome) */
const withLayoutMain = (Component: any) => {
	const Wrapped = (props: any) => {
		const device = useDeviceDetect();
		useHydrateStore();

		return (
			<>
				<Head>
					<title>Nestar Furniture</title>
					<meta name="description" content="Sofas, corner sofas, armchairs, upholstered beds and mattresses. Delivery across Korea." />
				</Head>
				<div id={device === 'mobile' ? 'mobile-wrap' : 'pc-wrap'}>
					<div id="top">
						<Top />
					</div>
					<HeroFilter />
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

export default withLayoutMain;
