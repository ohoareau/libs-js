import {createContext} from 'react';

export const SuggestionsContext = createContext({});
export const SuggestionsConsumer = SuggestionsContext.Consumer;
export const SuggestionsProvider = SuggestionsContext.Provider;

SuggestionsContext.displayName = 'Suggestions';

export default SuggestionsContext