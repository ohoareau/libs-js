import {peopleSorter, labelSorter} from '..';

describe('peopleSorter', () => {
    [
        [{name: 'a'}, {name: 'b'}, -1],
        [{name: 'b'}, {name: 'a'}, 1],
        [{name: 'a'}, {name: 'a'}, -1],
        [{name: 'a', lastName: 'a', firstName: 'b'}, {name: 'a', lastName: 'b', firstName: 'b'}, -1],
        [{name: 'a', lastName: 'b', firstName: 'b'}, {name: 'a', lastName: 'a', firstName: 'b'}, 1],
        [{name: 'a', lastName: 'b', firstName: 'b'}, {name: 'a', lastName: 'b', firstName: 'a'}, 1],
    ]
        .forEach(
            ([a, b, c]) => it(`${JSON.stringify(a)} <> ${JSON.stringify(b)} => ${c}`, () => {
                expect(peopleSorter(a, b)).toEqual(c);
            })
        )
    ;
});

describe('labelSorter', () => {
    [
        [{label: 'a'}, {label: 'b'}, -1],
        [{label: 'b'}, {label: 'a'}, 1],
        [{label: 'a'}, {label: 'a'}, 0],
    ]
        .forEach(
            ([a, b, c]) => it(`${JSON.stringify(a)} <> ${JSON.stringify(b)} => ${c}`, () => {
                expect(labelSorter(a, b)).toEqual(c);
            })
        )
    ;
});