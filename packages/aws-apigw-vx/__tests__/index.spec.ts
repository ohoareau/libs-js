import vx, {detectVersion, convertPayload} from '..';

describe('detectVersion', () => {
    [
        ['empty payload return default version', {}, '1.0'],
        ['official v1 sample from AWS', require('../__fixtures__/v1/sample1.json'), '1.0'],
        ['official v2 sample from AWS', require('../__fixtures__/v2/sample1.json'), '2.0'],
        ['other v2 sample', require('../__fixtures__/v2/sample2.json'), '2.0'],
    ]
        .forEach(
            ([n, a, b]) => it(<string>n, () => {
                expect(detectVersion(a)).toEqual(b);
            })
        )
    ;
});

describe('convertPayload', () => {
    [
        ['official v2 to v1', '2.0', '1.0', require('../__fixtures__/v2/sample1.json'), require('../__fixtures__/v2/sample1-v1.json')],
        ['official v1 to v1 (no changes)', '1.0', '1.0', require('../__fixtures__/v1/sample1.json'), require('../__fixtures__/v1/sample1.json')],
        ['official v2 to v2 (no changes)', '2.0', '2.0', require('../__fixtures__/v2/sample1.json'), require('../__fixtures__/v2/sample1.json')],
        ['official v2 to unknown', '2.0', '0.0', require('../__fixtures__/v2/sample1.json'), require('../__fixtures__/v2/sample1.json')],
        ['other v2 to v1', '2.0', '1.0', require('../__fixtures__/v2/sample2.json'), require('../__fixtures__/v2/sample2-v1.json')],
    ]
        .forEach(
            ([n, a, b, c, d]) => it(<string>n, () => {
                expect(convertPayload(a, b, c)).toEqual(d);
            })
        )
    ;
});

describe('vx', () => {
    it('old fashioned handler (with callback) hitting error', async () => {
        const handler = (event, context, callback) => {
            callback(new Error('Something went wrong'));
        }
        await expect(vx(handler, '1.0')({}, {})).rejects.toThrow('Something went wrong');
    });
    it('old fashioned handler (with callback) returning value', async () => {
        const handler = (event, context, callback) => {
            callback(null, {a: 12, b: {c: 'd'}});
        }
        await expect(vx(handler, '1.0')({}, {})).resolves.toEqual({a: 12, b: {c: 'd'}});
    })
    it('new fashioned handler (async) throwing error', async () => {
        const handler = async () => {
            throw new Error('Something went wrong #2');
        }
        await expect(vx(handler, '1.0')({}, {})).rejects.toThrow('Something went wrong #2');
    });
    it('new fashioned handler (async) returning value', async () => {
        const handler = async () => {
            return {a: 13, b: {c: 'd', e: true}};
        }
        await expect(vx(handler, '1.0')({}, {})).resolves.toEqual({a: 13, b: {c: 'd', e: true}});
    })
    it('new fashioned handler (async) returning value (no target version specified, using default)', async () => {
        const handler = async () => {
            return {a: 14, b: {c: 'd', e: true}};
        }
        await expect(vx(handler)({}, {})).resolves.toEqual({a: 14, b: {c: 'd', e: true}});
    })
    it('headers structure transformed from v2 to v1', async () => {
        const handler = async ({headers, multiValueHeaders}) => {
            return {headers, multiValueHeaders};
        }
        await expect(vx(handler)({
            version: '2.0',
            requestContext: {http: {}},
            headers: {h1: 'a,b', h2: 'c', h3: 'd,e,f'},
        }, {})).resolves.toEqual({
            headers: {
                h1: 'a,b',
                h2: 'c',
                h3: 'd,e,f',
            },
            multiValueHeaders: {
                h1: ['a', 'b'],
                h3: ['d', 'e', 'f'],
            },
        });
    })
})