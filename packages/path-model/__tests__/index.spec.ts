import {get} from '..';

describe('get', () => {
    [
        ['get existing list return list content', {t1s: [{id: '321', a: 12}, {id: '123', a: 13}]}, ['t1'], {}, [{id: '321', a: 12}, {id: '123', a: 13}]],
        ['get non-existing list return empty list', {t1s: [{id: '321', a: 12}, {id: '123', a: 13}]}, ['t2'], {}, []],
    ]
        .forEach(
            ([name, model, path, context, expected]) => it(<string>name, () => {
                expect(get({model, path, context})).toEqual(expected);
            })
        )
    ;
});