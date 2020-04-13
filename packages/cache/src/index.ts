const caches = {};

export const readCache = (group, key, defaultValue: any = undefined) => (caches[group] || {})[key] || defaultValue;
export const writeCache = (group, key, value) => (caches[group] = caches[group] || {})[key] = value;
export const readWriteCache = (group, key, factory) => readCache(group, key) || writeCache(group, key, factory());

export default {get: readCache, set: writeCache, getset: readWriteCache}