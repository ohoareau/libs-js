export const boolean = () => ({test: v => 'boolean' === typeof v, message: v => `Not a boolean (actual: ${v})`});
export const maxLength = x => ({test: v => v.length <= x, message: v => `Max length exceeded (${v.length} > ${x})`});
export const minLength = x => ({test: v => v.length >= x, message: v => `Min length not satisfied (${v.length} < ${x})`});
export const values = x => ({test: v => !!x.find(a => a === v), message: v => `Value not allowed (actual: ${v}, allowed: ${x.join(',')})`});
export const match = ({pattern, flags = undefined, message = undefined}: {pattern: string, flags?: string|undefined, message?: string|undefined}) => ({test: v => new RegExp(pattern, flags).test(v), message: v => message ? (<any>message).replace('{{v}}', v) : `Malformed (actual: ${v}, expected: ${pattern})`});
export const email = () => match({pattern: '[^@]+@.+\.[^.]+$', message: 'Not a valid email'});
export const uuid = () => match({pattern: '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', flags: 'i', message: `Not a valid uuid (actual: {{v}}, expected: v4 format)`});
export const url = () => match({pattern: '^http[s]?://.$', flags: 'i', message: `Not a valid URL`});
export const arn = () => match({pattern: '^arn:[^:]*:[^:]*:[^:]*:[^:]*:.+$', message: `Not a valid AWS ARN`});
