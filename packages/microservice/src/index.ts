import * as config from "./plugins/config";
import * as handlerTypes from './handlers';

export type Map<T = any> = {[key: string]: T}
export type TypedMap = Map & {type: string}
export type Definition = TypedMap & {config?: Map}
export type Context = Map & {root: string}
export type Handler = (event: any, ctx: any) => Promise<any>|any;
export type HandlerConfig = Map & {pattern: string, name: string}
export type Executor = (operation: string, payload: any, options?: Map) => Promise<any>|any
export type SubTypeExecutor = (subType: string, operation: string, payload: any, options?: Map) => Promise<any>|any
export type RootConfig = Context & {types: Config[]}
export type Config = TypedMap & {parentType?: Config, types?: Config[], execute?: Executor, run?: Executor, subTypeExecute?: SubTypeExecutor, subTypeRun?: SubTypeExecutor}

const plugins: Map<Map> = {config};
const handlerMap: Map<{pattern: string}> = {
    get: {pattern: 'get{FullType}'},
    list: {pattern: 'get{FullTypes}'},
    update: {pattern: 'update{FullType}'},
    remove: {pattern: 'delete{FullType}'},
    create: {pattern: 'create{FullType}'},
    migrate: {pattern: 'migrate{ParentFullTypes}'},
    events: {pattern: 'receive{FullType}ExternalEvents'},
};

export const normalizeDefinition = (a): Definition => !a ? {type: 'unknown', config: {}} : (('string' === typeof a) ? {type: a, config: {}} : {...a});
export const compose = (...f: Function[]) => {
    const l = f.length;
    return l === 0  ? a => a : (l === 1 ? f[0] : f.reduce((a, b) => (...c: any) => a(b(...c))));
};
export const register = (t: string, n: string, p: any): any => (plugins[t] = (plugins[t] || {}))[n] = p;
export const needHandler = (n: string, c: Config): boolean => (c.type === 'migration') ? (n === 'migrate') : (n !== 'migrate');
export const buildFullTypeName = (config: Config): {parentFullType: string|undefined, fullType: string} => {
    const pFullTypeName = config.parentType ? buildFullTypeName(config.parentType).fullType : undefined;
    return {
        parentFullType: pFullTypeName,
        fullType: pFullTypeName
            ? `${pFullTypeName}${config.type.substr(0, 1).toUpperCase()}${config.type.substr(1)}`
            : config.type
    };
};
export const loadHandler = (hc: HandlerConfig, c: Config): Map<Handler> => {
    if (!needHandler(hc.name, c)) return {};
    let n = hc.pattern;
    const pattern = /{([^}]+)}/;
    let matches;
    while((matches = pattern.exec(n)) != null) {
        n = n.replace(matches[0], `${((c.vars||{})[matches[1]]) ? (c.vars||{})[matches[1]] : ''}`);
    }
    return {[n]: (...args) => handlerTypes[hc.name](hc, c)(...args)};
};
export const loadType = (ctx: Context, c: Config, loadTypes: (ctx: Context, types: Config[]|undefined, parentType?: Config) => Map<Handler>, pc?: Config): Map<Handler> => {
    const {parentFullType, fullType} = buildFullTypeName(c);
    c.vars = {
        type: c.type,
        types: `${c.type}s`,
        Type: `${c.type.substr(0, 1).toUpperCase()}${c.type.substr(1)}`,
        Types: `${c.type.substr(0, 1).toUpperCase()}${c.type.substr(1)}s`,
        fullType: fullType,
        fullTypes: `${fullType}s`,
        FullType: `${fullType.substr(0, 1).toUpperCase()}${fullType.substr(1)}`,
        FullTypes: `${fullType.substr(0, 1).toUpperCase()}${fullType.substr(1)}s`,
        ParentFullTypes: parentFullType ? `${parentFullType.substr(0, 1).toUpperCase()}${parentFullType.substr(1)}s` : undefined,
    };
    return {
        ...Object.entries(handlerMap).reduce((handlers, [name, hConfig]) => ({
            ...handlers,
            ...loadHandler({...hConfig, name}, {...c, parentType: pc}),
        }), {}),
        ...loadTypes(ctx, c.types, c),
    };
};
export const loadTypes = (ctx: Context, types: Config[]|undefined, pc?: Config): Map<Handler> =>
    (types||[]).reduce((handlers: Map<Handler>, type, i) => {
        const c = {middlewares: [], ...type, parentType: pc};
        if (pc) (<any>pc).types[i] = c;
        Object.entries(plugins.config || {}).forEach(([_, p]) => p(ctx, c, plugins));
        c.execute = async (operation: string, payload: any, options: Map = {}) => {
            const x = {config: c};
            return compose(
                ...(c['middlewares'] || []).map((m: (ctx: {config: Config}) => (next: () => any) => any) => m(x))
            )(({req, res}) => ({req, res}))({req: {operation, payload, options: {...options, ...x}}, res: {result: undefined}});
        };
        (<any>c).run = async (...args) => (await (<any>c).execute(...args)).res.result;
        (<any>c).subTypeExecute = async (subType: string, operation: string, payload: any, options: Map = {}) => {
            const subTypeConfig = (c.types || []).find(t => t.type === subType);
            if (!subTypeConfig) {
                throw new Error(`Unknown sub type '${subType}' for type '${c.type}' (registered: ${(c.types || []).map(t => t.type).join(', ')})`);
            }
            if (!subTypeConfig.execute) {
                throw new Error(`No executor for sub type '${subType}' of type '${c.type}'`);
            }
            return (<any>subTypeConfig).execute(operation, payload, options);
        };
        (<any>c).subTypeRun = async (...args) => (await (<any>c).subTypeExecute(...args)).res.result;
        return {...handlers, ...loadType(ctx, c, loadTypes, pc)};
    }, {})
;
export default (c: RootConfig): Map<Handler> => loadTypes({...c}, c.types);