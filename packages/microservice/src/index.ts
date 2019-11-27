import * as config from "./plugins/config";
import * as handlerTypes from './handlers';
import * as commonHandlerTypes from './common-handlers';

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

const getRemoteExecutorFromDsn = dsn => {
    const def = Object.entries(plugins.remoteExecutor || {}).find(([_, v]) => v.supports(dsn));
    if (!def) throw new Error(`Unsupported remote execution format: '${dsn}'`);
    const [,{execute}] = def;
    return execute;
};

export const normalizeDefinition = (a): Definition => !a ? {type: 'unknown', config: {}} : (('string' === typeof a) ? {type: a, config: {}} : {...a});
export const compose = (...f: Function[]) => {
    const l = f.length;
    return l === 0  ? a => a : (l === 1 ? f[0] : f.reduce((a, b) => (...c: any) => a(b(...c))));
};
export const register = (t: string, n: string, p: any): any => (plugins[t] = (plugins[t] || {}))[n] = p;
export const buildFullTypeName = (config: Config): {parentFullType: string|undefined, fullType: string} => {
    const pFullTypeName = config.parentType ? buildFullTypeName(config.parentType).fullType : undefined;
    return {
        parentFullType: pFullTypeName,
        fullType: pFullTypeName
            ? `${pFullTypeName}${config.type.substr(0, 1).toUpperCase()}${config.type.substr(1)}`
            : config.type
    };
};
export const loadHandler = (factory, hc: HandlerConfig, c: Config): Map<Handler> => {
    let n = hc.pattern;
    const pattern = /{([^}]+)}/;
    let matches;
    while((matches = pattern.exec(n)) != null) {
        n = n.replace(matches[0], `${((c.vars||{})[matches[1]]) ? (c.vars||{})[matches[1]] : ''}`);
    }
    return {[n]: (...args) => factory(hc, c)(...args)};
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
        ...Object.entries(handlerTypes).reduce((handlers, [name, {factory, ...hConfig}]) => ({
            ...handlers,
            ...loadHandler(factory, {...hConfig, name}, {...c, parentType: pc}),
        }), {}),
        ...loadTypes(ctx, c.types, c),
        ...(c.handlers ? Object.entries(c.handlers).reduce((acc, [k,h]) => {acc[k] = async (event, context) => (<Function>h)(event, {...context, config: c}); return acc;}, {}) : {}),
    };
};
export const loadTypes = (ctx: Context, types: Config[]|undefined, pc?: Config): Map<Handler> =>
    (types||[]).reduce((handlers: Map<Handler>, type, i) => {
        const c = type;
        if (false === c.handlers) return handlers;
        c.middlewares = c.middlewares || [];
        c.parentType = pc;
        if (pc) (<any>pc).types[i] = c;
        c.executeRemote = (dsn: string, payload: Map = {}, options: Map = {}): Promise<any> =>
            getRemoteExecutorFromDsn(dsn)(dsn, payload, {...options, config: c, configContext: ctx})
        ;
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
        Object.entries(plugins.config || {}).forEach(([_, p]) => p(ctx, c, plugins));
        return {...handlers, ...loadType(ctx, c, loadTypes, pc)};
    }, {})
;
export default (c: RootConfig): Map<Handler> => {
    const handlers = loadTypes(c, c.types);
    Object.values(commonHandlerTypes).forEach((loader: Function) => loader(c, handlers));
    return handlers;
}