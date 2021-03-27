import {split, clean, convert} from '../src';
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

describe('clean and convert', () => {
    [
        ['DROP TABLE',
            sqlFile('converts', 'drop-table'),
            modelFile('converts', 'drop-table')
        ],
        ['DROP TABLE - CLEAN - IF EXISTS',
            sqlFile('converts', 'drop-table-clean-if-exists'),
            modelFile('converts', 'drop-table-clean-if-exists')
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
        ['CREATE TABLE - CLEAN - COLLATE',
            sqlFile('converts', 'create-table-clean-collate'),
            modelFile('converts', 'create-table-clean-collate')
        ],
        ['CREATE TABLE - CLEAN - KEY LENGTH',
            sqlFile('converts', 'create-table-clean-key-length'),
            modelFile('converts', 'create-table-clean-key-length')
        ],
        ['CREATE TABLE - CLEAN - KEY LENGTH DOUBLE',
            sqlFile('converts', 'create-table-clean-key-length-double'),
            modelFile('converts', 'create-table-clean-key-length-double')
        ],
        ['CREATE TABLE - CLEAN - KEY LENGTH DOUBLE BOTH',
            sqlFile('converts', 'create-table-clean-key-length-double-both'),
            modelFile('converts', 'create-table-clean-key-length-double-both')
        ],
        ['CREATE TABLE - CLEAN - KEY LENGTH N',
            sqlFile('converts', 'create-table-clean-key-length-n'),
            modelFile('converts', 'create-table-clean-key-length-n')
        ],
        ['CREATE TABLE - CLEAN - ON UPDATE',
            sqlFile('converts', 'create-table-clean-on-update'),
            modelFile('converts', 'create-table-clean-on-update')
        ],
    ]
        .forEach(
            ([name, input, expected]) => it(name as string, async () => {
                expect(await convert(...((await clean(input)) as [string, any]))).toStrictEqual(expected);
            })
        )
    ;
})