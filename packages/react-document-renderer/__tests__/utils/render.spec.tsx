import {render} from '../../src';
import fs from 'fs';

describe('render', () => {
    [
        ['basic'],
        ['multi-fragments', true],
    ]
        .forEach(
            ([name, saveBefore = false]) => it(`render ${name}`, async () => {
                const dir = `${__dirname}/../../__fixtures__/examples/${name}`;
                const generated = await render(require(`${dir}/definition.json`));
                saveBefore && fs.writeFileSync(`${dir}/output.pdf`, generated);
                expect(generated.byteLength).toEqual(fs.readFileSync(`${dir}/output.pdf`).byteLength)
            })
        )
    ;
});