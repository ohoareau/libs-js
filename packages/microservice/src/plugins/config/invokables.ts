import {Map, Context, TypedMap, Config} from "../..";

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.invokables || ('object' !== typeof c.invokables) || (0 === Object.keys(c.invokables).length)) return;
    c.invokableOperations = Object.entries(<Map<TypedMap>>c.invokables).reduce((acc, [name, invokableConfig]) => {
        acc[name] = new (<any>plugins.invokableBackends[invokableConfig.type])(invokableConfig, c);
        return acc;
    }, {});
}