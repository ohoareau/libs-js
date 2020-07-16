import {parseEcr} from '..';

describe('parseEcr', () => {
    [
        [false, {account: '', domain: '', registry: '', region: '', name: '', tag: ''}],
        [undefined, {account: '', domain: '', registry: '', region: '', name: '', tag: ''}],
        ['', {account: '', domain: '', registry: '', region: '', name: '', tag: ''}],
        ['012345678901', {account: '', domain: '', registry: '', region: '', name: '', tag: ''}],
        ['012345678901.dkr', {account: '', domain: '', registry: '', region: '', name: '', tag: ''}],
        ['012345678901.dkr.ecr', {account: '', domain: '', registry: '', region: '', name: '', tag: ''}],
        ['012345678901.dkr.ecr.eu-west-3', {account: '', domain: '', registry: '', region: '', name: '', tag: ''}],
        ['012345678901.dkr.ecr.eu-west-3.amazonaws', {account: '', domain: '', registry: '', region: '', name: '', tag: ''}],
        ['012345678901.dkr.ecr.eu-west-3.amazonaws.com', {account: '012345678901', domain: '012345678901.dkr.ecr.eu-west-3.amazonaws.com', registry: '', region: 'eu-west-3', name: '', tag: ''}],
        ['012345678901.dkr.ecr.eu-west-3.amazonaws.com/abcd', {account: '012345678901', domain: '012345678901.dkr.ecr.eu-west-3.amazonaws.com', registry: '012345678901.dkr.ecr.eu-west-3.amazonaws.com/abcd', region: 'eu-west-3', name: 'abcd', tag: ''}],
        ['012345678901.dkr.ecr.eu-west-3.amazonaws.com/abcd:latest', {account: '012345678901', domain: '012345678901.dkr.ecr.eu-west-3.amazonaws.com', registry: '012345678901.dkr.ecr.eu-west-3.amazonaws.com/abcd', region: 'eu-west-3', name: 'abcd', tag: 'latest'}],
    ]
        .forEach(
            ([a, b]) => it(`${JSON.stringify(a)} => ${JSON.stringify(b)}`, () => {
                expect(parseEcr(a)).toEqual(b);
            })
        )
    ;
});
