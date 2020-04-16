import {createContext} from 'react';

export const ModelContext = createContext({});
export const ModelConsumer = ModelContext.Consumer;
export const ModelProvider = ModelContext.Provider;

ModelContext.displayName = 'Model';

export default ModelContext