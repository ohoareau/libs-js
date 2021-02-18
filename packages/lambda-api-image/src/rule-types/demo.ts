import {request, rule} from "../types";

export async function demo(request: request, rule: rule, config: any) {
    return {
        input: `file://${__dirname}/../../assets/demo.jpg`,
        options: {
            contentType: 'image/jpeg',
        },
    };
}