import {
    Context,
    DeclarativeTypesList,
    HandlerConfig,
    HandlerList,
    HandlerMap,
    TypeConfig,
    TypeVariableList
} from "./types";
import * as handlerTypes from './handler-types';

const handlerMap: HandlerMap = {
    get: {pattern: 'get{FullType}'},
    list: {pattern: 'get{FullTypes}'},
    update: {pattern: 'update{FullType}'},
    remove: {pattern: 'delete{FullType}'},
    create: {pattern: 'create{FullType}'},
    migrate: {pattern: 'migrate{ParentFullTypes}'},
    events: {pattern: 'receive{FullType}ExternalEvents'},
};

export const isHandlerRequired = (name: string, config: TypeConfig): boolean => {
    if (config.type === 'migration') {
        return name === 'migrate';
    }
    return name !== 'migrate';
};

export const buildFullTypeName = (config: TypeConfig): {parentFullType: string|undefined, fullType: string} => {
    const parentFullTypeName = config.parentType ? buildFullTypeName(config.parentType).fullType : undefined;
    return {
        parentFullType: parentFullTypeName,
        fullType: parentFullTypeName
            ? `${parentFullTypeName}${config.type.substr(0, 1).toUpperCase()}${config.type.substr(1)}`
            : config.type
    };
};

export const buildTypeVariables = (config: TypeConfig): TypeVariableList => {
    const {parentFullType, fullType} = buildFullTypeName(config);
    return {
        type: config.type,
        types: `${config.type}s`,
        Type: `${config.type.substr(0, 1).toUpperCase()}${config.type.substr(1)}`,
        Types: `${config.type.substr(0, 1).toUpperCase()}${config.type.substr(1)}s`,
        fullType: fullType,
        fullTypes: `${fullType}s`,
        FullType: `${fullType.substr(0, 1).toUpperCase()}${fullType.substr(1)}`,
        FullTypes: `${fullType.substr(0, 1).toUpperCase()}${fullType.substr(1)}s`,
        ParentFullTypes: parentFullType ? `${parentFullType.substr(0, 1).toUpperCase()}${parentFullType.substr(1)}s` : undefined,
    };
};

export const buildHandlerName = (handlerConfig: HandlerConfig, typeVars: TypeVariableList): string => {
    let name = `${handlerConfig.pattern}`;
    const pattern = /{([^}]+)}/;
    let matches;
    while((matches = pattern.exec(name)) != null) {
        name = name.replace(matches[0], typeVars[matches[1]])
    }
    return name;
};

export const loadHandler = (handlers: HandlerList, handlerConfig: HandlerConfig, typeConfig: TypeConfig): void => {
    const typeVars = buildTypeVariables(typeConfig);
    // lazy loading of handler building
    handlers[buildHandlerName(handlerConfig, typeVars)] = (...args) => handlerTypes[handlerConfig.name](handlerConfig, typeConfig, typeVars)(...args);
};

export const registerTypeHandlers = (context: Context, handlers: HandlerList, config: TypeConfig, registerSubTypesHandlers: (context: {root: string}, handlers: HandlerList, types: DeclarativeTypesList, parentType?: TypeConfig) => HandlerList, parentConfig?: TypeConfig): HandlerList => {
    handlers = Object.keys(handlerMap).reduce((handlers, name: string) => {
        isHandlerRequired(name, config) && loadHandler(handlers, <HandlerConfig>{...handlerMap[name], name}, {...config, parentType: parentConfig});
        return handlers;
    }, handlers);
    return config.types ? registerSubTypesHandlers(context, handlers, config.types, config) : handlers;
};
