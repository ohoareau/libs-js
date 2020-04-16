import {createContext} from 'react';

export const ContextContext = createContext({});
export const ContextConsumer = ContextContext.Consumer;
export const ContextProvider = ContextContext.Provider;

ContextContext.displayName = 'Context';

export default ContextContext