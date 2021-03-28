import client from "../client";

export async function tables([path]: [string]): Promise<any> {
    await client.listTables(
        require('fs').readFileSync(path, 'utf8'),
        {
            logger: name => console.log(name),
        }
    );
}

export default tables