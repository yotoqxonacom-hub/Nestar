import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import FurnitureArt from '../../libs/components/common/FurnitureArt';

const STEPS = [
	{ year: '2014', text: 'Our first 40 m² workshop in Gangnam: two sofas a day.' },
	{ year: '2018', text: 'Our own fabric warehouse and a team of 12. A second showroom in Busan.' },
	{ year: '2022', text: 'Online store and installment payments launched.' },
	{ year: '2026', text: '40+ agents on one platform, delivering to 9 cities.' },
];

const About: NextPage = () => (
	<div className="about-page">
		<div className="container">
			<div className="about-text">
				<h2>Choosing soft furniture online should be easy</h2>
				<p>
					Nestar Furniture connects soft-furniture makers and agents across Korea with customers. Every listing shows exact
					dimensions, materials and reviews from real buyers.
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
					Browse furniture
				</Link>
			</div>
			<div className="about-art">
				<FurnitureArt type="CORNER_SOFA" color="#8a8f99" variant={0} />
			</div>
		</div>
	</div>
);

export default withLayoutBasic(About);
