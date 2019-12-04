import migrate, {applyMigration, MigrateError, plan} from '../src';

describe('plan up', () => {
    [
        ['repo not existing', `${__dirname}/../__fixtures__/unknown`, [], []],
        ['no previous deployed', `${__dirname}/../__fixtures__/test1`, [], ['01.js', '02.js', '10.js']],
        ['one existing deployed to ignore', `${__dirname}/../__fixtures__/test1`, ['01.js'], ['02.js', '10.js']],
        ['multiple existing deployed to ignore', `${__dirname}/../__fixtures__/test1`, ['01.js', '10.js'], ['02.js']],
        ['multiple existing deployed but no more existing', `${__dirname}/../__fixtures__/test1`, ['03.js', '11.js'], ['01.js', '02.js', '10.js']],
        ['multiple existing deployed no more existing plus existing that lead to all ignored', `${__dirname}/../__fixtures__/test1`, ['10.js', '02.js', '05.js', '12.js', '01.js'], []],
    ]
        .forEach(
            ([testCase, repo, deployed, expected]) => it(<string>testCase, async () => {
                expect(await plan(<string>repo, <string[]>deployed, 'up')).toEqual(<string[]>expected);
            })
        )
    ;
});
describe('plan down', () => {
    [
        ['no previous deployed', `${__dirname}/../__fixtures__/test1`, [], []],
        ['one existing deployed to revert', `${__dirname}/../__fixtures__/test1`, ['01.js'], ['01.js']],
        ['multiple existing deployed to revert', `${__dirname}/../__fixtures__/test1`, ['01.js', '10.js'], ['10.js', '01.js']],
        ['multiple existing deployed but no more existing', `${__dirname}/../__fixtures__/test1`, ['03.js', '11.js'], []],
        ['multiple existing deployed no more existing plus existing that lead to some to revert', `${__dirname}/../__fixtures__/test1`, ['10.js', '02.js', '05.js', '12.js', '01.js'], ['10.js', '02.js', '01.js']],
    ]
        .forEach(
            ([testCase, repo, deployed, expected]) => it(<string>testCase, async () => {
                expect(await plan(<string>repo, <string[]>deployed, 'down')).toEqual(<string[]>expected);
            })
        )
    ;
});
describe('plan bad action', () => {
    it('throw an error if a bad action is provided', async () => {
        await expect(plan(`${__dirname}/../__fixtures__/test1`,  [],  'unknown')).rejects.toThrow(new Error("Unsupported plan action 'unknown' (allowed: up, down)"));
    })
});

describe('migrate up', () => {
    [
        ['no previous deployed', `${__dirname}/../__fixtures__/test2`,
            [], {planned: ['03.js', '07.js', '11.js', '12.js'], failed: [], failures: {}, deployed: ['03.js', '07.js', '11.js', '12.js']}, {value: 33},
            [
                ['migrateStarting', {planned: ['03.js', '07.js', '11.js', '12.js'], failed: [], failures: {}, deployed: []}],
                ['migrationSucceed', {action: 'up', name: '03.js'}],
                ['migrationSucceed', {action: 'up', name: '07.js'}],
                ['migrationSucceed', {action: 'up', name: '11.js'}],
                ['migrationSucceed', {action: 'up', name: '12.js'}],
                ['migrateCompleted', {planned: ['03.js', '07.js', '11.js', '12.js'], failed: [], failures: {}, deployed: ['03.js', '07.js', '11.js', '12.js']}],
            ],
        ],
        ['one existing deployed to ignore',
            `${__dirname}/../__fixtures__/test2`, ['07.js'], {planned: ['03.js', '11.js', '12.js'], failed: [], failures: {}, deployed: ['03.js', '11.js', '12.js']}, {value: 26},
            [
                ['migrateStarting', {planned: ['03.js', '11.js', '12.js'], failed: [], failures: {}, deployed: []}],
                ['migrationSucceed', {action: 'up', name: '03.js'}],
                ['migrationSucceed', {action: 'up', name: '11.js'}],
                ['migrationSucceed', {action: 'up', name: '12.js'}],
                ['migrateCompleted', {planned: ['03.js', '11.js', '12.js'], failed: [], failures: {}, deployed: ['03.js', '11.js', '12.js']}],
            ],
        ],
    ]
        .forEach(
            ([testCase, repo, deployed, expected, expectedCtx, expectedLogs]) => it(<string>testCase, async () => {
                const ctx = {value: 0};
                const logBuffer = <any[]>[];
                const fakeLogger = (...args) => logBuffer.push(args);
                expect(await migrate(<string>repo, <string[]>deployed, ctx, 'up', fakeLogger)).toEqual(<string[]>expected);
                expect(ctx).toEqual(expectedCtx);
                expect(logBuffer).toEqual(expectedLogs);
            })
        )
    ;
});

