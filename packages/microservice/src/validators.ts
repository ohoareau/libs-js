export const maxLength = x => ({test: v => v.length <= x, message: v => `Max length exceeded (${v.length} > ${x})`});
export const minLength = x => ({test: v => v.length >= x, message: v => `Min length not satisfied (${v.length} < ${x})`});
export const values = x => ({test: v => !!x.find(a => a === v), message: v => `Value not allowed (actual: ${v}, allowed: ${x.join(',')})`});
export const email = () => ({test: v => /^[^@]+@.+\.[^.]+$/.test(v), message: () => 'Pattern not matching'});
export const uuid = () => ({test: v => /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(v), message: v => `Not a valid uuid (actual: ${v}, expected: v4 format)`});