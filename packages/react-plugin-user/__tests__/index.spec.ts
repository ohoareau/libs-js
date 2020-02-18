import {logoutAction, userChangedAction, changeLocaleAction, goRouteAction} from '..';
import * as plugin from '..';

describe('actionTypes', () => {
    [
        ['ACTION_TYPE_USER_LOGOUT', 'USER_LOGOUT'],
        ['ACTION_TYPE_USER_CHANGED', 'USER_CHANGED'],
        ['ACTION_TYPE_USER_SET_LOCALE', 'USER_SET_LOCALE'],
    ]
        .forEach(
            ([name, value]) => it(name, () => {
                expect(plugin[name]).toEqual(value);
            })
        )
    ;
});

describe('actions', () => {
    it('logoutAction', () => {
        expect(logoutAction()).toEqual({type: 'USER_LOGOUT'});
    });
    it('userChangedAction', () => {
        expect(userChangedAction({a: 'b', c: 12})).toEqual({type: 'USER_CHANGED', payload: {a: 'b', c: 12}});
        expect(userChangedAction({c: 'd', e: true})).toEqual({type: 'USER_CHANGED', payload: {c: 'd', e: true}});
    });
    it('changeLocaleAction', () => {
        expect(changeLocaleAction('fr')).toEqual({type: 'USER_SET_LOCALE', payload: {locale: 'fr'}});
        expect(changeLocaleAction('en')).toEqual({type: 'USER_SET_LOCALE', payload: {locale: 'en'}});
    });
    it('goRouteAction', () => {
        expect(goRouteAction('/')).toEqual({type: '@@router/CALL_HISTORY_METHOD', payload: {method: 'push', args: ['/']}});
        expect(goRouteAction('/some-thing')).toEqual({type: '@@router/CALL_HISTORY_METHOD', payload: {method: 'push', args: ['/some-thing']}});
    })
});