import isHeaderAllowed, {
    MODE_EDGE_ORIGIN_REQUEST,
    MODE_EDGE_ORIGIN_RESPONSE,
    MODE_EDGE_VIEWER_REQUEST,
    MODE_EDGE_VIEWER_RESPONSE
} from '../src';

describe('isHeaderAllowed', () => {
    [
        ['Content-Length', MODE_EDGE_ORIGIN_REQUEST, false],
        ['Content-Disposition', MODE_EDGE_ORIGIN_REQUEST, true],
        ['Via', MODE_EDGE_ORIGIN_RESPONSE, false],
        ['Via', MODE_EDGE_VIEWER_REQUEST, false],
        ['Via', MODE_EDGE_VIEWER_RESPONSE, false],
        ['x-amzn-test', MODE_EDGE_VIEWER_RESPONSE, false],
        ['my-header', MODE_EDGE_VIEWER_RESPONSE, true],
        ['my-header', MODE_EDGE_VIEWER_REQUEST, true],
        ['my-header', MODE_EDGE_ORIGIN_RESPONSE, true],
        ['my-header', MODE_EDGE_ORIGIN_REQUEST, true],
    ]
        .forEach(
            ([key, mode, expected]) => it(`${mode}(${key}) => ${expected ? 'true' : 'false'}`, () => {
                expect(isHeaderAllowed(key as string, mode as string)).toEqual(expected);
            })
        )
    ;
})