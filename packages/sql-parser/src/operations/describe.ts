import client from '../client';

export async function describe([path]: [string]): Promise<any> {
    console.log({
        path,
        ...(await client.describe(require('fs').readFileSync(path, 'utf8'))),
    })
}

export default describe