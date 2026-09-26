import React, { useRef } from 'react';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

interface Props {
	children: React.ReactNode;
	className?: string;
	showArrows?: boolean;
}

/** Scroll-snap asosidagi karusel: PC'da strelkalar, telefonda barmoq bilan suriladi */
const Carousel = ({ children, className = '', showArrows = true }: Props) => {
	const track = useRef<HTMLDivElement>(null);
	const move = (dir: number) => {
		const el = track.current;
		if (!el) return;
		const card = el.firstElementChild as HTMLElement | null;
		el.scrollBy({ left: dir * ((card?.offsetWidth || 300) + 24), behavior: 'smooth' });
	};
	return (
		<div className={`carousel ${className}`}>
			{showArrows && (
				<div className="carousel-arrows">
					<button onClick={() => move(-1)} aria-label="Previous">
						<WestIcon />
					</button>
					<button onClick={() => move(1)} aria-label="Next">
						<EastIcon />
					</button>
				</div>
			)}
			<div className="carousel-track" ref={track}>
				{React.Children.map(children, (child) => (
					<div className="carousel-slide">{child}</div>
				))}
			</div>
		</div>
	);
};

export default Carousel;
