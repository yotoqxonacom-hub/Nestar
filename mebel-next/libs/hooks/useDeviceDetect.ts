import { useEffect, useState } from 'react';

/**
 * Nestar'dagi kabi: 'mobile' | 'desktop'.
 * Telefon user-agent'i yoki 768px dan tor oyna — mobil ko'rinish.
 */
const useDeviceDetect = (): 'mobile' | 'desktop' => {
	const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');

	useEffect(() => {
		const detect = () => {
			const mobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			setDevice(mobileUa || window.innerWidth < 768 ? 'mobile' : 'desktop');
		};
		detect();
		window.addEventListener('resize', detect);
		return () => window.removeEventListener('resize', detect);
	}, []);

	return device;
};

export default useDeviceDetect;
