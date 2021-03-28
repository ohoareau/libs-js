import {Parser} from "node-sql-parser";

const defaultParser = new Parser();

export function convert(sql: string, features: any, {parser, ...options}: any = {database: 'MARIADB'}): any {
    const r = (parser || defaultParser).astify(sql, options as any);
    Object.keys(features).forEach(feature => {
        switch (feature) {
            case 'if_exists': r['if_exists'] = true; break;
        }
    })
    return r;
}

export default convert