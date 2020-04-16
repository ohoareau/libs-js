import React, {ComponentType} from 'react';
import {StyleSheet} from '@react-pdf/renderer';
import {ModelConsumer} from './contexts/ModelContext';
import {ConfigConsumer} from './contexts/ConfigContext';
import {ContextConsumer} from './contexts/ContextContext';
import {StylesheetConsumer} from './contexts/StylesheetContext';
import {SuggestionsConsumer} from './contexts/SuggestionsContext';
import {styling} from './utils';
import handlebars from 'handlebars';
import jexl from 'jexl';

handlebars.registerHelper('multiple', (v, options) =>
    // @ts-ignore
    (v && Array.isArray(v) && 1 < v.length) ? options.fn(this) : options.inverse(this)
);

handlebars.registerHelper('nb', v => (v && Array.isArray(v)) ? v.length : 0);

export function pdfComponent<P = any>(styles, c: ComponentType<any>): ComponentType<P> {
    const classes = StyleSheet.create(styles || {});
    const Component = props => (c as Function)({...props, classes});
    return props => (
        <ContextConsumer>
            {context => (
                <StylesheetConsumer>
                    {stylesheet => (
                        <ConfigConsumer>
                            {config => (
                            <SuggestionsConsumer>
                                {suggestions => (
                                    <ModelConsumer>
                                        {model => {
                                            const ctx = {...model, _: context, config, ...context, model};
                                            const s = (names, forced = {}) => {
                                                names = (Array.isArray(names) ? names : [names]).filter(x => !!x);
                                                const styles = [] as any[];
                                                let found = false;
                                                names.forEach(name => {
                                                    if (Array.isArray(name)) {
                                                        name = name.find(n => stylesheet && stylesheet['types'] && !!stylesheet['types'][n]);
                                                    }
                                                    if (name) {
                                                        classes[name] && styles.push(classes[name]);
                                                        styles.push(styling(name, stylesheet, forced));
                                                        found = true;
                                                    }
                                                });
                                                if (!found) {
                                                    names.forEach(name => {
                                                        classes[name] && styles.push(classes[name]);
                                                    });
                                                    forced && styles.push(forced);
                                                }
                                                return styles;
                                            };
                                            const v = (x, extra = {}) => {
                                                if ('string' !== typeof x) return x;
                                                if ('$' === x.slice(0, 1)) return jexl.evalSync(x.slice(1), {...ctx, ...extra});
                                                return handlebars.compile(x)({...ctx, ...extra});
                                            };
                                            const test = (x) => !!v(x);
                                            const cfg = {visible: true, ...(config[props['id']] || {})};
                                            return (
                                                <Component {...props}
                                                           stylesheet={stylesheet}
                                                           config={config}
                                                           model={model}
                                                           suggestions={suggestions}
                                                           s={s}
                                                           v={v}
                                                           cfg={cfg}
                                                           test={test}
                                                />
                                            );
                                        }}
                                    </ModelConsumer>
                                )}
                            </SuggestionsConsumer>
                            )}
                        </ConfigConsumer>
                    )}
                </StylesheetConsumer>
            )}
        </ContextConsumer>
    );
}