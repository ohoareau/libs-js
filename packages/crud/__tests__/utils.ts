import {RuleService, DefaultExecutor, Context, Rule} from "..";

export const expectRule = async (rule: any, data: object, operations: string[], expectedRules: any, expectedResult: any, ctxData: any = {}, extraRules: any = undefined): Promise<void> => {
    return expectRules({xxx: rule}, data, operations, expectedRules, expectedResult, ctxData, extraRules);
};

export const expectRules = async (rules: any, data: object, operations: string[], expectedRules: any, expectedResult: any, ctxData: any = {}, extraRules: any = undefined): Promise<void> => {
    rules = RuleService.map(rules);
    extraRules = extraRules ? RuleService.map(extraRules) : [];
    const executor = new DefaultExecutor();
    expect(rules).toEqual(expectedRules);
    const action = jest.fn();
    const ctx = new Context(ctxData);
    let error = undefined;
    try {
        await executor.execute((<Rule[]>[]).concat(<Rule[]>rules, <Rule[]>extraRules), data, operations, action, undefined, ctx);
    } catch (e) {
        error = e;
    }
    if (expectedResult instanceof Error) {
        expect(error).toEqual(expectedResult);
    } else {
        if (error) {
            throw error;
        }
        expect(ctx.get('data')).toEqual(<object>expectedResult);
    }
};

export const matchingRule = (operations: string[]|string, types: string[]|string, title: string): Rule => {
    return new Rule(
        expect.stringContaining('xxx'),
        title,
        Array.isArray(operations) ? operations : operations.split(/\|/),
        Array.isArray(types) ? types : types.split(/\|/),
        expect.any(Function),
        undefined,
    );
};