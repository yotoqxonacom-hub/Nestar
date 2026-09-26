import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import FurnitureArt from '../../libs/components/common/FurnitureArt';

const STEPS = [
	{ year: '2014', text: "Chilonzorda 40 m² lik birinchi sex: kuniga 2 ta divan." },
	{ year: '2018', text: "O'z mato ombori va 12 kishilik jamoa. Samarqandda ikkinchi shourum." },
	{ year: '2022', text: 'Onlayn do‘kon va bo‘lib to‘lash xizmati ishga tushdi.' },
	{ year: '2026', text: "40+ sotuvchi bitta platformada, 13 viloyatga yetkazib berish." },
];

const About: NextPage = () => (
	<div className="about-page">
		<div className="container">
			<div className="about-text">
				<h2>Yumshoq mebelni onlayn tanlash oson bo'lishi kerak</h2>
				<p>
					Nestar Mebel — O'zbekistondagi yumshoq mebel ishlab chiqaruvchilari va xaridorlarni bog'laydigan platforma. Har bir
					mahsulotda aniq o'lchamlar, material va haqiqiy xaridorlar sharhlari bor.
				</p>
				<ul className="timeline">
					{STEPS.map((s) => (
						<li key={s.year}>
							<b>{s.year}</b>
							<span>{s.text}</span>
						</li>
					))}
				</ul>
				<Link href="/product" className="btn-accent">
					Katalogni ko'rish
				</Link>
			</div>
			<div className="about-art">
				<FurnitureArt type="CORNER_SOFA" color="#8a8f99" variant={0} />
			</div>
		</div>
	</div>
);

export default withLayoutBasic(About);
