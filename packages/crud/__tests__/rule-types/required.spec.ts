import { required } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";
import FieldCollectionError from "../../src/errors/FieldCollectionError";
import RequiredFieldError from "../../src/errors/RequiredFieldError";

describe('required', () => {
    [
        ['when single required field is present - do not throw error',
            {data: {a: 1, b: 'hello', x: 12}}, ['@create'], 'x',
            [matchingRule('@create', 'validate', 'check mandatory field `x` is present')],
            {a: 1, b: 'hello', x: 12},
        ],
        ['when empty list of required field - return empty rule (undefined)',
            {data: {a: 1, b: 'hello', x: 12}}, ['@create'], undefined,
            [],
            {a: 1, b: 'hello', x: 12},
        ],
        ['when multiple required fields are present - do not throw error',
            {data: {a: 1, b: 'hello'}}, ['@create'], ['a', 'b'],
            [matchingRule('@create', 'validate', 'check mandatory fields `a`, `b` are present')],
            {a: 1, b: 'hello'},
        ],
        ['when single required field is not present - throw error',
            {data: {a: 1, b: 'hello', x: 12}}, ['@create'], 'z',
            [matchingRule('@create', 'validate', 'check mandatory field `z` is present')],
            new FieldCollectionError({z: [new RequiredFieldError('z')]}),
        ],
        ['when multiple required fields are all not present - throw error',
            {data: {a: 1, b: 'hello', x: 12}}, ['@create'], ['z', 't'],
            [matchingRule('@create', 'validate', 'check mandatory fields `z`, `t` are present')],
            new FieldCollectionError({
                z: [new RequiredFieldError('z')],
                t: [new RequiredFieldError('t')],
            }),
        ],
        ['when multiple required fields are all not present and duplicated required field in list - throw error (not duplicated)',
            {data: {a: 1, b: 'hello', x: 12}}, ['@create'], ['z', 't', 'z'],
            [matchingRule('@create', 'validate', 'check mandatory fields `z`, `t` are present')],
            new FieldCollectionError({
                z: [new RequiredFieldError('z')],
                t: [new RequiredFieldError('t')],
            }),
        ],
        ['when multiple required fields and not all are present - throw error',
            {data: {a: 1, b: 'hello', x: 12, z: true}}, ['@create'], ['z', 't'],
            [matchingRule('@create', 'validate', 'check mandatory fields `z`, `t` are present')],
            new FieldCollectionError({
                t: [new RequiredFieldError('t')],
            }),
        ],
    ].
        forEach(([title, data, operations, fields, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                required(<string|string[]>fields),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});
