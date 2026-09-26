import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { cartVar, likedVar, recentVar, userVar } from '../../apollo/store';
import { CartItem } from '../types/order';
import { Member } from '../types/member';

const read = <T,>(key: string, fallback: T): T => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
};

const write = (key: string, value: unknown) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* private mode — faqat xotirada qoladi */
	}
};

let hydrated = false;

/** localStorage'dagi savat, sevimlilar va login ma'lumotini reactive var'larga bir marta yuklaydi */
export const useHydrateStore = () => {
	useEffect(() => {
		if (hydrated) return;
		hydrated = true;
		cartVar(read<CartItem[]>('cart', []));
		likedVar(read<string[]>('liked', []));
		recentVar(read<string[]>('recent', []));
		const token = read<string | null>('accessToken', null);
		const member = read<Partial<Member> | null>('member', null);
		if (token && member) userVar({ ...member, accessToken: token });
	}, []);
};

export const useCart = () => {
	const cart = useReactiveVar(cartVar);
	const set = (next: CartItem[]) => {
		cartVar(next);
		write('cart', next);
	};
	return {
		cart,
		count: cart.reduce((s, i) => s + i.quantity, 0),
		has: (productId: string) => cart.some((i) => i.productId === productId),
		add: (productId: string, quantity = 1) => {
			const found = cart.find((i) => i.productId === productId);
			set(
				found
					? cart.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i))
					: [...cart, { productId, quantity }],
			);
		},
		setQty: (productId: string, quantity: number) =>
			set(cart.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))),
		remove: (productId: string) => set(cart.filter((i) => i.productId !== productId)),
		clear: () => set([]),
	};
};

export const useLikes = () => {
	const liked = useReactiveVar(likedVar);
	return {
		liked,
		isLiked: (id: string) => liked.includes(id),
		toggle: (id: string) => {
			const next = liked.includes(id) ? liked.filter((x) => x !== id) : [...liked, id];
			likedVar(next);
			write('liked', next);
		},
	};
};

export const pushRecent = (id: string) => {
	const next = [id, ...recentVar().filter((x) => x !== id)].slice(0, 12);
	recentVar(next);
	write('recent', next);
};

export const saveSession = (member: Partial<Member>, token: string) => {
	write('member', member);
	write('accessToken', token);
	userVar({ ...member, accessToken: token });
};

export const clearSession = () => {
	try {
		localStorage.removeItem('member');
		localStorage.removeItem('accessToken');
	} catch {
		/* ignore */
	}
	userVar({});
};
