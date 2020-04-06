import {camelcase, underscorecase, digitize, datetimify} from '..';

describe('camelcase', () => {
    [
        ['', ''],
        ['abcd', 'Abcd'],
        ['abCd', 'AbCd'],
        ['ab cd', 'Ab cd'],
        ['ab Cd', 'Ab Cd'],
        ['aB cD e', 'AB cD e'],
        [['ab', 'cd', 'efg'], 'AbCdEfg'],
        [['A', 'bcd', 'eD'], 'ABcdED'],
    ]
        .forEach(
            ([a, b]) => it(`${JSON.stringify(a)} => ${JSON.stringify(b)}`, () => {
                expect(camelcase(a)).toEqual(b);
            })
        )
    ;
});
describe('underscorecase', () => {
    [
        ['', ''],
        ['abcd', 'abcd'],
        ['abCd', 'abCd'],
        ['ab cd', 'ab_cd'],
        ['ab Cd', 'ab_Cd'],
        ['aB cD.e', 'aB_cD_e'],
        [['ab', 'cd', 'efg'], 'ab_cd_efg'],
        [['A', 'bcd', 'eD'], 'A_bcd_eD'],
    ]
        .forEach(
            ([a, b]) => it(`${JSON.stringify(a)} => ${JSON.stringify(b)}`, () => {
                expect(underscorecase(a)).toEqual(b);
            })
        )
    ;
});
describe('digitize', () => {
    [
        [0, '00'],
        [1, '01'],
        [2, '02'],
        [3, '03'],
        [4, '04'],
        [5, '05'],
        [6, '06'],
        [7, '07'],
        [8, '08'],
        [9, '09'],
        [10, '10'],
        [11, '11'],
        [12, '12'],
        [20, '20'],
        [21, '21'],
        [30, '30'],
        [50, '50'],
    ]
        .forEach(
            ([a, b]) => it(`${JSON.stringify(a)} => ${JSON.stringify(b)}`, () => {
                expect(digitize(a)).toEqual(b);
            })
        )
    ;
});
describe('datetimify', () => {
    [
        [new Date('1970-01-01T00:00:00Z').valueOf(), expect.any(String)],
        [new Date('1970-01-01T00:00:01Z').valueOf(), expect.any(String)],
        [new Date('2020-04-07T10:56:00Z').valueOf(), expect.any(String)],
    ]
        .forEach(
            ([a, b]) => it(`${JSON.stringify(a)} => ${JSON.stringify(b)}`, () => {
                expect(datetimify(a)).toEqual(b);
            })
        )
    ;
});