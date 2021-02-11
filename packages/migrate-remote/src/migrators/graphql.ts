import client from '../services/graphql';

async function graphql(endpoint: string, options: any = {}): Promise<any> {
    let r;
    const headers = {};
    if (options['username']) {
        const {username, password} = options;
        options['debug'] && console.log(`[migrate ${endpoint}] Creating Auth Token for username '${username}'`)
        r = await client.mutate(endpoint, `
            mutation createAuthToken($data: CreateAuthTokenInput!) {
                createAuthToken(data: $data) {
                    token
                    refreshToken
                }
            }
        `, {
            data: {
                username,
                password,
            }
        }, headers);
        if (!r) throw new Error(`[migrate ${endpoint}] Error#1001(createAuthToken): No data`)
        if (r.errors && r.errors.length) {
            if (r.errors.length === 1) {
                throw new Error(`[migrate ${endpoint}] Error#1002(createAuthToken): ${r.errors[0].message}`)
            }
            const detail = r.errors.map(e => `  - ${e.message}`).join("\n")
            throw new Error(`[migrate ${endpoint}] Error#1002(createAuthToken): Multiple errors\n\n${detail}`);
        }
        if (!r.data) throw new Error(`[migrate ${endpoint}] Error#1002(createAuthToken): No data`)
        if (!r.data.createAuthToken || !r.data.createAuthToken.token) throw new Error(`[migrate ${endpoint}] Error#1003(createAuthToken): No token`)
        headers['Authorization'] = `bearer ${r.data.createAuthToken.token}`;
    }
    options['debug'] && console.log(`[migrate ${endpoint}] Executing Migration(s)`)
    r = await client.mutate(endpoint, `
        mutation {
            migrate {
                id
            }
        }
    `, {}, headers);
    if (!r) throw new Error(`[migrate ${endpoint}] Error#1011(migrate): No data`)
    if (r.errors && r.errors.length) {
        if (r.errors.length === 1) {
            throw new Error(`[migrate ${endpoint}] Error#1012(migrate): ${r.errors[0].message}`)
        }
        const detail = r.errors.map(e => `  - ${e.message}`).join("\n")
        throw new Error(`[migrate ${endpoint}] Error#1012(migrate): Multiple errors\n\n${detail}`);
    }
    if (!r.data) throw new Error(`[migrate ${endpoint}] Error#1012(migrate): No data`)
    return r;
}

export default graphql