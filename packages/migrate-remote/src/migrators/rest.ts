import client from '../services/http';

async function rest(endpoint: string, options: any = {}): Promise<any> {
    let r;
    const headers = {};
    options['debug'] && console.log(`[migrate ${endpoint}] Executing REST Migration(s)`)
    r = await client.post(`${endpoint}/migrate`, {}, headers);
    return r;
}

export default rest