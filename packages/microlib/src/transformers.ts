export const upper = () => v => `${v}`.toUpperCase();
export const lower = () => v => `${v}`.toLowerCase();
export const json2string = () => v => JSON.stringify(v);
export const password = ({rounds}) => v => require('bcryptjs').hashSync(v, rounds);
export const s3file = ({bucket, key, name, contentType}) => async v => {
    await require('@ohoareau/aws').s3.setFileContent({bucket, key}, v);
    return {bucket, key, name, contentType};
}