describe('migrate up with failures', () => {
    [
        ['first failed', `${__dirname}/../__fixtures__/test3`, [], {planned: ['01.js', '02.js', '03.js'], failed: ['01.js'], failures: {['01.js']: 'there was some error'}, deployed: []}, {value: 0}],
        ['second failed', `${__dirname}/../__fixtures__/test3`, ['01.js'], {planned: ['02.js', '03.js'], failed: ['03.js'], failures: {['03.js']: 'there was some other error'}, deployed: ['02.js']}, {value: 2}],
    ]
        .forEach(
            ([testCase, repo, deployed, expected, expectedCtx]) => it(<string>testCase, async () => {
                const ctx = {value: 0};
                try {
                    await migrate(<string>repo, <string[]>deployed, ctx, 'up', () => {});
                    expect('failed').toEqual('not-failed');
                } catch (e) {
                    expect(e).toBeInstanceOf(MigrateError);
                    expect(<MigrateError>e.getResult()).toEqual(expected);
                }
                expect(ctx).toEqual(expectedCtx);
            })
        )
    ;
});

describe('migrate down', () => {
    [
        ['no previous deployed', `${__dirname}/../__fixtures__/test2`, [], {planned: [], failed: [], failures: {}, deployed: []}, {value: 0}],
        ['one existing deployed to revert', `${__dirname}/../__fixtures__/test2`, ['07.js'], {planned: ['07.js'], failed: [], failures: {}, deployed: ['07.js']}, {value: -7}],
        ['multiple existing deployed to revert', `${__dirname}/../__fixtures__/test2`, ['03.js', '07.js'], {planned: ['07.js', '03.js'], failed: [], failures: {}, deployed: ['07.js', '03.js']}, {value: -10}],
        ['multiple existing deployed but no more existing', `${__dirname}/../__fixtures__/test2`, ['02.js', '13.js'], {planned: [], failed: [], failures: {}, deployed: []}, {value: 0}],
        ['multiple existing deployed no more existing plus existing that lead to some to revert', `${__dirname}/../__fixtures__/test2`, ['02.js', '03.js', '13.js', '11.js', '12.js'], {planned: ['12.js', '11.js', '03.js'], failed: [], failures: {}, deployed: ['12.js', '11.js', '03.js']}, {value: -26}],
    ]
        .forEach(
            ([testCase, repo, deployed, expected, expectedCtx]) => it(<string>testCase, async () => {
                const ctx = {value: 0};
                expect(await migrate(<string>repo, <string[]>deployed, ctx, 'down', () => {})).toEqual(<string[]>expected);
                expect(ctx).toEqual(expectedCtx);
            })
        )
    ;
});

describe('applyMigration bad action', () => {
    it('throw an error if a bad action is provided', async () => {
        await expect(applyMigration(`${__dirname}/../__fixtures__/test2`,  '03.js',  {value: 0}, 'unknown', () => {})).rejects.toThrow(new Error(`Unknown action 'unknown' for migration '03.js' (repo: ${__dirname}/../__fixtures__/test2)`));
    })
});
