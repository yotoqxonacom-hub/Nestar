import { makeVar } from '@apollo/client';
import { Member } from '../libs/types/member';
import { CartItem } from '../libs/types/order';

export const userVar = makeVar<Partial<Member>>({});
export const cartVar = makeVar<CartItem[]>([]);
export const likedVar = makeVar<string[]>([]);
export const recentVar = makeVar<string[]>([]);
