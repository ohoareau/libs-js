import client from '../client';

export async function validate([path]: [string]): Promise<any> {
    let errors: Error[] = [];
    try {
        errors = await client.validate(
            require('fs').readFileSync(path, 'utf8'),
            {
                onError: (error, rawStatement) => {
                    console.error(`Error with statement: ${rawStatement}: ${error.message}`);
                }
            }
        );
    } catch (e) {
        console.error(`Unexpected error: ${e.message}`);
        errors.push(e);
    }
    if (errors.length) throw new Error(`${errors.length} error(s) detected, see above.`);
}

export default validate