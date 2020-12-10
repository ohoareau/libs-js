import i18n from 'i18next';
import decodeJwt from 'jwt-decode';
import {onError} from 'apollo-link-error';
import {setContext} from 'apollo-link-context';
import {useCallback} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import ApolloLinkTimeout from 'apollo-link-timeout';
import {ApolloClient, gql} from 'apollo-boost';

export const ACTION_TYPE_USER_LOGOUT = 'USER_LOGOUT';
export const ACTION_TYPE_USER_CHANGED = 'USER_CHANGED';
export const ACTION_TYPE_USER_SET_LOCALE = 'USER_SET_LOCALE';

export const changeLocaleAction = locale => ({type: ACTION_TYPE_USER_SET_LOCALE, payload: {locale}});
export const logoutAction = () => ({type: ACTION_TYPE_USER_LOGOUT});
export const userChangedAction = payload => ({type: ACTION_TYPE_USER_CHANGED, payload});
export const goRouteAction = route => ({type: '@@router/CALL_HISTORY_METHOD', payload: {method: 'push', args: [route]}});

const GQL_CREATE_USER_TOKEN = gql`
    mutation createAuthToken($data: CreateAuthTokenInput!) {
        createAuthToken(data: $data) {
            token
            refreshToken
        }
    }
`;

const GQL_REFRESH_USER_TOKEN = gql`
    mutation refreshAuthToken($data: RefreshAuthTokenInput!) {
        refreshAuthToken(data: $data) {
            token
            refreshToken
        }
    }
`;
/*
const GQL_COMPLETE_NEW_PASSWORD = gql`
    mutation completeNewPassword($username: String!, $password: String) {
        completeNewPassword(username: $username, password: $password) {
            __typename
        }
    }
`;

const GQL_COMPLETE_PASSWORD_RESET = gql`
    mutation completePasswordReset($username: String!, $code: String!, $password: String) {
        completePasswordReset(username: $username, code: $code, password: $password) {
            __typename
        }
    }
`;
*/
const buildFieldError = (t, m) => {
    if (!m.code) return {_: [{message: (m && m.message) ? m.message : t('errors_auth_generic')}]};
    switch (m.code) {
        case 'auth_password_policy_restriction':
            return {password: [m]};
        case 'auth_code_mismatch':
            return {securityCode: [m]};
        case 'auth_limit_exceeded':
            return {securityCode: [m]};
        case 'auth_bad_credentials':
            return {password: [m]};
        case 'auth_missing_groups':
            return {username: [m]};
        case 'auth_unknown_user':
            return {username: [m]};
        default:
            return {password: [m]};
    }
};

export const triggerRefreshToken = async (refreshToken, client) =>
    (await client.mutate({
        mutation: GQL_REFRESH_USER_TOKEN,
        variables: {data: {refreshToken}}
    })).data
;

export const useLogin = (dispatch, client: any = undefined, options: any = {}) => {
    const {query = GQL_CREATE_USER_TOKEN, loginView = 'login'} = options;
    const [createAuthToken, {loading, error}] = useMutation(query, {
        client,
        onCompleted: async ({createAuthToken}) => dispatch(userChangedAction(createAuthToken)),
    });
    const submit = useCallback(async data => {
        try {
            await createAuthToken({variables: {data}});
        } catch (e) {
        }
    }, [createAuthToken]);

    return {submit, loading, errors: error ? [{errorInfo: buildFieldError(i18n.t, error)}] : [], view: loginView};
};

export const useChangeLocale = (dispatch) => {
    return useCallback(locale => dispatch(changeLocaleAction(locale)), [dispatch]);
};

export const useLogout = (dispatch, targetRoute = undefined) => {
    return useCallback(async () => {
        dispatch(logoutAction());
        targetRoute && dispatch(goRouteAction(targetRoute));
    }, [dispatch, targetRoute]);
};

const defaultUserState = {token: undefined, refreshToken: undefined, authenticated: false};

export const isUserMatchingRequiredRole = (user, role) =>
    !role.length ? true : !!role.find(x => (user.permissions || []).includes(x))
;

export const reducerFactory = ({requiredRole = []} = {}) => (state: any = undefined, action) => {
    if (undefined === state) state = {...defaultUserState, locale: i18n.languages ? i18n.languages[0] : 'en'};
    switch(action.type) {
        case ACTION_TYPE_USER_CHANGED:
            const user = decodeJwt(action.payload.token);
            return {
                locale: state.locale,
                ...user,
                username: user.username || user.email,
                authenticated: true,
                matchRequiredRole: isUserMatchingRequiredRole(user, requiredRole),
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
            };
        case ACTION_TYPE_USER_LOGOUT:
            return {...defaultUserState, locale: i18n.languages[0]};
        case ACTION_TYPE_USER_SET_LOCALE:
            i18n.changeLanguage(action.payload.locale).then();
            return {...state, locale: action.payload.locale};
        default:
            return state;
    }
};

export const reducer = reducerFactory();

export const onBeforeLiftCreator = ({store, reducerKey = 'user'}) => () => {
    const state = store.getState();
    state && state[reducerKey] && state[reducerKey].locale && i18n.changeLanguage(state[reducerKey].locale).then();
};

export const createClient = ({store, uri, timeout = 5000, reducerKey = 'user'}) => {
    const authClient = new ApolloClient({
        link: onError(() => {}).concat(new ApolloLinkTimeout(timeout).concat(createHttpLink({uri}))),
        cache: new InMemoryCache(),
        defaultOptions: {query: {fetchPolicy: 'no-cache'}},
    });
    const authLink = setContext(async (_, { headers }) => {
        let {token, refreshToken} = store.getState()[reducerKey];
        if (!token) {
            await store.dispatch(logoutAction());
            return;
        }
        const decodedToken = decodeJwt(token);
        const now = Math.floor(Date.now() / 1000);
        if ((decodedToken.exp - now) < 1) {
            try {
                if (!refreshToken) {
                    await store.dispatch(new Error(`No refresh-token available`));
                    return;
                }
                const tokenData = await triggerRefreshToken(refreshToken, authClient);
                if (!tokenData || !tokenData.refreshToken || !tokenData.token) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error(`Unable to refresh the token (jwt expired ?)`);
                }
                await store.dispatch(userChangedAction(tokenData));
                token = store.getState()[reducerKey].token;
            } catch (e) {
                await store.dispatch(logoutAction());
                throw e;
            }
        }
        return {headers: {...headers, authorization: token ? `Bearer ${token}` : ''}};
    });
    return new ApolloClient({
        link: onError(() => {}).concat(authLink.concat(new ApolloLinkTimeout(timeout)
            .concat(createHttpLink({uri})))),
        cache: new InMemoryCache({}),
    });
};