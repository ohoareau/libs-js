import client from '../client';
import convertTableFilter from "../utils/convertTableFilter";

export async function extract([path, ...args]: string[]): Promise<any> {
    console.log(
        JSON.stringify(
            await client.extract(
                require('fs').readFileSync(path, 'utf8'),
                buildExtractConfig(args as any)
            ),
            null,
            4
        )
    );
}

function buildExtractConfig([tables]: [string]) {
    if (!tables) throw new Error(`Missing table list`);
    const config: {tables: any[]} = {tables: []};
    tables.split(',').reduce((acc, name) => {
        acc.tables.push(convertTableFilter(name))
        return acc;
    }, config);
    return config;
}

export default extract