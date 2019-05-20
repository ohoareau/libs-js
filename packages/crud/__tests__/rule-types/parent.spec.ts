import { parent } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

describe('parent', () => {
    [
        ['default',
            {data: {container: 123}}, ['@create'], 'container', {get: (id) => ({id, a: 1, b: 'hello', x: 12})}, ['id', 'a', 'b'], ['x'], [],
            [
                matchingRule('@create|@update', 'fetch', 'retrieve container id,a,b,x and cache'),
                matchingRule('@create|@update', 'before', 'map reference from `container` id to `id`, `a`, `b` of container'),
                matchingRule('@create', 'before', 'set x from container (reference)'),
                matchingRule('@create', 'validate', 'check mandatory field `container` is present'),
            ], {
                container: {id: 123, a: 1, b: 'hello'},
                x: 12,
            },
        ],
    ].
        forEach(([title, data, operations, field, service, fields, defaultsFromFields, extraFetchedFields, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                parent(<string>field, <any>service, <string[]>fields, <string[]>defaultsFromFields, <string[]>extraFetchedFields),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});