import decodeJwt from 'jwt-decode';
import ApolloLinkTimeout from 'apollo-link-timeout';
import {onError} from '@apollo/client/link/error';
import {setContext} from '@apollo/client/link/context';
import {ApolloProvider as BaseApolloProvider, ApolloClient, InMemoryCache, createHttpLink, gql as baseGql, useMutation as baseUseMutation, useQuery as baseUseQuery, useLazyQuery as baseUseLazyQuery} from '@apollo/client';

// noinspection JSUnusedGlobalSymbols
export const gql = baseGql;
export const useQuery = baseUseQuery;
export const useLazyQuery = baseUseLazyQuery;
export const useMutation = baseUseMutation;
export const ApolloProvider = BaseApolloProvider;
export const jwtDecode = decodeJwt;

export const createClient = ({publicOperations = {}, fetch = undefined, fetchOptions = undefined, getCurrentTokens, setCurrentTokens, refreshTokens, onLogout, onAuthError, uri, timeout = 5000}: any) => {
    const authClient = new ApolloClient({
        link: onError(() => {}).concat(new ApolloLinkTimeout(timeout).concat(createHttpLink({uri, fetch, fetchOptions}))),
        cache: new InMemoryCache(),
        defaultOptions: {query: {fetchPolicy: 'no-cache'}},
    });
    const authLink = setContext(async (req, { headers }) => {
        let {token, refreshToken} = await getCurrentTokens();
        if (!token) {
            if (!!publicOperations && !!publicOperations[req.operationName || '']) return {headers}; // non-authentified is allowed for this operation
            onLogout && await onLogout();
            return;
        }
        const decodedToken = decodeJwt(token) as any;
        const now = Math.floor(Date.now() / 1000);
        if (((decodedToken || {}).exp - now) < 1) {
            try {
                if (!refreshToken) {
                    onAuthError && await onAuthError(new Error(`No refresh-token available`));
                    return;
                }
                const tokenData = await refreshTokens(refreshToken, authClient);
                if (!tokenData || !tokenData.refreshToken || !tokenData.token) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error(`Unable to refresh the token (jwt expired ?)`);
                }
                await setCurrentTokens(tokenData);
                token = tokenData.token;
            } catch (e) {
                onLogout && await onLogout();
                throw e;
            }
        }
        return {headers: {...headers, authorization: token ? `Bearer ${token}` : ''}};
    });
    return new ApolloClient({
        link: onError(() => {}).concat(authLink.concat(new ApolloLinkTimeout(timeout)
            .concat(createHttpLink({uri, fetch, fetchOptions})))),
        cache: new InMemoryCache({}),
    });
};

export default createClient