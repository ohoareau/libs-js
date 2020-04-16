import {createContext} from 'react';

export const ConfigContext = createContext({id: 'none', name: 'none'});
export const ConfigConsumer = ConfigContext.Consumer;
export const ConfigProvider = ConfigContext.Provider;

ConfigContext.displayName = 'Config';

export default ConfigContext