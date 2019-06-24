import { predefined_role, protect } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";
import UnsatisfiedRoleError from "../../src/errors/UnsatisfiedRoleError";
import UnknownPredefinedRoleError from "../../src/errors/UnknownPredefinedRoleError";

describe('predefined_role', () => {
    [
        ['multiple',
            {}, ['@create'], ['any', 'anonymous'],
            [],
            [
                matchingRule('@', 'prepare', 'define role `any` as always true'),
                matchingRule('@', 'prepare', 'define role `anonymous` as not authenticated'),
            ],
            undefined,
        ],
        ['any',
            {}, ['@create'], 'any',
            [protect('@create', 'any')],
            [
                matchingRule('@', 'prepare', 'define role `any` as always true'),
            ],
            undefined,
        ],
        ['any - protected',
            {}, ['@create'], 'any',
            [protect('@create', 'any')],
            [
                matchingRule('@', 'prepare', 'define role `any` as always true'),
            ],
            undefined,
        ],
        ['admin@platform',
            {caller: {platform: true}}, ['@create'], 'admin@platform',
            [protect('@create', 'admin@platform')],
            [
                matchingRule('@', 'prepare', 'define role `admin@platform` as technical account of the platform'),
            ],
            undefined,
        ],
        ['admin@platform - unauthorized',
            {}, ['@create'], 'admin@platform',
            [protect('@create', 'admin@platform')],
            [
                matchingRule('@', 'prepare', 'define role `admin@platform` as technical account of the platform'),
            ],
            new UnsatisfiedRoleError('admin@platform'),
        ],
        ['user',
            {caller: {authenticated: true}}, ['@create'], 'user',
            [protect('@create', 'user')],
            [
                matchingRule('@', 'prepare', 'define role `user` as authenticated'),
            ],
            undefined,
        ],
        ['user - unauthorized',
            {}, ['@create'], 'user',
            [protect('@create', 'user')],
            [
                matchingRule('@', 'prepare', 'define role `user` as authenticated'),
            ],
            new UnsatisfiedRoleError('user'),
        ],
        ['anonymous',
            {caller: {authenticated: false}}, ['@create'], 'anonymous',
            [protect('@create', 'anonymous')],
            [
                matchingRule('@', 'prepare', 'define role `anonymous` as not authenticated'),
            ],
            undefined,
        ],
        ['anonymous (no caller info)',
            {}, ['@create'], 'anonymous',
            [protect('@create', 'anonymous')],
            [
                matchingRule('@', 'prepare', 'define role `anonymous` as not authenticated'),
            ],
            undefined,
        ],
        ['anonymous - when is authenticated (unauthorized)',
            {caller: {authenticated: true}}, ['@create'], 'anonymous',
            [protect('@create', 'anonymous')],
            [
                matchingRule('@', 'prepare', 'define role `anonymous` as not authenticated'),
            ],
            new UnsatisfiedRoleError('anonymous'),
        ],
        ['owner',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'owner'}}}}, ['@create'], 'owner',
            [protect('@create', 'owner')],
            [
                matchingRule('@', 'prepare', 'define role `owner` as member who have exactly owner role'),
            ],
            undefined,
        ],
        ['owner - unauthorized',
            {}, ['@create'], 'owner',
            [protect('@create', 'owner')],
            [
                matchingRule('@', 'prepare', 'define role `owner` as member who have exactly owner role'),
            ],
            new UnsatisfiedRoleError('owner'),
        ],
        ['admin - when is admin (allowed)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'admin'}}}}, ['@create'], 'admin',
            [protect('@create', 'admin')],
            [
                matchingRule('@', 'prepare', 'define role `admin` as member who have admin or owner role'),
            ],
            undefined,
        ],
        ['admin - when is owner (allowed)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'owner'}}}}, ['@create'], 'admin',
            [protect('@create', 'admin')],
            [
                matchingRule('@', 'prepare', 'define role `admin` as member who have admin or owner role'),
            ],
            undefined,
        ],
        ['admin - unauthorized',
            {}, ['@create'], 'admin',
            [protect('@create', 'admin')],
            [
                matchingRule('@', 'prepare', 'define role `admin` as member who have admin or owner role'),
            ],
            new UnsatisfiedRoleError('admin'),
        ],
        ['admin - when is member (unauthorized)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'member'}}}}, ['@create'], 'admin',
            [protect('@create', 'admin')],
            [
                matchingRule('@', 'prepare', 'define role `admin` as member who have admin or owner role'),
            ],
            new UnsatisfiedRoleError('admin'),
        ],
        ['member - when is member (allowed)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'member'}}}}, ['@create'], 'member',
            [protect('@create', 'member')],
            [
                matchingRule('@', 'prepare', 'define role `member` as member who have member, admin or owner role'),
            ],
            undefined,
        ],
        ['member - when is owner (allowed)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'owner'}}}}, ['@create'], 'member',
            [protect('@create', 'member')],
            [
                matchingRule('@', 'prepare', 'define role `member` as member who have member, admin or owner role'),
            ],
            undefined,
        ],
        ['member - when is admin (allowed)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'admin'}}}}, ['@create'], 'member',
            [protect('@create', 'member')],
            [
                matchingRule('@', 'prepare', 'define role `member` as member who have member, admin or owner role'),
            ],
            undefined,
        ],
        ['member - unauthorized',
            {}, ['@create'], 'member',
            [protect('@create', 'member')],
            [
                matchingRule('@', 'prepare', 'define role `member` as member who have member, admin or owner role'),
            ],
            new UnsatisfiedRoleError('member'),
        ],
        ['admin! - when is admin (allowed)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'admin'}}}}, ['@create'], 'admin!',
            [protect('@create', 'admin!')],
            [
                matchingRule('@', 'prepare', 'define role `admin!` as member who have exactly admin role'),
            ],
            undefined,
        ],
        ['admin! - unauthorized',
            {}, ['@create'], 'admin!',
            [protect('@create', 'admin!')],
            [
                matchingRule('@', 'prepare', 'define role `admin!` as member who have exactly admin role'),
            ],
            new UnsatisfiedRoleError('admin!'),
        ],
        ['admin! - when is member (unauthorized)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'member'}}}}, ['@create'], 'admin!',
            [protect('@create', 'admin!')],
            [
                matchingRule('@', 'prepare', 'define role `admin!` as member who have exactly admin role'),
            ],
            new UnsatisfiedRoleError('admin!'),
        ],
        ['admin! - when is owner (unauthorized)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'owner'}}}}, ['@create'], 'admin!',
            [protect('@create', 'admin!')],
            [
                matchingRule('@', 'prepare', 'define role `admin!` as member who have exactly admin role'),
            ],
            new UnsatisfiedRoleError('admin!'),
        ],
        ['member! - when is member (allowed)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'member'}}}}, ['@create'], 'member!',
            [protect('@create', 'member!')],
            [
                matchingRule('@', 'prepare', 'define role `member!` as member who have exactly member role'),
            ],
            undefined,
        ],
        ['member! - unauthorized',
            {}, ['@create'], 'member!',
            [protect('@create', 'member!')],
            [
                matchingRule('@', 'prepare', 'define role `member!` as member who have exactly member role'),
            ],
            new UnsatisfiedRoleError('member!'),
        ],
        ['member! - when is admin (unauthorized)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'admin'}}}}, ['@create'], 'member!',
            [protect('@create', 'member!')],
            [
                matchingRule('@', 'prepare', 'define role `member!` as member who have exactly member role'),
            ],
            new UnsatisfiedRoleError('member!'),
        ],
        ['member! - when is owner (unauthorized)',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'owner'}}}}, ['@create'], 'member!',
            [protect('@create', 'member!')],
            [
                matchingRule('@', 'prepare', 'define role `member!` as member who have exactly member role'),
            ],
            new UnsatisfiedRoleError('member!'),
        ],
        ['member! - when is owner BUT noPreAuthorize enabled is allowed',
            {caller: {id: 'xxx'}, old: {members: {xxx: {role: 'owner'}}}}, ['@create'], 'member!',
            [protect('@create', 'member!')],
            [
                matchingRule('@', 'prepare', 'define role `member!` as member who have exactly member role'),
            ],
            undefined,
            {noPreAuthorize: true},
        ],
    ].
        forEach(([title, data, operations, name, extraRules, expectedRules, expectedResult, ctxData = {}]) => it(<string>title, async () => {
            await expectRule(
                predefined_role(<string|string[]>name),
                <object>data, <string[]>operations, expectedRules, expectedResult, ctxData, extraRules
            );
        }));
    it('throw an error if unknown predefined role', async () => {
        try {
            predefined_role('unknown');
            expect(false).toBeFalsy();
        } catch (e) {
            expect(e).toEqual(new UnknownPredefinedRoleError('unknown'));
        }
    })
});
