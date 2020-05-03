import React, {lazy, memo, Suspense} from 'react';
import {TicketDesigner} from '../src';

const caches = {};

const getSvgFileComponent = (name) => {
    if (!caches[name]) {
        const path = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        const Component = lazy(() => import(`./svgs/${path}.tsx`));
        caches[name] = memo(props  => (
            <Suspense fallback={<div />}>
                <Component {...props} />
            </Suspense>
        ));
    }
    return caches[name];
};

const SvgComponent = ({name, ...props}: any) => {
    const Component = getSvgFileComponent(name);
    return <Component {...props} />;
};

export default {
    title: 'TicketDesigner',
    component: TicketDesigner,
}

export const basic = () => <TicketDesigner svgComponent={SvgComponent} />;