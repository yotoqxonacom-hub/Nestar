import { useMemo } from 'react';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export const API_GRAPHQL_URL = process.env.REACT_APP_API_GRAPHQL_URL;
/** Backend manzili berilmagan bo'lsa, sayt demo ma'lumotlar bilan ishlaydi */
export const IS_DEMO = !API_GRAPHQL_URL;

const getToken = () => {
	if (typeof window === 'undefined') return '';
	try {
		return JSON.parse(localStorage.getItem('accessToken') || 'null') || '';
	} catch {
		return '';
	}
};

/** Nestar'dagi kabi har so'rovga JWT token qo'shiladi (Authorization: Bearer ...) */
const authLink = new ApolloLink((operation, forward) => {
	const token = getToken();
	operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
		headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
	}));
	return forward(operation);
});

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: authLink.concat(new HttpLink({ uri: API_GRAPHQL_URL || 'http://localhost:3007/graphql' })),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
	const client = apolloClient ?? createApolloClient();
	if (initialState) client.cache.restore(initialState);
	if (typeof window === 'undefined') return client;
	if (!apolloClient) apolloClient = client;
	return client;
}

export function useApollo(initialState: NormalizedCacheObject | null) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
