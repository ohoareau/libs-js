import {createContext} from 'react';

export const StylesheetContext = createContext({id: 'none', name: 'none'});
export const StylesheetConsumer = StylesheetContext.Consumer;
export const StylesheetProvider = StylesheetContext.Provider;

StylesheetContext.displayName = 'Stylesheet';

export default StylesheetContext