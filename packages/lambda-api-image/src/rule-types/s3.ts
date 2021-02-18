import {request, rule} from "../types";
import detectContentTypeFromFileName from "../utils/detectContentTypeFromFileName";

export async function s3(request: request, rule: rule, config: any) {
    const {bucket, key} = rule?.params || {};
    const bucketName = (config.buckets || {})[bucket];
    if (!bucketName || !key) throw new Error(`Unspecified bucket and/or key for s3 object`);
    const options: any = {};
    const contentType = detectContentTypeFromFileName(key);
    contentType && (options.contentType = contentType);
    return {
        input: `s3://${bucketName}/${key}`,
        options,
    };
}