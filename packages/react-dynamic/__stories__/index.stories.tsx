import React, {useCallback} from 'react';
import i18n from 'i18next';
import {Provider} from 'react-redux';
import {register} from '@ohoareau/react-moduled';
import {initReactI18next} from 'react-i18next';
import {reducer as formReducer} from 'redux-form';
import {ModuleTypeActionFormWrapper} from '../src';
import {createStore, combineReducers} from 'redux'

export default {title: 'React Dynamic', component: ModuleTypeActionFormWrapper}

const rootReducer = combineReducers({app: (state = {}) => state, form: formReducer});

i18n
    .use(initReactI18next)
    .init({
        resources: {en: {}},
        lng: 'en',
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        }
    })
    .then()
;

const store = createStore(
    rootReducer,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

register('config', {

});
register('definition', require('./modules/root'), 'root');
register('load', async (rawModule, {module: moduleName}) => {
    const {translations = {}, ...module} = {...rawModule};
    Object.entries(translations).forEach(([k, v]) => i18n.addResourceBundle(k, 'root' === moduleName ? 'translation' : `module_${moduleName}`, v));
    return module;
});

const buildStory = (type, action) => () => {
    const defaultOnSubmit = useCallback(values => {
        console.log(values);
    }, []);
    return (
        <Provider store={store}>
            <ModuleTypeActionFormWrapper form={`${type}_${action}`} module={'root'} type={type} action={action}
                                         onSubmit={defaultOnSubmit} actionButtons={{submit: 'Submit'}} />
        </Provider>
    );
}

export const basic = buildStory('model1', 'action1');
export const withDynamicContent = buildStory('model1', 'action2');
export const fieldTypesShowcase = buildStory('model1', 'action3');