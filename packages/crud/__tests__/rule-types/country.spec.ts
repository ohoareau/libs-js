import { country } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

describe('country', () => {
    [
        ['provided data is valid',
            {data: {country: 'FR'}}, ['@create'], undefined, 'france',
            [
                matchingRule('@create|@update', 'validate', 'field `country` must match enum values ["FR"]'),
            ],
            {country: 'FR'}
        ],
    ].
        forEach(([title, data, operations, field, zone, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                country(<string>field, <string>zone),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});
