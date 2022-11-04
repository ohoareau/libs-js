import select from '../src';

describe('', () => {
    [
        ['case-1'],
        ['case-2'],
        ['case-3'],
        ['case-4'],
    ]
        .forEach(
            ([name]) => it(name, () => {
                const dir = `${__dirname}/../__fixtures__/${name}`;
                expect(select(require(`${dir}/info.json`))).toEqual(require(`${dir}/expected.json`));
            })
        )
    ;
});