import {split} from '../src';

describe('split', () => {
    [
        ['undefined return empty array',
            undefined,
            []
        ],
        ['empty string return empty array',
            '',
            []
        ],
        ['one line as comment return empty array',
            '# some comment',
            []
        ],
    ]
        .forEach(
            ([name, input, expected]) => it(name as string, () => {
                expect(split(input as string)).toEqual(expected);
            })
        )
    ;
})