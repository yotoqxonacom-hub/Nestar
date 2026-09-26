import { jwtDecode } from 'jwt-decode';
import { initializeApollo, IS_DEMO } from '../../apollo/client';
import { LOGIN, SIGN_UP } from '../../apollo/user/mutation';
import { clearSession, saveSession } from '../hooks/useStore';
import { demoUser } from '../data/mock';
import { CustomJwtPayload } from '../types/customJwtPayload';
import { Member } from '../types/member';

/**
 * JWT autentifikatsiya (Nestar'dagi kabi). Server sessiya saqlamaydi:
 * login/signup javobidagi accessToken localStorage'da turadi va har so'rovga
 * Authorization: Bearer <token> sarlavhasi bilan qo'shiladi (apollo/client.ts).
 */

const fromToken = (token: string): Partial<Member> => {
	const p = jwtDecode<CustomJwtPayload>(token);
	return {
		_id: p._id,
		memberNick: p.memberNick,
		memberPhone: p.memberPhone,
		memberFullName: p.memberFullName,
		memberImage: p.memberImage,
		memberType: p.memberType as Member['memberType'],
	};
};

export const logIn = async (memberNick: string, memberPassword: string) => {
	if (IS_DEMO) {
		saveSession({ ...demoUser, memberNick: memberNick || demoUser.memberNick }, 'demo-token');
		return;
	}
	const client = initializeApollo();
	const { data } = await client.mutate({ mutation: LOGIN, variables: { input: { memberNick, memberPassword } } });
	const token: string = data.login.accessToken;
	saveSession({ ...data.login, ...fromToken(token) }, token);
};

export const signUp = async (memberNick: string, memberPassword: string, memberPhone: string, memberType: string) => {
	if (IS_DEMO) {
		saveSession({ ...demoUser, memberNick, memberPhone, memberType: memberType as Member['memberType'] }, 'demo-token');
		return;
	}
	const client = initializeApollo();
	const { data } = await client.mutate({
		mutation: SIGN_UP,
		variables: { input: { memberNick, memberPassword, memberPhone, memberType } },
	});
	const token: string = data.signup.accessToken;
	saveSession({ ...data.signup, ...fromToken(token) }, token);
};

export const logOut = () => {
	clearSession();
	if (typeof window !== 'undefined') window.location.href = '/';
};
