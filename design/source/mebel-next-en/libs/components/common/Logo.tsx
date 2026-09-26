import Link from 'next/link';
import { BRAND } from '../../config';

const Logo = ({ light = false }: { light?: boolean }) => (
	<Link href="/" className={`logo ${light ? 'light' : ''}`} aria-label={BRAND}>
		<span className="logo-mark">
			<svg viewBox="0 0 40 40" aria-hidden="true">
				<circle cx="20" cy="20" r="20" fill="#eb6753" />
				<path d="M9 22.5c0-2 1.3-3 3-3s3 1 3 3V24h10v-1.5c0-2 1.3-3 3-3s3 1 3 3V28H9z" fill="#fff" />
				<path d="M13 19.2V16c0-1.7 1.3-3 3-3h8c1.7 0 3 1.3 3 3v3.2" stroke="#fff" strokeWidth="2" fill="none" />
				<path d="M11 28v2.5M29 28v2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
			</svg>
		</span>
		<span className="logo-text">
			NESTAR<small>furniture</small>
		</span>
	</Link>
);

export default Logo;
