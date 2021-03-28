import * as operations from '../operations';

export async function cli(operation: string, args: string[]): Promise<any> {
    return (operations[operation] || operations['unknown'])(args, {operation});
}

export default cli