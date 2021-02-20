import {parseInfo} from "../../src";

describe('parseInfo', () => {
    it('for empty info return empty object', () => {
        expect(parseInfo({})).toStrictEqual({});
    });
});