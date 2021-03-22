import {split} from '../src';
import fs from 'fs';

function sqlFile(path: string): string {
    return fs.readFileSync(`${__dirname}/../__fixtures__/${path}/input.sql`, 'utf8');
}

function statementsFile(path: string): string {
    return require(`${__dirname}/../__fixtures__/${path}/statements.json`);
}

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
        ['lots of comment but 1 statement',
            sqlFile('test-1'),
            statementsFile('test-1'),
        ],
        ['multiple statements',
            sqlFile('test-2'),
            statementsFile('test-2'),
        ],
    ]
        .forEach(
            ([name, input, expected]) => it(name as string, () => {
                expect(split(input as string)).toStrictEqual(expected);
            })
        )
    ;
})