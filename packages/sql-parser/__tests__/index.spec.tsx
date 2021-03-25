import {split, convert} from '../src';
import fs from 'fs';

function sqlFile(group: string, path: string): string {
    return fs.readFileSync(`${__dirname}/../__fixtures__/${group}/${path}/input.sql`, 'utf8');
}
function statementsFile(group: string, path: string): string {
    return require(`${__dirname}/../__fixtures__/${group}/${path}/statements.json`);
}
function modelFile(group: string, path: string): string {
    return require(`${__dirname}/../__fixtures__/${group}/${path}/model.json`);
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
            sqlFile('splits', 'test-1'),
            statementsFile('splits', 'test-1'),
        ],
        ['multiple statements',
            sqlFile('splits', 'test-2'),
            statementsFile('splits', 'test-2'),
        ],
    ]
        .forEach(
            ([name, input, expected]) => it(name as string, () => {
                expect(split(input as string)).toStrictEqual(expected);
            })
        )
    ;
})

describe('convert', () => {
    [
        ['DROP TABLE IF EXISTS',
            sqlFile('converts', 'drop-table-silent'),
            modelFile('converts', 'drop-table-silent')
        ],
        ['DROP TABLE',
            sqlFile('converts', 'drop-table'),
            modelFile('converts', 'drop-table')
        ],
        ['INSERT INTO',
            sqlFile('converts', 'insert'),
            modelFile('converts', 'insert')
        ],
        ['INSERT INTO - MULTIPLE',
            sqlFile('converts', 'insert-multiple'),
            modelFile('converts', 'insert-multiple')
        ],
        ['INSERT INTO - MULTIPLE - 2',
            sqlFile('converts', 'insert-multiple-2'),
            modelFile('converts', 'insert-multiple-2')
        ],
        ['CREATE TABLE',
            sqlFile('converts', 'create-table'),
            modelFile('converts', 'create-table')
        ],
        ['CREATE TABLE - 2',
            sqlFile('converts', 'create-table-2'),
            modelFile('converts', 'create-table-2')
        ],
    ]
        .forEach(
            ([name, input, expected]) => it(name as string, () => {
                expect(convert(input as string)).toStrictEqual(expected);
            })
        )
    ;
})