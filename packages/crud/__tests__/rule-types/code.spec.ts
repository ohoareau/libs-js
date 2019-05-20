import { code } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

describe('code', () => {
    [
        ['default code',
            {}, ['@create'], undefined, undefined, undefined, undefined,
            [matchingRule('@create', 'before', 'set code="@code//3C3D/"')],
            {code: expect.stringMatching(/^[A-Z]{3}[0-9]{3}$/)},
        ],
        ['default code with field',
            {}, ['@create'], undefined, undefined, undefined, 'aaa',
            [matchingRule('@create', 'before', 'set aaa="@code//3C3D/"')],
            {aaa: expect.stringMatching(/^[A-Z]{3}[0-9]{3}$/)},
        ],
        ['default code with prefix',
            {}, ['@create'], 'xxx', undefined, undefined, 'zzz',
            [matchingRule('@create', 'before', 'set zzz="@code/xxx/3C3D/"')],
            {zzz: expect.stringMatching(/^xxx[A-Z]{3}[0-9]{3}$/)},
        ],
        ['default code with suffix',
            {}, ['@create'], undefined, undefined, 'yyy', 'zzz',
            [matchingRule('@create', 'before', 'set zzz="@code//3C3D/yyy"')],
            {zzz: expect.stringMatching(/^[A-Z]{3}[0-9]{3}yyy$/)},
        ],
        ['default code with prefix and suffix',
            {}, ['@create'], 'xxx', undefined, 'yyy', 'zzz',
            [matchingRule('@create', 'before', 'set zzz="@code/xxx/3C3D/yyy"')],
            {zzz: expect.stringMatching(/^xxx[A-Z]{3}[0-9]{3}yyy$/)},
        ],
        ['3C3D code',
            {}, ['@create'], undefined, '3C3D', undefined, 'ttt',
            [matchingRule('@create', 'before', 'set ttt="@code//3C3D/"')],
            {ttt: expect.stringMatching(/^[A-Z]{3}[0-9]{3}$/)},
        ],
        ['2C2D code',
            {}, ['@create'], undefined, '2C2D', undefined, 'ttt',
            [matchingRule('@create', 'before', 'set ttt="@code//2C2D/"')],
            {ttt: expect.stringMatching(/^[A-Z]{2}[0-9]{2}$/)},
        ],
    ].
        forEach(([title, data, operations, prefix, format, suffix, field, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                code(<string>prefix, <string>format, <string>suffix, <string>field),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});